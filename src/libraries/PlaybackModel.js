import { getters } from "@/store/store.js";
import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/DomainModel.js";

export { CountInController, UserPositionController, PlaybackCoordinator };


/**
 * Controls whether or not a count-in is occurring, how long it is, and adding the count-in to the beat sequence
 */
class CountInController {
  /**
   * Create a new count-in controller; initially with no count-in, and 0 count-in length
   */
  constructor() {
    this.enabled = false;
    this.countInLength = 0;
  }
  /**
   * Adds the count-in beats to the BSTR
   * @param {BeatSequenceTimeRepresentation} trimmedBeatSeq beat sequence from the start of the bar that is currently selected
   * @returns {BeatSequenceTimeRepresentation} the input beat sequence with the count-in of appropriate length prepended
   */
  addCountIn(trimmedBeatSeq) {
    const fullSequence = trimmedBeatSeq.addCountIn(this.countInLength);
    return fullSequence;
  }

  /**
   * Sets whether or not the count-in is enabled or disabled
   * @param {Boolean} newValue is the count-in enabled or disabled?
   */
  toggleCountIn(newValue) {
    this.enabled = newValue
  }

  /**
   * Sets the number of bars of count-in to do
   * @param {Number} barCount number of bars of count-in
   */
  changeCountInLength(barCount) {
    this.countInLength = barCount
  }
}

/**
 * Handles the changes in user bar selection, the current bar number during playback, highlighting those current bars, and rewinding.
 */
class PositionController {
  /**
   * Creates a new position controller that uses barHighlighterInterface to send highlight messages to the music rendering
   * @param {{ highlightCountIn: (barNumber: Number) => void, highlightNormal: (barNumber: Number) => void}} barHighligherInterface 
   * an interface allowing highlighting of a given bar
   * @param {CountInController} countInController the count-in controller for this playback unit
   */
  constructor(barHighligherInterface, countInController) {
    this.currentUserSelectedBar = 1;
    this.currentBar = 1;
    this.musicRenderer = barHighligherInterface;
    this.countInController = countInController;
  }

  /**
   * Trims the front of the BSTR until the currently selected bar is the first element, then prepends the count-in bars
   * @param {BeatSequenceTimeRepresentation} bSTR the raw beat sequence for playback, untrimmed and without a count-in
   * @returns the input beat sequence, taken from the current bar number, with the count-in of appropriate length prepended
   */
  createPlayableTimeRepresentation(bSTR) {
    const trimmedBarSeq = bSTR.trim(this.currentUserSelectedBar);
    const fullSequence = this.countInController.createCountIn(trimmedBarSeq);
    return fullSequence;
  }

  /**
   * Set user-selected position and current position to the beginning of the full bar sequence, highlight first bar
   */
  resetAllPositions() {
    this.currentBar = 1
    this.currentUserSelectedBar = 1
    this.musicRenderer.highlightNormal(1)
  }

  /**
   * Set current bar position to user-selected position, highlight current bar
   */
  restoreUserPosition() {
    this.currentBar = this.currentUserSelectedBar
    this.musicRenderer.highlightNormal(barNumber)
  }

  /**
   * Changes the current bar to the given bar number, then highlight that bar normally (i.e. not a count-in)
   * @param {Number} barNumber bar to change to
   */
  changePositionNormal(barNumber) {
    this.currentBar = barNumber
    this.musicRenderer.highlightNormal(barNumber)
  }

  /**
   * Changes the current bar to the given bar number, then highlight that bar as a count-in
   * @param {Number} barNumber bar to change to
   */
  changePositionCountIn(barNumber) {
    this.currentBar = barNumber
    this.musicRenderer.highlightCountIn(barNumber)
  }

  /**
   * Changes the user's position and current bar to the given bar number, and highlights it normally.
   * NOTE: should only be called when the playback has been paused, or behaviour will be undefined
   * @param {Number} barNumber  bar to change to
   */
  changeUserPosition(barNumber) {
    // TODO
    console.log("PlaybackModel.js::PositionController.changeUserPosition() needs playback paused, so the interface needs to pause itself")
    // this.playbackCoordinator.pausePlaying()
    this.currentUserSelectedBar = barNumber
    this.currentBar = barNumber
    this.musicRenderer.highlightNormal(barNumber)
  }

  /**
   * Resets current position to user position, or if the same, reset to the beginning.
   */
  rewind() {
    if (this.currentBar === this.currentUserSelectedBar) {
      this.resetAllPositions()
    }
    else {
      this.restoreUserPosition()
    }
  }
}

/**
 * Provides the interface for playback, pause, rewind; also generates interfaces for the count-in controller and user position controller 
 */
