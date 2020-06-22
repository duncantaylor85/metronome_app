import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/BeatSequence.js"
import { BarSequence, TimeSignature, Bar, BasicDuration, BPM, SimpleBeatSequenceCreator } from "../src/libraries/DomainModel"

/**
 * Creates a BSTR from a spread of "beats", each given as an array [duration, count-in, first, assoc bar]
 * @param {...[Number, Boolean, Boolean, Number]} beats each an array [duration, count-in, first, assoc bar]
 * @returns {BeatSequenceTimeRepresentation}
 */
function bstr(...beats) {
  let btr = beats.map(([d, b1, b2, b]) => new BeatTimeRepresentation(d, b1, b2, b))
  return new BeatSequenceTimeRepresentation(btr)
}

/**
 * Creates a BarSequence from a spread of "bars", each given as an array [[timeSigNumerator, timeSigDenomintorAsNumber], [beatsPerMinute, beatDurationAsNumber]]
 * @param  {...[[Number, Number],[Number, Number]]} bars a spread of bars in format [[timeSigNumerator, timeSigDenomintorAsNumber], [beatsPerMinute, beatDurationAsNumber]]
 * @returns {BarSequence}
 */
function bs(...bars) {
  let bSeq = new BarSequence()
  let barArray = bars.map(([[tN,tDen], [bpmN, bpmDen]]) => new Bar(new TimeSignature(tN, BasicDuration.fromInteger(tDen)), new BPM(bpmN, BasicDuration.fromInteger(bpmDen))))
  bSeq.bars = barArray
  return bSeq
}



/*****************************************************************************
 * Creation of BeatSequenceTimeRepresentation from a SimpleBeatSequenceCreator
 * BeatSequenceTimeRepresentation methods
 *****************************************************************************/

// "simple" BSTR is converted using a SimpleBeatSequenceCreator
test("Create simple BSTR of a single 4/4 bar at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)

  let beat1 = new BeatTimeRepresentation(500, false, true, 1)
  let beat234 = new BeatTimeRepresentation(500, false, false, 1)
  let beats = [beat1, beat234, beat234, beat234]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bs.getTimeRepresentation(new SimpleBeatSequenceCreator())).toEqual(bstrExpected)
})

test("Create simple BSTR, with 1-bar count-in, of a single 4/4 bar at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(1)

  let count1 = new BeatTimeRepresentation(500, true, true, 1)
  let count234 = new BeatTimeRepresentation(500, true, false, 1)
  let beat1 = new BeatTimeRepresentation(500, false, true, 1)
  let beat234 = new BeatTimeRepresentation(500, false, false, 1)
  let beats = [count1, count234, count234, count234, beat1, beat234, beat234, beat234]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, with 2-bar count-in, of a single 4/4 bar at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(2)

  let count1 = new BeatTimeRepresentation(500, true, true, 1)
  let count234 = new BeatTimeRepresentation(500, true, false, 1)
  let beat1 = new BeatTimeRepresentation(500, false, true, 1)
  let beat234 = new BeatTimeRepresentation(500, false, false, 1)
  let beats = [count1, count234, count234, count234, count1, count234, count234, count234, beat1, beat234, beat234, beat234]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, with 2-bar count-in, of a 3/4-2/4-2/4 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._4th), new BPM(120, BasicDuration._4th), 2)

  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(2)

  let countF = new BeatTimeRepresentation(500, true, true, 1)
  let countR = new BeatTimeRepresentation(500, true, false, 1)
  let beatF = n => new BeatTimeRepresentation(500, false, true, n)
  let beatR = n => new BeatTimeRepresentation(500, false, false, n)
  let beats = [countF, countR, countR, countF, countR, countR, beatF(1), beatR(1), beatR(1), beatF(2), beatR(2), beatF(3), beatR(3)]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, no count-in, of 2/4-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())

  let bstrExpected = bstr([500, false, true, 1], [500, false, false, 1], [1000, false, true, 2], [1000, false, false, 2], [250, false, true, 3], [250, false, false, 3], [250, false, false, 3])

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, count-in of 2 bars, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 2)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(2)

  let bstrExpected = bstr(
    [250, true, true, 1],
    [250, true, false, 1],
    [250, true, true, 1],
    [250, true, false, 1],
    [250, false, true, 1],
    [250, false, false, 1],
    [1000, false, true, 2],
    [1000, false, false, 2],
    [1000, false, true, 3],
    [1000, false, false, 3],
    [250, false, true, 4],
    [250, false, false, 4],
    [250, false, false, 4]
  )

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, no count-in, trimmed to 3rd bar, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 2)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.trim(3)

  let bstrExpected = bstr([1000, false, true, 3], [1000, false, false, 3], [250, false, true, 4], [250, false, false, 4], [250, false, false, 4])

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR, trimmed to 3rd bar then 3-bar count-in applied, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 2)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.trim(3).addCountIn(3)

  let bstrExpected = bstr(
    [1000, true, true, 3],
    [1000, true, false, 3],
    [1000, true, true, 3],
    [1000, true, false, 3],
    [1000, true, true, 3],
    [1000, true, false, 3],
    [1000, false, true, 3],
    [1000, false, false, 3],
    [250, false, true, 4],
    [250, false, false, 4],
    [250, false, false, 4]
  )

  expect(bstrActual).toEqual(bstrExpected)
})

