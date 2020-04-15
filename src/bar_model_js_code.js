class Coordinator {
  constructor(barSequence) {
    this.barSequence = barSequence;
    this.observers = [];
  }

  register(observer) {
    this.observers.append(observer);
  }

  // Returns copy of TimeSignature object
  getTimeSigOf(barNum) {
    return this.barSequence.getTimeSigOf(barNum);
  }

  // Returns copy of BPM object
  getTempoOf(barNum) {
    return this.barSequence.getTempoOf(barNum);
  }

  getBarCount() {
    return this.barSequence.getBarCount();
  }

  addBarsToEnd(timeSig, bpm, count) {
    this.barSequence.addBarsToEnd(timeSig, bpm, count);
    this.changed();
  }

  /*
    deleteBarAtPosition(barNum: Integer) { 
        DO STUFF
        ... 
        this.changed();
    }
    
    editBarAtPosition(barNum: Integer, timeSig: TimeSignature, tempo: BPM) { 
        DO STUFF
        ... 
        this.changed();
    }
    */

  changed() {
    this.observers.forEach(observer => {
      observer.update();
    });
  }
}

/*
interface Observer {
    coordinator: Coordinator 
    update() 
}
*/

class GUI {
  // implements Observer
  constructor(coordinator: Coordinator) {
    this.coordinator = coordinator;
    coordinator.register(this);
  }

  update() {
    for (var barNum = 1; barNum < coordinator.getBarCount(); barNum++) {
      timeSig_barNum = coordinator.getTimeSigOf(barNum);
      tempo_barNum = coordinator.getTempoOf(barNum);
      /*
              ... DO STUFF WITH TEMPO AND TIME SIG ...
            */
    }
  }
}

class TimeSignature {
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  copy() {
    return new TimeSignature(numerator, denominator);
  }
}

class BPM {
  constructor(perMinute, denominator) {
    this.perMinute = perMinute;
    this.denominator = denominator;
  }

  copy() {
    return new BPM(perMinute, denominator);
  }
}

class BarSequence {
  constructor() {
    this.bars = [];
  }

  addBarsToEnd(timeSig, bpm, count) {
    for (var i = 1; i <= count; i++) {
      bars.append(new Bar(timeSig, bpm));
    }
  }

  getBarCount() {
    return this.bars.length;
  }

  getTimeSigOf(barNum) {
    return bars[barNum].getTimeSig();
  }
  getTempoOf(barNum) {
    return bars[barNum].getTempo();
  }
}

class Bar {
  constructor(timeSig, tempo) {
    this.timeSig = timeSig;
    this.tempo = tempo;
  }

  getTimeSig() {
    return timeSig.copy();
  }
  getTempo() {
    return tempo.copy();
  }
}

const BasicDuration = {
  _1st: 0,
  _2nd: 1,
  _4th: 2,
  _8th: 3,
  _16th: 4,
  _32nd: 5
};