class PlaybackCoordinator {
  /**
   * 
   * @param {{ playHigh: () => void, playLow: () => void }} clickProvider interface to audio playback for high and low clicks
   * @param {{ getTimeRepresentation: () => BeatSequenceTimeRepresentation }} timeRepProvider interface to a provider of the current bar sequence's 
   * beat sequence time representation
   * @param {{ highlightCountIn: (barNumber: Number) => void, highlightNormal: (barNumber: Number) => void}} barHighlighter an interface allowing highlighting of a given bar
   */
  constructor(clickProvider, timeRepProvider, barHighlighter) {
    this.timeRepProvider = timeRepProvider;
    this.countInController = new CountInController();
    this.positionController = new PositionController(barHighlighter, this.countInController);
    this.recursivePlay = new RecursivePlay(clickProvider, this.positionController);
  }

  /**
   * @returns {{ toggleCountIn: (value: Boolean) => void, changeCountInLength: (barCount: Number) => void}} the UI's interface to the count-in controller
   */
  getCountInInterface() {
    return {
      toggleCountIn: this.countInController.toggleCountIn,
      changeCountInLength: this.countInController.changeCountInLength
    }
  }

  /**
   * @returns {{ changeUserPosition: (barNumber: Number) => void }} the UI's interface to the user position portion of the position controller
   */
  getPositionInterface() {
    return {
      changeUserPosition: this.positionController.changeUserPosition
    }
  }

  /**
   * Stop playing the current bar sequence, and rewind the playback to the user position; if already at the user position, rewind to the beginning
   */
  rewind() {
    this.recursivePlay.rewindSequence()
  }
  
  /**
   * Start playing the current bar sequence from the current position
   */
  startPlaying() {
    const bSTR = getters.getTimeRepresentation();
    const fullSequence = this.positionController.createPlayableTimeRepresentation(bSTR);
    this.recursivePlay.playSequence(fullSequence);
  }

  /**
   * Stop playing the current bar sequence, but leave the current position at the current bar.
   */
  pausePlaying() {
    this.recursivePlay.pauseSequence()
  }
}

/**
 * Controls the timing for playback, the pausing, and the rewinding.
 */
class RecursivePlay {
  /**
   * @param {{ playHigh: () => void, playLow: () => void }} clickProvider interface to audio playback for high and low clicks
   * @param {PositionController} positionController this playback unit's position controller
   */
  constructor(clickProvider, positionController) {
    this.cancelHandle = null;
    this.currentIndex = null;
    this.clickProvider = clickProvider;
    this.positionController = positionController;
    this.bSTR = null;
    this.musicRenderer = musicRenderer;
  }

  /**
   * Start playing the current bar sequence from the given position and with the specified count-in (if any)
   * @param {BeatSequenceTimeRepresentation} fullSequence the complete beat sequence, trimmed and including count-ins, to play
   */
  playSequence(fullSequence) {
    this.bSTR = fullSequence
    this.currentIndex = 0
    this.play()
  }

  /**
   * Plays the current beat at the appropriate pitch, highlights the appropriate bar, and if not at the end of the 
   * bar sequence, delays for the current beat length and recursively calls itself for the next beat
   */
  play() {
    let beat = this.bSTR.getBeat(this.currentIndex)
    this.playBeat(this.currentIndex)
    this.highlight(this.currentIndex)
    if (!this.bSTR.isFinalBeat(this.currentIndex)) {
      this.cancelObject = window.setTimeout(() => {
        this.currentIndex++
        this.play()
      }, beat.durationInMillis)
    }
  }

  /**
   * Makes a sound of high or low pitch depending on whether or not the beat is first in the bar.
   * @param {BeatTimeRepresentation} beat the current beat to play
   */
  playBeat(beat) {
    if (beat.isFirstBeatOfBar) {
      this.clickProvider.playHigh()
    }
    else {
      this.clickProvider.playLow()
    }
  }

  /**
   * Highlights the current bar depending on whether or not the beat is a count-in
   * @param {BeatTimeRepresentation} beat the current beat being played
   */
  highlight(beat) {
    if (beat.isCountIn) {
      this.positionController.changePositionCountIn(beat.associatedBarNumber)
    } 
    else {
      this.positionController.changePositionNormal(beat.associatedBarNumber)
    }
  }

  /**
   * Stop playing and rewind, either to the user position or, if already there, to the beginning.
   */
  rewindSequence() {
    window.clearTimeout(this.cancelObject)
    this.positionController.rewind()
  }

  /**
   * Stop playing and store the current position.
   */
  pauseSequence() {
    window.clearTimeout(this.cancelObject)
    let barNumber = this.bSTR.getBeat(this.currentIndex).associatedBarNumber
    this.positionController.changePositionNormal(barNumber)
  }
}