test("Create simple BSTR (4 bars 4/4), trim from 3, add count-in 1 bar, get an arbitrary beat of the remainder", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 4)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.trim(3).addCountIn(1)

  let bstrExpected = bstr(
    [500, true, true, 3],
    [500, true, false, 3],
    [500, true, false, 3],
    [500, true, false, 3],
    [500, false, true, 3],
    [500, false, false, 3],
    [500, false, false, 3],
    [500, false, false, 3],
    [500, false, true, 4],
    [500, false, false, 4],
    [500, false, false, 4],
    [500, false, false, 4]
  )

  expect(bstrActual).toEqual(bstrExpected)
  expect(bstrActual.getBeat(3)).toEqual(new BeatTimeRepresentation(500, true, false, 3))
  expect(bstrActual.getBeat(11)).toEqual(new BeatTimeRepresentation(500, false, false, 4))
})

test("Create simple BSTR (4 bars 4/4), trim from 3, add count-in 1 bar, check for final beat", () => {
  // same as previous test
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 4)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.trim(3).addCountIn(1)
  expect(bstrActual.isFinalBeat(1)).toBe(false)
  expect(bstrActual.isFinalBeat(11)).toBe(true)
})

/****************************************************************
 * BasicDuration tests
 ****************************************************************/

test("BasicDuration conversion Integer->BasicDuration", () => {
  for (let i of [1,2,4,8,16,32]) {
    expect(BasicDuration.toInteger(BasicDuration.fromInteger(i))).toBe(i)
  }
})

test("BasicDuration conversion BasicDuration->Integer", () => {
  for (let i of [0,1,2,3,4,5]) {
    expect(BasicDuration.fromInteger(BasicDuration.toInteger(i))).toBe(i)
  }
})

/***************************************************************
 * BarSequence and other domain class tests
 ***************************************************************/
test("TimeSignature converts denominator to an integer", () => {
  let ts = new TimeSignature(4, BasicDuration._4th)
  expect(ts.getDenominatorAsNumber()).toBe(4)

  let ts2 = new TimeSignature(4, BasicDuration._32nd)
  expect(ts2.getDenominatorAsNumber()).toBe(32)
})

test("TimeSignature copies / clones correctly", () => {
  let ts = new TimeSignature(4, BasicDuration._4th)
  let ts2 = ts.copy()
  expect(ts2).toEqual(ts)

  ts.numerator = 3
  expect(ts2).not.toEqual(ts)
})


test("BPM converts denominator to an integer", () => {
  let bpm = new BPM(120, BasicDuration._4th)
  expect(bpm.getDenominatorAsNumber()).toBe(4)

  let bpm2 = new BPM(120, BasicDuration._32nd)
  expect(bpm2.getDenominatorAsNumber()).toBe(32)
})

test("BPM copies / clones correctly", () => {
  let bpm = new BPM(120, BasicDuration._4th)
  let bpm2 = bpm.copy()
  expect(bpm).toEqual(bpm2)
  
  bpm.denominator = BasicDuration._32nd
  expect(bpm).not.toEqual(bpm2)
})

test("Bar correctly clones its elements during getters", () => {
  let ts = new TimeSignature(120, BasicDuration._4th)
  let bpm = new BPM(120, BasicDuration._4th)
  
  let bar = new Bar(ts, bpm)
  let bts = bar.getTimeSig()
  let bbpm = bar.getTempo()

  expect(ts).toEqual(bts)
  expect(bpm).toEqual(bbpm)

  ts.denominator = BasicDuration._32nd
  bpm.denominator = BasicDuration._8th

  expect(ts).not.toEqual(bts)
  expect(bpm).not.toEqual(bbpm)
})



test("BarSequence adds bars from none", () => {
  let barSeq = new BarSequence()
  barSeq.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 2)

  expect(barSeq.getBarCount()).toBe(2)
  expect(barSeq).toEqual(bs([[4,4], [120,4]], [[4,4], [120,4]]))
})


test("BarSequence adds bars to existing", () => {
  let barSeq = new BarSequence()
  barSeq.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 2)

  expect(barSeq.getBarCount()).toBe(2)
  expect(barSeq).toEqual(bs([[4,4], [120,4]], [[4,4], [120,4]]))

  barSeq.addBarsToEnd(new TimeSignature(3, BasicDuration._4th), new BPM(60, BasicDuration._8th), 2)
  expect(barSeq.getBarCount()).toBe(4)
  expect(barSeq).toEqual(bs([[4,4], [120,4]], [[4,4], [120,4]], [[3,4], [60,8]], [[3,4], [60,8]]))
})



