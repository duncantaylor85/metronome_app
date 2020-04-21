export default {
  addBar: (state, payload) => {
    for (let i = 0; i < payload.amountOfBars; i++) {
      let newObject = { timeSig: payload.timeSig, bpm: payload.bpm };
      state.bars.push(newObject);
    }
  },
};
