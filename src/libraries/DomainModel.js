export { TimeSignature, BPM, BarSequence, BasicDuration };

class TimeSignature {
  constructor(numerator, denominator) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  getNumerator() {
    return this.numerator;
  }

  getDenominatorAsNumber() {
    return BasicDuration.toInteger(this.denominator);
  }

  copy() {
    return new TimeSignature(this.numerator, this.denominator);
  }
}
class BPM {
  constructor(perMinute, denominator) {
    this.perMinute = perMinute;
    this.denominator = denominator;
  }

  copy() {
    return new BPM(this.perMinute, this.denominator);
  }
}
class BarSequence {
  constructor() {
    this.bars = [];
  }

  addBarsToEnd(timeSig, bpm, count) {
    for (let i = 1; i <= count; i++) {
      this.bars.push(new Bar(timeSig, bpm));
    }
  }

  getBarCount() {
    return this.bars.length;
  }

  getTimeSigOf(barNumber) {
    return this.bars[barNumber - 1].getTimeSig();
  }
  getTempoOf(barNumber) {
    return this.bars[barNumber - 1].getTempo();
  }
  deleteBar(barNumber) {
    this.bars = this.bars.filter((bar, index) => {
      return index != barNumber - 1;
    });
  }
}
class Bar {
  constructor(timeSig, tempo) {
    this.timeSig = timeSig;
    this.tempo = tempo;
  }

  getTimeSig() {
    return this.timeSig.copy();
  }
  getTempo() {
    return this.tempo.copy();
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
    console.log("fromInteger " + i);
    switch (i) {
      case 1:
        return BasicDuration._1st;
      case 2:
        return BasicDuration._2nd;
      case 4:
        return BasicDuration._4th;
      case 8:
        return BasicDuration._8th;
      case 16:
        return BasicDuration._16th;
      case 32:
        return BasicDuration._32nd;
      default:
        throw "Tried to get a basic duration of " +
          i +
          " which is not one of 1,2,4,8,16,32";
    }
  },
  toInteger(bd) {
    return Math.pow(2, bd);
  },
};
