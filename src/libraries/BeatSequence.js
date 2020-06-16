export { BeatSequenceTimeRepresentation, BeatTimeRepresentation }

class BeatSequenceTimeRepresentation {
  /**
   *
   * @param {Array.<BeatTimeRepresentation>} beats
   */
  constructor(beats) {
    this.beats = beats
  }

  /*********************************************************
   * PUBLIC METHODS
   *********************************************************/
  /**
   *
   * @param {Number} position integer indicating the bar number to trim the sequence to, so position becomes "bar 1" of
   * the new BSTR; must be <= the total bar count
   * @returns {BeatSequenceTimeRepresentation} the BSTR resulting from removing all bars numbered up to, but not including, position
   * @public
   */
  trim(position) {
    return new BeatSequenceTimeRepresentation(this.beats.filter(beat => beat.associatedBarNumber >= position))
  }

  /**
   *
   * @param {Number} countInLength the number of times to replicate the first bar-worth of beats of the BSTR
   * @returns {BeatSequenceTimeRepresentation} a new BSTR, with the first bar-worth of beats of this BSTR replicated barCount more times and added to the front
   * @public
   */
  addCountIn(countInLength) {
    let countInBar = this.getFirstBarCountIn()
    let fullCountIn = this.repeatArray(countInLength, countInBar)
    return new BeatSequenceTimeRepresentation(fullCountIn.concat(this.beats))
  }

  /**
   *
   * @param {Number} index get the beat at the given index (0-indexing)
   * @returns {BeatTimeRepresentation}
   * @public
   */
  getBeat(index) {
    return this.beats[index]
  }

  /**
   *
   * @param {Number} index the index of the beat to check
   * @returns {Boolean} whether or not the beat at this index is the final beat
   * @public
   */
  isFinalBeat(index) {
    return index === this.beats.length - 1
  }

  /**********************************************
   * PRIVATE METHODS
   **********************************************/
  /**
   * @returns {Array.<BeatTimeRepresentation>} the first bar of the beats, in order, as a single-bar count-in
   * @private
   */
  getFirstBarCountIn() {
    // relying on filtering being in-order, but should be fine
    return this.beats.filter(beat => beat.associatedBarNumber === 1).map(beat => new BeatTimeRepresentation(beat.durationInMillis, true, beat.isFirstBeatOfBar, beat.associatedBarNumber))
  }

  /**
   * @description Repeat the given array a a number of times given by times, concatenate the results.
   * This is a shallow copy - any changes to an element of one array will be reflected in the other
   * repeats.
   * @template T
   * @param {Number} times number of times to repeat the array's contents
   * @param {Array.<T>} a array to repeat
   * @returns {Array.<T>} the array formed from {@link times} repetitions of {@link a}'s contents in order
   * @private
   */
  repeatArray(times, a) {
    return new Array(times).fill(a).flat()
  }
}

class BeatTimeRepresentation {
  /**
   * @description Representation of a beat using a time duration
   * @param {Number} durationInMillis duration of the beat in milliseconds
   * @param {Boolean} isCountIn is this beat part of a count-in?
   * @param {Boolean} isFirstBeatOfBar  is this beat the first one in its bar?
   * @param {Number} associatedBarNumber the bar number this beat comes from
   */
  constructor(durationInMillis, isCountIn, isFirstBeatOfBar, associatedBarNumber) {
    this._durationInMillis = durationInMillis
    this._isCountIn = isCountIn
    this._isFirstBeatOfBar = isFirstBeatOfBar
    this._associatedBarNumber = associatedBarNumber
  }

  /**
   *
   * @param {BeatTimeRepresentation} other
   * @returns {Boolean} do these BTRs have value equality?
   */
  equals(other) {
    return this.associatedBarNumber === other.associatedBarNumber &&
      this.durationInMillis === other.durationInMillis &&
      this.isCountIn === other.isCountIn &&
      this.isFirstBeatOfBar === other.isFirstBeatOfBar
  }
  /**
   * @returns {Number}
   */
  get durationInMillis() {
    return this._durationInMillis
  }

  /**
   * @returns {Boolean}
   */
  get isCountIn() {
    return this._isCountIn
  }

  /**
   * @returns {Boolean}
   */
  get isFirstBeatOfBar() {
    return this._isFirstBeatOfBar
  }

  /**
   * @returns {Number}
   */
  get associatedBarNumber() {
    return this._associatedBarNumber
  }


}
