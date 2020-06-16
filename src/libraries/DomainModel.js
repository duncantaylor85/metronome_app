import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/BeatSequence.js"

export { TimeSignature, BPM, BarSequence, BasicDuration, SimpleBeatSequenceCreator }

class TimeSignature {
  constructor(numerator, denominator) {
    this.numerator = numerator
    this.denominator = denominator
  }

  getNumerator() {
    return this.numerator
  }

  getDenominatorAsNumber() {
    return BasicDuration.toInteger(this.denominator)
  }

  copy() {
    return new TimeSignature(this.numerator, this.denominator)
  }
}
class BPM {
  constructor(perMinute, denominator) {
    this.perMinute = perMinute
    this.denominator = denominator
  }

  getPerMinute() {
    return this.perMinute
  }
  getDenominatorAsNumber() {
    return BasicDuration.toInteger(this.denominator)
  }
  copy() {
    return new BPM(this.perMinute, this.denominator)
  }
}
class BarSequence {
  constructor() {
    this.bars = []
  }

  addBarsToEnd(timeSig, bpm, count) {
    for (let i = 1; i <= count; i++) {
      this.bars.push(new Bar(timeSig, bpm))
    }
  }

  replaceBar(barNumber, timeSig, bpm) {
    this.bars[barNumber - 1] = new Bar(timeSig, bpm)
  }

  getBarCount() {
    return this.bars.length
  }

  getTimeSigOf(barNumber) {
    return this.bars[barNumber - 1].getTimeSig()
  }
  getTempoOf(barNumber) {
    return this.bars[barNumber - 1].getTempo()
  }
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
   *
   * @param {BarSequence} barSequence
   * @returns {BeatSequenceTimeRepresentation}
   */
  createFrom(barSequence) {
    throw "Not implemented"
  }
}

class SimpleBeatSequenceCreator extends IBeatSequenceCreator {
  /**
   *
   * @param {BarSequence} barSequence
   * @returns {BeatSequenceTimeRepresentation} BeatSequenceTimeRepresentation
   */
  createFrom(barSequence) {
    let beats = barSequence.bars.map((bar, i) => this.beatsFromBar(bar, i + 1)).flat()
    return new BeatSequenceTimeRepresentation(beats)
  }

  /**
   *
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
