import { getters } from "@/store/store.js";
import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/DomainModel.js";

export { PositionController, CountInController, PlaybackCoordinator, PlaybackBuilder };

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
    let fullSequence;
    if (this.enabled) {
      fullSequence = trimmedBeatSeq.addCountIn(this.countInLength);
    } else {
      fullSequence = trimmedBeatSeq;
    }
    return fullSequence;
  }

  /**
   * Sets whether or not the count-in is enabled or disabled
   * @param {Boolean} newValue is the count-in enabled or disabled?
   */
  toggleCountIn(newValue) {
    this.enabled = newValue;
  }

  /**
   * Sets the number of bars of count-in to do
   * @param {Number} barCount number of bars of count-in
   */
  changeCountInLength(barCount) {
    this.countInLength = barCount;
  }
}

const PositionState = {
  STARTING_STATE: 0,
  PAUSED: 1,
  PLAYING: 2,
  REWOUND_TO_USER_POSITION: 3,
  REWOUND_TO_START: 4,
};

/**
 * Handles the changes in user bar selection, the current bar number during playback, highlighting those current bars, and rewinding.
 */
class PositionController {
  /**
   * Creates a new position controller that uses barHighlighterInterface to send highlight messages to the music rendering
   * @param {{ highlightCountIn: (barNumber: Number) => void, highlightNormal: (barNumber: Number) => void}} barHighlighterInterface
   * an interface allowing highlighting of a given bar
   * @param {CountInController} countInController the count-in controller for this playback unit
   */
  constructor(barHighlighterInterface, countInController, playbackCoordinator, barMarker) {
    this.playbackCoordinator = playbackCoordinator;
    this.currentUserSelectedBar = -1;
    this.currentPlayPosition = 1;
    this.musicRenderer = barHighlighterInterface;
    this.barMarker = barMarker;
    this.countInController = countInController;
    this.state = PositionState.STARTING_STATE;
    this.userHasSelectedBar = false;
  }

  play() {
    this.state = PositionState.PLAYING;
  }
  pause() {
    this.state = PositionState.PAUSED;
  }

  /**
   * Trims the front of the BSTR until the current bar is the first element, then prepends the count-in bars
   * Depending on current bar, we get different behaviours
   *   currentBar = -1: not currently paused, so start from the user-selected bar if there is one (i.e. currentUserSelectedBar !== -1), and the beginning if not
   *   currentBar !== -1: currently paused, so start the sequence from the bar it's paused at, rewinding to the start of the bar (and including a count-in if requested)
   * @param {BeatSequenceTimeRepresentation} bSTR the raw beat sequence for playback, untrimmed and without a count-in
   * @returns {BeatSequenceTimeRepresentation} the input beat sequence, taken from the current bar number, with the count-in of appropriate length prepended
   */
  createPlayableTimeRepresentation(bSTR) {
    let trimmedBarSeq;
    if (this.state !== PositionState.PAUSED) {
      // not currently paused
      if (!this.userHasSelectedBar) {
        // no bar selected
        trimmedBarSeq = bSTR.trim(1);
      } else {
        // not paused and bar selected
        trimmedBarSeq = bSTR.trim(this.currentUserSelectedBar);
      }
    } else {
      // paused
      trimmedBarSeq = bSTR.trim(this.currentPlayPosition);
    }
    const fullSequence = this.countInController.addCountIn(trimmedBarSeq);
    return fullSequence;
  }

  /**
   * Set user-selected position and current position to the beginning of the full bar sequence, highlight first bar
   */
  resetAllPositions() {
    this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    this.barMarker.unmarkBar(this.currentUserSelectedBar);
    this.currentPlayPosition = 1;
    this.currentUserSelectedBar = 1;
    this.userHasSelectedBar = false;
    this.state = PositionState.REWOUND_TO_START;

    // also, since we're rewinding all the way to the start, we highlight the first bar
    this.musicRenderer.highlightNormal(1);
    this.barMarker.markBar(1);
  }

  /**
   * Set current bar position to user-selected position, highlight current bar
   */
  restoreUserPosition() {
    this.state = PositionState.REWOUND_TO_USER_POSITION;
    this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    this.currentPlayPosition = this.currentUserSelectedBar;
    this.musicRenderer.highlightNormal(this.currentPlayPosition);
  }

  /**
   * Changes the current bar to the given bar number, then highlight that bar normally (i.e. not a count-in)
   * @param {Number} barNumber bar to change to
   */
  changePositionNormal(barNumber) {
    this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    this.currentPlayPosition = barNumber;
    this.musicRenderer.highlightNormal(barNumber);
  }

