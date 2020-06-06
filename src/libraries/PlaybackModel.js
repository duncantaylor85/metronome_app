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

  toggleCountIn(newValue) {}

  changeCountInLength(barCount) {}
}

class UserPositionController {
  constructor(musicRenderer, countInController) {
    this.currentUserSelectedBar = 1;
    this.currentBar = 1;
    this.musicRenderer = musicRenderer;
    this.countInController = countInController;
  }
  createPlayableTimeRepresentation(bSTR) {
    const trimmedBarSeq = bSTR.trim(this.currentUserSelectedBar);
    const fullSequence = this.countInController.createCountIn(trimmedBarSeq);
    return fullSequence;
  }
  resetAllPositions(musicRenderer) {}
  restoreUserPosition(musicRenderer) {}
  changePosition(barNumber) {}
  changeUserPosition(barNumber) {}
}

class PlaybackCoordinator {
  constructor(clickProvider, timeRepProvider, musicRenderer, userPosController) {
    this.timeRepProvider = timeRepProvider;
    let countInController = new CountInController();
    this.userPosController = new UserPositionController(musicRenderer, countInController);
    this.recursivePlay = new RecursivePlay(clickProvider, userPosController, musicRenderer);
  }
  rewind() {}
  startPlaying() {
    const bSTR = getters.getTimeRepresentation();
    const fullSequence = this.userPosController.createPlayableTimeRepresentation(bSTR);
    this.recursivePlay(fullSequence);
  }
  pausePlaying() {}
}

class RecursivePlay {
  constructor(clickProvider, userPosController, musicRenderer) {
    this.cancelObject = null;
    this.currentIndex = null;
    this.clickProvider = clickProvider;
    this.userPosController = userPosController;
    this.bSTR = null;
    this.musicRenderer = musicRenderer;
  }
  playSequence(fullSequence) {}
  rewindSequence() {}
  pauseSequence() {}
  playBeat(beat) {}
  highlight(beat) {}
}
