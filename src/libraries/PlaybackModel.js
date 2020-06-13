import { getters } from "@/store/store.js";

export { CountInController, UserPositionController, PlaybackCoordinator };

class CountInController {
  constructor() {
    this.enabled = false;
    this.countInLength = 0;
  }
  addCountIn(trimmedBarSeq) {
    const fullSequence = trimmedBarSeq.addCountIn(this.countInLength);
    return fullSequence;
  }

  toggleCountIn(newValue) {
    this.enabled = newValue
  }

  changeCountInLength(barCount) {
    this.countInLength = barCount
  }
}

class PositionController {
  constructor(musicRenderer, countInController, playbackCoordinator) {
    this.currentUserSelectedBar = 1;
    this.currentBar = 1;
    this.musicRenderer = musicRenderer;
    this.countInController = countInController;
    this.playbackCoordinator = playbackCoordinator
  }
  createPlayableTimeRepresentation(bSTR) {
    const trimmedBarSeq = bSTR.trim(this.currentUserSelectedBar);
    const fullSequence = this.countInController.createCountIn(trimmedBarSeq);
    return fullSequence;
  }
  resetAllPositions() {
    this.currentBar = 1
    this.currentUserSelectedBar = 1
    this.musicRenderer.highlightNormal(1)
  }
  restoreUserPosition() {
    this.currentBar = this.currentUserSelectedBar
    this.musicRenderer.highlightNormal(barNumber)
  }
  changePositionNormal(barNumber) {
    this.currentBar = barNumber
    this.musicRenderer.highlightNormal(barNumber)
  }
  changePositionCountIn(barNumber) {
    this.currentBar = barNumber
    this.musicRenderer.highlightCountIn(barNumber)
  }

  changeUserPosition(barNumber) {
    this.playbackCoordinator.pausePlaying()
    this.currentUserSelectedBar = barNumber
    this.currentBar = barNumber
    this.musicRenderer.highlightNormal(barNumber)
  }
}

class PlaybackCoordinator {
  constructor(clickProvider, timeRepProvider, musicRenderer) {
    this.timeRepProvider = timeRepProvider;
    this.countInController = new CountInController();
    this.positionController = new PositionController(musicRenderer, this.countInController, this);
    this.recursivePlay = new RecursivePlay(clickProvider, this.positionController, musicRenderer);
  }
  getCountInInterface() {
    return {
      toggleCountIn: this.countInController.toggleCountIn,
      changeCountInLength: this.countInController.changeCountInLength
    }
  }
  getUserPositionInterface() {
    return {
      changeUserPosition: this.positionController.changeUserPosition
    }
  }

  rewind() {}
  startPlaying() {
    const bSTR = getters.getTimeRepresentation();
    const fullSequence = this.positionController.createPlayableTimeRepresentation(bSTR);
    this.recursivePlay(fullSequence);
  }
  pausePlaying() {}
}

class RecursivePlay {
  constructor(clickProvider, positionController, musicRenderer) {
    this.cancelObject = null;
    this.currentIndex = null;
    this.clickProvider = clickProvider;
    this.positionController = positionController;
    this.bSTR = null;
    this.musicRenderer = musicRenderer;
  }
  playSequence(fullSequence) {}
  rewindSequence() {}
  pauseSequence() {}
  playBeat(beat) {}
  highlight(beat) {}
}
