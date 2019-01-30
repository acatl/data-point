const _ = require('lodash')
const Promise = require('bluebird')

const Reducer = require('../reducer-types')
const AccumulatorFactory = require('../accumulator/factory')
const Trace = require('../trace')

function getOptions (spec) {
  return _.defaults({}, spec, {
    locals: {},
    entityOverrides: {}
  })
}

/**
 * @param {DataPoint} manager DataPoint instance
 * @param {Object} reducerSource reducer source
 * @param {Accumulator} context accumulator object
 * @returns {Promise<Accumulator>} resolved reducer context
 */
function resolveFromAccumulator (manager, reducerSource, context) {
  const reducer = Reducer.create(reducerSource)
  return Reducer.resolve(manager, context, reducer)
}

module.exports.resolveFromAccumulator = resolveFromAccumulator

function reducerResolve (manager, reducerSource, value, options) {
  const contextOptions = getOptions(options)
  const context = AccumulatorFactory.create({
    value: value,
    locals: contextOptions.locals,
    entityOverrides: contextOptions.entityOverrides,
    values: manager.values.getStore()
  })

  return resolveFromAccumulator(manager, reducerSource, context)
}

function transform (manager, reducerSource, value, options, done) {
  return Promise.resolve()
    .then(() => reducerResolve(manager, reducerSource, value, options))
    .asCallback(done)
}

module.exports.transform = transform

function resolve (manager, reducerSource, value, options) {
  return Promise.resolve()
    .then(() => reducerResolve(manager, reducerSource, value, options))
    .then(acc => acc.value)
}

module.exports.resolve = _.curry(resolve, 3)
