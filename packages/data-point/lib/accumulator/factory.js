const merge = require('lodash/merge')
const debug = require('debug')('data-point')
const Trace = require('../trace')

/**
 * @class
 */
function Accumulator () {
  this.value = undefined
  this.locals = undefined
  this.values = undefined
  this.reducer = undefined
  this.context = undefined
  this.traceNode = undefined
  this.traceNodeStack = []
  this.reducerStack = []

  this.traceNodeGraph = function traceNodeGraph () {
    return Trace.getTraceTree(this.traceNodeStack)
  }

  this.trace = function trace () {
    return this.reducerStack.reverse()
  }
}

module.exports.Accumulator = Accumulator

function createAccumulator () {
  return {
    value: undefined,
    locals: undefined,
    values: undefined,
    reducer: undefined,
    context: undefined,
    traceNode: undefined,
    traceNodeStack: [],
    reducerStack: [],

    traceNodeGraph () {
      return Trace.getTraceTree(this.traceNodeStack)
    },

    trace () {
      return this.reducerStack.reverse()
    }
  }
}

/**
 * creates new Accumulator based on spec
 * @param  {Object} spec - accumulator spec
 * @return {Source}
 */
function create (spec) {
  const accumulator = createAccumulator()

  accumulator.value = spec.value
  accumulator.context = spec.context
  accumulator.reducer = {
    spec: spec.context
  }
  accumulator.entityOverrides = merge({}, spec.entityOverrides)
  accumulator.locals = merge({}, spec.locals)
  accumulator.values = spec.values
  accumulator.debug = debug
  return accumulator
}

module.exports.create = create