  /**
   * Changes the current bar to the given bar number, then highlight that bar as a count-in
   * @param {Number} barNumber bar to change to
   */
  changePositionCountIn(barNumber) {
    if (this.state === PositionState.PAUSED) {
      // is currently paused
      this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    }
    this.currentPlayPosition = barNumber;
    this.musicRenderer.highlightCountIn(barNumber);
  }

  /**
   * Called as the final beat finishes. Clears the highlight at the current bar (presumably the final one),
   * moves the current position back to the user-selected position (or the first bar if no user-selected
   * position exists), and then highlights the bar at the new current position.
   */
  finishSequence() {
    this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    if (this.userHasSelectedBar) {
      // bar currently selected
      this.currentPlayPosition = this.currentUserSelectedBar;
      this.musicRenderer.highlightNormal(this.currentPlayPosition);
      this.state = PositionState.REWOUND_TO_USER_POSITION;
    } else {
      // no bar currently selected, so go back to bar 1
      this.currentPlayPosition = 1;
      this.musicRenderer.highlightNormal(this.currentPlayPosition);
      this.state = PositionState.STARTING_STATE;
    }
  }

  /**
   * Changes the user's position and current bar to the given bar number, and highlights it normally.
   * NOTE: should only be called when the playback has been paused, or behaviour will be undefined
   * @param {Number} barNumber  bar to change to
   */
  changeUserPosition(barNumber) {
    if (this.state !== PositionState.PAUSED && this.state !== PositionState.STARTING_STATE) {
      this.playbackCoordinator.pausePlaying();
    }
    if (this.state === PositionState.PAUSED || this.state === PositionState.REWOUND_TO_START || this.state === PositionState.REWOUND_TO_USER_POSITION) {
      // currently paused
      // selecting a different bar should always cause a pause/rewind-highlight to be cancelled
      this.musicRenderer.cancelHighlight(this.currentPlayPosition);
    }

    if (this.userHasSelectedBar && this.currentUserSelectedBar === barNumber) {
      // current user-selected bar has been selected again, so deselect
      this.userHasSelectedBar = false;
      this.musicRenderer.cancelHighlight(this.currentUserSelectedBar);
      this.barMarker.unmarkBar(this.currentUserSelectedBar); // should be unmarkBar
      this.currentUserSelectedBar = -1;
      this.currentPlayPosition = 1;
    } else {
      // different selected now from then, so change to the new selection
      this.musicRenderer.cancelHighlight(this.currentUserSelectedBar);
      this.barMarker.unmarkBar(this.currentUserSelectedBar); // should be unmarkBar
      this.userHasSelectedBar = true;
      this.currentUserSelectedBar = barNumber;
      this.currentPlayPosition = barNumber;
      // should additionally have markBar - needs both the marking and highlighting, since we're setting the user position and current bar position
      this.musicRenderer.highlightNormal(this.currentUserSelectedBar);
      this.barMarker.markBar(this.currentUserSelectedBar);
    }
  }

  /**
   * Resets current position to user position, or if the same, reset to the beginning.
   */
  rewind() {
    if (this.currentPlayPosition === this.currentUserSelectedBar || !this.userHasSelectedBar) {
      // Either the current bar is the user-selected bar or there isn't a user-selected bar, so go back to the start
      this.resetAllPositions();
    } else {
      // There is a user-selected bar, and the current bar is not that user-selected bar (i.e. we're paused on a different bar)
      this.restoreUserPosition();
    }
  }

  /**
   * Replaces the bar highlighter interface with a new one for a newly-created MusicRenderer component; highlights the current
   * bar if one exists, or the first bar if not.
   * @param {{ highlightCountIn: (barNumber: Number) => void, highlightNormal: (barNumber: Number) => void}} barHighlighter
   */
  replaceBarHighlighter(barHighlighter) {
    this.musicRenderer = barHighlighter;
    if (this.state === PositionState.PAUSED) {
      // is currently paused
      this.musicRenderer.highlightNormal(this.currentPlayPosition);
    }
  }
}

class PlaybackBuilder {
  /**
   * @param {{ getTimeRepresentation: () => BeatSequenceTimeRepresentation }} timeRepProvider interface to a provider of the current bar sequence's
   */
  constructor() {}

  setTimeRepProvider(timeRepProvider) {
    this.timeRepProvider = timeRepProvider;
  }

  setBarHighlighter(barHighlighter) {
    this.barHighlighter = barHighlighter;
  }

  setBarMarker(barMarker) {
    this.barMarker = barMarker;
  }

  setClickProvider(clickProvider) {
    this.clickProvider = clickProvider;
  }

