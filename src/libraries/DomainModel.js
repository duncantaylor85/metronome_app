import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/BeatSequence.js"

export { TimeSignature, BPM, BarSequence, BasicDuration, SimpleBeatSequenceCreator }

/**
 * Class representing a time signature of given numerator and denominator
 */
class TimeSignature {
  /**
   * 
   * @param {Number} numerator should be a positive integer
   * @param {BasicDuration} denominator should be one of _1st, _2nd, _4th, _8th, _16th, _32nd
   */
  constructor(numerator, denominator) {
    this.numerator = numerator
    this.denominator = denominator
  }

  /**
   * @returns {Number} positive integer representing the numerator
   */
  getNumerator() {
    return this.numerator
  }

  /**
   * @returns {Number} integer in {1,2,4,8,16,32} representing the denominator as displayed
   */
  getDenominatorAsNumber() {
    return BasicDuration.toInteger(this.denominator)
  }

  /**
   * @returns {TimeSignature} deep copy of this time signature object
   */
  copy() {
    return new TimeSignature(this.numerator, this.denominator)
  }
}

/**
 * Class representing a metronome marking of beats per minute,
 * and the duration of each beat (of 1st, 2nd, 4th, 8th, 16th, 32nd)
 */
class BPM {
  /**
   * @param {Number} perMinute how many beats of this denominator per minute?
   * @param {BasicDuration} denominator the duration of each beat
   */
  constructor(perMinute, denominator) {
    this.perMinute = perMinute
    this.denominator = denominator
  }

  /**
   * @returns {Number} number of beats of the given duration per minute
   */
  getPerMinute() {
    return this.perMinute
  }
  /**
   * @returns {BasicDuration} duration marking of this metronome mark
   */
  getDenominatorAsNumber() {
    return BasicDuration.toInteger(this.denominator)
  }

  /**
   * @returns {BPM} returns a deep copy of this metronome marking
   */
  copy() {
    return new BPM(this.perMinute, this.denominator)
  }
}

/**
 * Represents the sequence of bars the user is currently working on.
 */
class BarSequence {
  constructor() {
    this.bars = []
  }
  /**
   * Adds count bars of the given time signature to the end of the bar
   * sequence, or if empty, creates count bars as specified.
   * @param {TimeSignature} timeSig 
   * @param {BPM} bpm 
   * @param {Number} count 
   * @returns {void}
   */
  addBarsToEnd(timeSig, bpm, count) {
    for (let i = 1; i <= count; i++) {
      this.bars.push(new Bar(timeSig, bpm))
    }
  }

  /**
   * Replace the bar at the given bar number with a different bar, using
   * the given time signature and metronome marking
   * @param {Number} barNumber The bar to replace
   * @param {TimeSignature} timeSig the time signature for the replacement bar
   * @param {BPM} bpm the metronome marking of the replacement bar
   * @returns {void}
   */
  replaceBar(barNumber, timeSig, bpm) {
    this.bars[barNumber - 1] = new Bar(timeSig, bpm)
  }

  /**
   * @returns {Number} the number of bars in this bar sequence
   */
  getBarCount() {
    return this.bars.length
  }

  /**
   * Returns a copy of the time signature of the bar at the given bar number
   * @param {Number} barNumber the bar number to get the time signature for
   * @returns {TimeSignature} returns a copy of the time signature of the bar at the given bar number
   */
  getTimeSigOf(barNumber) {
    return this.bars[barNumber - 1].getTimeSig()
  }

  /**
   * Returns a copy of the tempo marking of the bar at the given bar number
   * @param {Number} barNumber the bar number to get the tempo marking for
   * @returns {BPM} returns a copy of the tempo marking of the bar at the given bar number
   */
  getTempoOf(barNumber) {
    return this.bars[barNumber - 1].getTempo()
  }

  /**
   * Removes the bar at the given bar number from the bar sequence; following
   * bars are renumbered accordingly.
   * @param {Number} barNumber Bar number of the bar to remove
   * @returns {void}
   */
  deleteBar(barNumber) {
    this.bars = this.bars.filter((bar, index) => {
      return index != barNumber - 1
    })
  }

