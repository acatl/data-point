const { ReducerNative } = require("./ReducerNative");

class ReducerList extends ReducerNative {
  constructor(spec, createReducer) {
    super("list", undefined, spec);

    this.reducerList = spec.map(token => createReducer(token));
  }

  static isType(spec) {
    return Array.isArray(spec);
  }

  async resolve(accumulator, resolveReducer) {
    const reducers = this.reducerList;

    if (reducers.length === 0) {
      return undefined;
    }

    const initialValue =
      accumulator.value === undefined ? null : accumulator.value;

    let index = 0;

    let value = initialValue;

    while (index < reducers.length) {
      const reducer = reducers[index];

      const acc = Object.create(accumulator);
      acc.value = value;

      value = await resolveReducer(acc, reducer);

      index++;
    }

    return value;
  }
}

module.exports = {
  ReducerList
};
