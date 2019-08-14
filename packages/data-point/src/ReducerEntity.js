const { createReducer } = require("./create-reducer");
const { Reducer } = require("./Reducer");

/**
 * NOTE: this method mutates target
 * @param {String} name reducer name
 * @param {Object} target entity target
 * @param {Object} spec entity source spec
 */
function setReducerIfTruthy(name, target, spec) {
  if (spec[name]) {
    // eslint-disable-next-line no-param-reassign
    target[name] = createReducer(spec[name]);
  }
}

class ReducerEntity extends Reducer {
  constructor(type, spec) {
    super(type, spec.name, spec);

    this.isEntityInstance = true;

    setReducerIfTruthy("before", this, spec);
    setReducerIfTruthy("value", this, spec);
    setReducerIfTruthy("after", this, spec);
    setReducerIfTruthy("catch", this, spec);

    if (spec.inputType) {
      // TODO: implement back
      // const inputType = normalizeTypeCheckSource(spec.inputType);
      this.inputType = createReducer(spec.inputType);
    }

    if (spec.outputType) {
      // TODO: implement back
      // const outputType = normalizeTypeCheckSource(spec.outputType);
      this.outputType = createReducer(spec.outputType);
    }

    this.params = spec.params || {};
  }

  async resolveEntityValue(accumulator, resolveReducer) {
    let acc = accumulator;

    if (this.inputType) {
      await resolveReducer(acc, this.inputValue);
    }

    const cache = accumulator.cache;

    // if (cache.get) {
    //   const cacheResult = await cache.get(acc.value, acc);
    //   if (cacheResult !== undefined) {
    //     return cacheResult;
    //   }
    // }

    let cacheResult;
    if (typeof cache === "function") {
      cacheResult = await cache(acc.value, acc);
      if (cacheResult.value !== undefined) {
        return cacheResult.value;
      }
    }

    if (this.before) {
      acc = acc.set("value", await resolveReducer(acc, this.before));
    }

    if (this.value) {
      acc = acc.set("value", await resolveReducer(acc, this.value));
    }

    if (this.resolve) {
      acc = acc.set("value", await this.resolve(acc, resolveReducer));
    }

    if (this.after) {
      acc = acc.set("value", await resolveReducer(acc, this.after));
    }

    if (this.outputType) {
      await resolveReducer(acc, this.outputType);
    }

    if (cacheResult) {
      await cacheResult.miss(acc.value, acc);
    }

    // if (cache.set) {
    //   await cache.set(acc.value, acc);
    // }

    return acc.value;
  }

  async resolveReducer(accumulator, resolveReducer) {
    let acc = this.setAccumulatorContext(accumulator);

    try {
      acc.value = await this.resolveEntityValue(acc, resolveReducer);
    } catch (error) {
      error.reducer = this;

      acc = acc.set("value", error);

      if (this.catch) {
        acc = acc.set("value", await resolveReducer(acc, this.catch));
      }

      if (this.outputType) {
        await resolveReducer(acc, this.outputType);
      }
    }

    return acc.value;
  }
}

module.exports = {
  setReducerIfTruthy,
  ReducerEntity
};
