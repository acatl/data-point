const { IS_REDUCER } = require("./reducer-symbols");

const { ReducerFunction } = require("./ReducerFunction");
const { ReducerList } = require("./ReducerList");
const { ReducerPath } = require("./ReducerPath");
const { ReducerObject } = require("./ReducerObject");

/**
 * @param {*} item
 * @returns {boolean}
 */
function isReducer(item) {
  return !!(item && item[IS_REDUCER]);
}

function getReducer(spec) {
  switch (true) {
    case ReducerFunction.isType(spec):
      return new ReducerFunction(spec, createReducer);
    case ReducerList.isType(spec):
      return new ReducerList(spec, createReducer);
    case ReducerPath.isType(spec):
      return new ReducerPath(spec, createReducer);
    case ReducerObject.isType(spec):
      return new ReducerObject(spec, createReducer);
  }

  throw new Error("Invalid reducer type");
}

/**
 * parse reducer
 * @param {*} source
 * @param {Object} options
 * @throws if source is not a valid type for creating a reducer
 * @return {reducer}
 */
function createReducer(source, options = {}) {
  if (isReducer(source)) {
    return source;
  }

  const reducer = getReducer(source);

  return Object.freeze(reducer);
}

module.exports = {
  isReducer,
  getReducer,
  createReducer
};