  // JSDoc doesn't allow imports to be treated as types, hence the explicit name below of BSTR
  /**
   *
   * @param {IBeatSequenceCreator} beatSequenceCreator
   * @returns {BeatSequenceTimeRepresentation} BeatSequenceTimeRepresentation
   */
  getTimeRepresentation(beatSequenceCreator) {
    return beatSequenceCreator.createFrom(this)
  }
}
class Bar {
  constructor(timeSig, tempo) {
    this.timeSig = timeSig
    this.tempo = tempo
  }

  /**
   * @returns {TimeSignature}
   */
  getTimeSig() {
    return this.timeSig.copy()
  }
  /**
   * @returns {BPM}
   */
  getTempo() {
    return this.tempo.copy()
  }
}
const BasicDuration = {
  _1st: 0,
  _2nd: 1,
  _4th: 2,
  _8th: 3,
  _16th: 4,
  _32nd: 5,
  fromInteger(i) {
    switch (i) {
      case 1:
        return BasicDuration._1st
      case 2:
        return BasicDuration._2nd
      case 4:
        return BasicDuration._4th
      case 8:
        return BasicDuration._8th
      case 16:
        return BasicDuration._16th
      case 32:
        return BasicDuration._32nd
      default:
        throw "Tried to get a basic duration of " + i + " which is not one of 1,2,4,8,16,32"
    }
  },
  toInteger(bd) {
    return Math.pow(2, bd)
  },
}

// Slightly different way of having an explicit interface, since JSDoc isn't working at the moment
class IBeatSequenceCreator {
  constructor() {}
  /**
   * @public
   * @param {BarSequence} barSequence
   * @returns {BeatSequenceTimeRepresentation}
   */
  createFrom(barSequence) {
    throw "Not implemented"
  }
}

class SimpleBeatSequenceCreator extends IBeatSequenceCreator {
  /**
   * @public
   * @param {BarSequence} barSequence
   * @returns {BeatSequenceTimeRepresentation} BeatSequenceTimeRepresentation
   */
  createFrom(barSequence) {
    let beats = barSequence.bars.map((bar, i) => this.beatsFromBar(bar, i + 1)).flat()
    return new BeatSequenceTimeRepresentation(beats)
  }

  /**
   * @private
   * @param {Bar} bar
   * @returns {Array.<BeatTimeRepresentation>}
   */
  beatsFromBar(bar, barNumber) {
    let tempo = bar.getTempo()
    let timeSig = bar.getTimeSig()

    /*
    examples (tempo is BPM,denominator)
    what happens when denominators equal?
    tempo=120,4; timeSig=4/4, each 4 lasts 60/120 seconds, there are 4 per bar
    tempo=150,4; timeSig=2/4, each 4 lasts 60/150 seconds, there are 2 per bar
    tempo=30,4; timeSig=3/4, each 4 lasts 60/30 seconds, there are 3 per bar
    
    in general: number of seconds delay per tempo subdivision= 60/tempo.bpm
    
    what happens when denominators differ?
    tempo=120,4 timeSig=4/8, each 4 lasts 60/120 seconds, each 8 lasts 30/120 seconds
    tempo=120,2 timeSig=4/8, each 2 lasts 60/120 seconds, each 8 lasts 15/120 seconds
    tempo=240,4 timeSig=2/2, each 4 lasts 60/240 seconds, each 2 lasts 120/240 seconds

    let tempo subdivision be t, timeSig subdivision be s
    ratio (t/s) is number of tempo subdivisions per time sig subdivision
    t/s= 1: same
    t/s > 1: multiple tempo subdivs per time sig subdiv
    t/s < 1: multiple time sig subdivs per tempo subdiv

    quick fractional arithmetic: then (60/tempo.bpm) * (t/s) gives
    number of seconds delay per time sig subdivision

    check: 
      tempo=120,2 timeSig=4/8, each 2 lasts 60/120 seconds; (60/120) * (2/8) = 15/120 for each 8 
      tempo=240,4 timeSig=2/2, each 4 lasts 60/240 seconds; (60/240) * (4/2) = 120/240 for each 2
      seems to work!

    then just *1000 for millis duration
    */
    let tsRatio = tempo.getDenominatorAsNumber() / timeSig.getDenominatorAsNumber()
    let timeRatio = 60 / tempo.getPerMinute()
    let millisPerSubdivision = timeRatio * tsRatio * 1000

    let beats = new Array(timeSig.getNumerator())
      .fill(null)
      .map((_, i) => 
        new BeatTimeRepresentation(millisPerSubdivision, false, i === 0, barNumber)
        )

    return beats
  }
}