  setup() {
    if (!this.timeRepProvider || !this.barHighlighter || !this.clickProvider || !this.barMarker) throw "Tried to create a playback builder where at least one set parameter was missing";
    return new PlaybackCoordinator(this.clickProvider, this.timeRepProvider, this.barHighlighter, this.barMarker);
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
  constructor(clickProvider, timeRepProvider, barHighlighter, barMarker) {
    this.timeRepProvider = timeRepProvider;
    this.countInController = new CountInController();
    this.positionController = new PositionController(barHighlighter, this.countInController, this, barMarker);
    this.recursivePlay = new RecursivePlay(clickProvider, this.positionController);
  }

  /**
   * @returns {{ toggleCountIn: (value: Boolean) => void, changeCountInLength: (barCount: Number) => void}} the UI's interface to the count-in controller
   */
  getCountInInterface() {
    return {
      toggleCountIn: (val) => this.countInController.toggleCountIn(val),
      changeCountInLength: (newLength) => this.countInController.changeCountInLength(newLength),
    };
  }

  /**
   * @returns {{ changeUserPosition: (barNumber: Number) => void }} the UI's interface to the user position portion of the position controller
   */
  getPositionInterface() {
    return {
      changeUserPosition: (barNum) => this.positionController.changeUserPosition(barNum), // needed lambda or "this" produces errors
    };
  }

  /**
   * @returns {{ rewind: () => void, startPlaying: () => void, pausePlaying: () => void}}
   */
  getPlaybackInterface() {
    return {
      rewind: () => this.rewind(),
      startPlaying: () => this.startPlaying(),
      pausePlaying: () => this.pausePlaying(),
    };
  }

  /**
   * Stop playing the current bar sequence, and rewind the playback to the user position; if already at the user position, rewind to the beginning
   */
  rewind() {
    this.recursivePlay.rewindSequence();
  }

  /**
   * Start playing the current bar sequence from the current position
   */
  startPlaying() {
    const bSTR = getters.getTimeRepresentation();
    const fullSequence = this.positionController.createPlayableTimeRepresentation(bSTR);
    this.positionController.play();
    this.recursivePlay.playSequence(fullSequence);
  }

  /**
   * Stop playing the current bar sequence, but leave the current position at the current bar.
   */
  pausePlaying() {
    this.recursivePlay.pauseSequence();
    this.positionController.pause();
  }

  /**
   * Replaces the PositionController's bar highlighter interface with a new one for a newly-created MusicRenderer component
   * @param {{ highlightCountIn: (barNumber: Number) => void, highlightNormal: (barNumber: Number) => void}} barHighlighter
   */
  replaceBarHighlighter(barHighlighter) {
    this.positionController.replaceBarHighlighter(barHighlighter);
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
  }

  /**
   * Start playing the current bar sequence from the given position and with the specified count-in (if any)
   * @param {BeatSequenceTimeRepresentation} fullSequence the complete beat sequence, trimmed and including count-ins, to play
   */
  playSequence(fullSequence) {
    this.bSTR = fullSequence;
    this.currentIndex = 0;
    this.play();
  }

  /**
   * Plays the current beat at the appropriate pitch, highlights the appropriate bar, and if not at the end of the
   * bar sequence, delays for the current beat length and recursively calls itself for the next beat
   */
  play() {
    let beat = this.bSTR.getBeat(this.currentIndex);
    this.playBeat(beat);
    this.highlight(beat);
    if (!this.bSTR.isFinalBeat(this.currentIndex)) {
      this.cancelObject = window.setTimeout(() => {
        this.currentIndex++;
        this.play();
      }, beat.durationInMillis);
    } else {
      // is final beat
      window.setTimeout(() => {
        this.positionController.finishSequence();
      }, beat.durationInMillis);
    }
  }

  /**
   * Makes a sound of high or low pitch depending on whether or not the beat is first in the bar.
   * @param {BeatTimeRepresentation} beat the current beat to play
   */
  playBeat(beat) {
    if (beat.isFirstBeatOfBar) {
      this.clickProvider.playHigh();
    } else {
      this.clickProvider.playLow();
    }
  }

  /**
   * Highlights the current bar depending on whether or not the beat is a count-in
   * @param {BeatTimeRepresentation} beat the current beat being played
   */
  highlight(beat) {
    if (beat.isCountIn) {
      this.positionController.changePositionCountIn(beat.associatedBarNumber);
    } else {
      this.positionController.changePositionNormal(beat.associatedBarNumber);
    }
  }

  /**
   * Stop playing and rewind, either to the user position or, if already there, to the beginning.
   */
  rewindSequence() {
    window.clearTimeout(this.cancelObject);
    this.positionController.rewind();
  }

  /**
   * Stop playing and store the current position.
   */
  pauseSequence() {
    window.clearTimeout(this.cancelObject);
    let barNumber = this.bSTR.getBeat(this.currentIndex).associatedBarNumber;
    this.positionController.changePositionNormal(barNumber);
  }
}