test("BarSequence replaces bar at start", () => {
  let barSeq = new BarSequence()
  barSeq.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  barSeq.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,8], [120,4]]))

  barSeq.replaceBar(1, new TimeSignature(2, BasicDuration._8th), new BPM(60, BasicDuration._2nd))

  expect(barSeq).toEqual(bs([[2,8],[60,2]], [[3,8], [120,4]]))
})


test("BarSequence replaces bar at end", () => {
  let barSeq = new BarSequence()
  barSeq.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  barSeq.addBarsToEnd(new TimeSignature(3, BasicDuration._16th), new BPM(120, BasicDuration._16th), 1)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,16], [120,16]]))

  barSeq.replaceBar(2, new TimeSignature(2, BasicDuration._8th), new BPM(60, BasicDuration._2nd))

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[2,8], [60,2]]))
})


test("BarSequence returns copies / clones of time sig and tempo correctly", () => {
  let barSeq = new BarSequence()
  let ts1 = new TimeSignature(4, BasicDuration._4th)
  let bpm1 = new BPM(120, BasicDuration._4th)
  let ts2 = new TimeSignature(3, BasicDuration._16th)
  let bpm2 = new BPM(120, BasicDuration._16th)
  barSeq.addBarsToEnd(ts1, bpm1, 1)
  barSeq.addBarsToEnd(ts2, bpm2, 1)

  let ts1a = barSeq.getTimeSigOf(1)
  let ts2a = barSeq.getTimeSigOf(2)
  let bpm1a = barSeq.getTempoOf(1)
  let bpm2a = barSeq.getTempoOf(2)

  ts1.numerator = 8
  ts2.numerator = 2
  bpm1.perMinute = 130
  bpm2.perMinute = 140

  expect(ts1).not.toEqual(ts1a)
  expect(ts2).not.toEqual(ts2a)
  expect(bpm1).not.toEqual(bpm1a)
  expect(bpm2).not.toEqual(bpm2a)

})


test("Delete bar from beginning", () => {
  let barSeq = new BarSequence()
  let ts1 = new TimeSignature(4, BasicDuration._4th)
  let bpm1 = new BPM(120, BasicDuration._4th)
  let ts2 = new TimeSignature(3, BasicDuration._16th)
  let bpm2 = new BPM(80, BasicDuration._16th)
  let ts3 = new TimeSignature(2, BasicDuration._8th)
  let bpm3 = new BPM(60, BasicDuration._8th)
  barSeq.addBarsToEnd(ts1, bpm1, 1)
  barSeq.addBarsToEnd(ts2, bpm2, 1)
  barSeq.addBarsToEnd(ts3, bpm3, 1)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,16],[80,16]], [[2,8],[60,8]]))

  barSeq.deleteBar(1)

  expect(barSeq).toEqual(bs([[3,16],[80,16]], [[2,8],[60,8]]))
})

test("Delete bar from end", () => {
  let barSeq = new BarSequence()
  let ts1 = new TimeSignature(4, BasicDuration._4th)
  let bpm1 = new BPM(120, BasicDuration._4th)
  let ts2 = new TimeSignature(3, BasicDuration._16th)
  let bpm2 = new BPM(80, BasicDuration._16th)
  let ts3 = new TimeSignature(2, BasicDuration._8th)
  let bpm3 = new BPM(60, BasicDuration._8th)
  barSeq.addBarsToEnd(ts1, bpm1, 1)
  barSeq.addBarsToEnd(ts2, bpm2, 1)
  barSeq.addBarsToEnd(ts3, bpm3, 1)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,16],[80,16]], [[2,8],[60,8]]))

  barSeq.deleteBar(2)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[2,8],[60,8]]))
})

test("Delete bar from end", () => {
  let barSeq = new BarSequence()
  let ts1 = new TimeSignature(4, BasicDuration._4th)
  let bpm1 = new BPM(120, BasicDuration._4th)
  let ts2 = new TimeSignature(3, BasicDuration._16th)
  let bpm2 = new BPM(80, BasicDuration._16th)
  let ts3 = new TimeSignature(2, BasicDuration._8th)
  let bpm3 = new BPM(60, BasicDuration._8th)
  barSeq.addBarsToEnd(ts1, bpm1, 1)
  barSeq.addBarsToEnd(ts2, bpm2, 1)
  barSeq.addBarsToEnd(ts3, bpm3, 1)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,16],[80,16]], [[2,8],[60,8]]))

  barSeq.deleteBar(3)

  expect(barSeq).toEqual(bs([[4,4],[120,4]], [[3,16],[80,16]]))
})