/**
 * Applies a Reducer to an accumulator
 *
 * If Accumulator.trace is true it will execute tracing actions
 *
 * @param {Object} manager
 * @param {Accumulator} accumulator
 * @param {Reducer} reducer
 * @returns {Promise}
 */
async function resolve(accumulator, reducer) {
  // NOTE: recursive call by passing resolve method
  let result = await reducer.resolveReducer(accumulator, resolve, reducer);
  return result;
}

module.exports = {
  resolve
};
