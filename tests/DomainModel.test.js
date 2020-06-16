import { BarSeqence } from "@/libraries/DomainModel.js"
import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/BeatSequence.js"
import { BarSequence, TimeSignature, BasicDuration, BPM, SimpleBeatSequenceCreator } from "../src/libraries/DomainModel"


test("Create BSTR of a single 4/4 bar at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  
  let beat1 = new BeatTimeRepresentation(500, false, true, 1)
  let beat234 = new BeatTimeRepresentation(500, false, false, 1)
  let beats = [beat1, beat234, beat234, beat234]
  let bstr = new BeatSequenceTimeRepresentation(beats)

  expect(bs.getTimeRepresentation(new SimpleBeatSequenceCreator())).toEqual(bstr)
})

test("Create BSTR, with 1-bar count-in, of a single 4/4 bar at 1/4=120", () => {
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

test("Create BSTR, with 2-bar count-in, of a single 4/4 bar at 1/4=120", () => {
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

test("Create BSTR, with 2-bar count-in, of a 3/4-2/4-2/4 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._4th), new BPM(120, BasicDuration._4th), 2)

  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(2)

  let countF = new BeatTimeRepresentation(500, true, true, 1) 
  let countR = new BeatTimeRepresentation(500, true, false, 1)
  let beatF = (n) => new BeatTimeRepresentation(500, false, true, n)
  let beatR = (n) => new BeatTimeRepresentation(500, false, false, n)
  let beats = [countF, countR, countR, countF, countR, countR, beatF(1), beatR(1), beatR(1), beatF(2), beatR(2), beatF(3), beatR(3)]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bstrActual).toEqual(bstrExpected)
})