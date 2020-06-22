import { CountInController } from "@/libraries/PlaybackModel.js";

test("Count-in controller - initialisation", () => {
  let cic = new CountInController()
  expect(cic.enabled).toBe(false)
  expect(cic.countInLength).toBe(0)
})

test("Count-in controller example - changing properties", () => {
  let cic = new CountInController()
  cic.toggleCountIn(true)
  cic.changeCountInLength(5)

  expect(cic.enabled).toBe(true)
  expect(cic.countInLength).toBe(5)
})

