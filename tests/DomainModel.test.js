import { BarSeqence } from "@/libraries/DomainModel.js"
import { BeatSequenceTimeRepresentation, BeatTimeRepresentation } from "@/libraries/BeatSequence.js"
import { BarSequence, TimeSignature, BasicDuration, BPM, SimpleBeatSequenceCreator } from "../src/libraries/DomainModel"

/**
 * Creates a BSTR from a varargs of beats
 *
 * @param {...[Number, Boolean, Boolean, Number]} beats each an array [duration, count-in, first, assoc bar]
 */
function bstr(...beats) {
  let btr = beats.map(([d, b1, b2, b]) => new BeatTimeRepresentation(d, b1, b2, b))
  return new BeatSequenceTimeRepresentation(btr)
}

test("Create BSTR of a single 4/4 bar at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(4, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  
  let beat1 = new BeatTimeRepresentation(500, false, true, 1)
  let beat234 = new BeatTimeRepresentation(500, false, false, 1)
  let beats = [beat1, beat234, beat234, beat234]
  let bstrExpected = new BeatSequenceTimeRepresentation(beats)

  expect(bs.getTimeRepresentation(new SimpleBeatSequenceCreator())).toEqual(bstrExpected)
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

test("Create BSTR, no count-in, of 2/4-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._4th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())

  let bstrExpected = bstr(
    [500, false, true, 1],
    [500, false, false, 1],
    [1000, false, true, 2],
    [1000, false, false, 2],
    [250, false, true, 3],
    [250, false, false, 3],
    [250, false, false, 3],
  )
  
  expect(bstrActual).toEqual(bstrExpected)
})

test("Create BSTR, count-in of 2 bars, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 2)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.addCountIn(2)

  let bstrExpected = bstr([250, true, true, 1],
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

test("Create BSTR, no count-in, trimmed to 3rd bar, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
  let bs = new BarSequence()
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  bs.addBarsToEnd(new TimeSignature(2, BasicDuration._2nd), new BPM(120, BasicDuration._4th), 2)
  bs.addBarsToEnd(new TimeSignature(3, BasicDuration._8th), new BPM(120, BasicDuration._4th), 1)
  let bstrActual = bs.getTimeRepresentation(new SimpleBeatSequenceCreator())
  bstrActual = bstrActual.trim(3)

  let bstrExpected = bstr(
    [1000, false, true, 3],
    [1000, false, false, 3],
    [250, false, true, 4],
    [250, false, false, 4],
    [250, false, false, 4]
  )
  
  expect(bstrActual).toEqual(bstrExpected)
})

test("Create BSTR, trimmed to 3rd bar then 3-bar count-in applied, of 2/8-2/2-2/2-3/8 bar sequence at 1/4=120", () => {
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