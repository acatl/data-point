const { Reducer } = require("./Reducer");

class ReducerNative extends Reducer {
  constructor(type, name, spec) {
    super(type, name, spec);
  }

  static isType() {
    throw new Error("must be implemented");
  }
}

module.exports = {
  ReducerNative
};
