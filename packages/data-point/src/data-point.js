const { createReducer } = require("./create-reducer");
const Accumulator = require("./Accumulator");
const Resolve = require("./resolve-reducer");

async function resolveFromAccumulator(acc, reducers) {
  const parsedReducers = createReducer(reducers);
  return await Resolve.resolve(acc, parsedReducers);
}

async function resolver(input, reducers, options = {}) {
  const acc = Accumulator.create({
    value: input,
    locals: options.locals,
    resolve: resolveFromAccumulator,
    cache: options.cache
  });

  const output = await resolveFromAccumulator(acc, reducers);

  if (options.inspect === true) {
    return acc.set("value", output);
  }

  return output;
}

class DataPoint {
  constructor() {
    this.cache = {
      get: undefined,
      set: undefined
    };
  }

  resolve(input, reducer, options = {}) {
    return resolver(input, reducer, {
      locals: options.locals,
      cache: this.cache
    });
  }
}

function datapoint(options) {
  return new DataPoint(options);
}

module.exports = datapoint;
