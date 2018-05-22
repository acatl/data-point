const deepFreeze = require('deep-freeze')
const defaultTo = require('lodash/defaultTo')
const { normalizeTypeCheckSource } = require('../../helpers/type-check-helpers')

const createReducer = require('../../reducer-types').create

/**
 * @throws When function is not valid
 * @param {Function} resolve
 * @returns {Boolean} true if valid
 */
function validateResolve (resolve) {
  if (typeof resolve !== 'function') {
    throw new Error(
      `"resolve" must be a function, create(type:String, factory:Function, resolve:Function)`
    )
  }

  if (resolve.length !== 2) {
    throw new Error(
      '"resolve" function must have an arity of 2, resolve(accumulator:Accumulator, resolveReducer:Function)'
    )
  }

  return true
}

/**
 * @throws When function is not valid
 * @param {Function} factory
 * @returns {Boolean} true if valid
 */
function validateFactory (factory) {
  if (typeof factory !== 'function') {
    throw new Error(
      '"factory" argument must be a function, create(type:String, factory:Function, resolve:Function)'
    )
  }
  if (factory.length !== 2) {
    throw new Error(
      '"factory" argument must be a function with arity of 2 factory(name:String, spec:Object)'
    )
  }
  return true
}

/**
 * @param {String} type Entity's type
 * @param {String} name Entity's name
 * @param {Object} spec spec for the Entity
 * @returns {Object} Entity instance
 */
function createEntityType (type, name, entity) {
  // delete entity.spec
  const spec = Object.assign({}, entity.spec, entity)

  entity.entityType = type
  entity.isEntityInstance = true

  entity.name = name
  entity.id = `${entity.entityType}:${name}`

  if (spec.before) {
    entity.before = createReducer(spec.before)
  }

  if (spec.value) {
    entity.value = createReducer(spec.value)
  }

  if (spec.after) {
    entity.after = createReducer(spec.after)
  }

  if (spec.error) {
    entity.error = createReducer(spec.error)
  }

  if (spec.inputType) {
    const inputType = normalizeTypeCheckSource(spec.inputType)
    entity.inputType = createReducer(inputType)
  }

  if (spec.outputType) {
    const outputType = normalizeTypeCheckSource(spec.outputType)
    entity.outputType = createReducer(outputType)
  }

  entity.params = defaultTo(spec.params, {})

  return createEntityInstance(entity)
}

/**
 * @param {Object} entity
 * @returns {Object} entity named instance
 */
function createEntityInstance (entity) {
  function EntityFactory () {}
  Object.defineProperty(EntityFactory, 'name', {
    value: entity.id
  })

  return deepFreeze(Object.assign(new EntityFactory(), entity))
}

/**
 * @param {String} type Entity's type
 * @param {Function} factory factory function to create the entity
 * @param {Function} resolve function to resolve the entity instance
 */
function create (type, factory, resolve) {
  if (arguments.length !== 3) {
    throw new Error(
      'Received wrong number of arguments. Try passing create(type:String, factory:Function, resolve:Function)'
    )
  }
  if (typeof type !== 'string') {
    throw new Error(
      '"type" argument must be a string create(type:String, factory:Function, resolve:Function)'
    )
  }

  validateFactory(factory)
  validateResolve(resolve)

  /**
   * @param {String} name - Entity's name
   * @param {Object} spec - spec for the Entity
   * @returns {Object} Entity instance
   */
  return function createEntity (name, spec) {
    let entityName = name
    let entitySpec = spec
    if (arguments.length === 1) {
      entityName = 'generic'
      entitySpec = name
    }
    const entity = factory(name, entitySpec)
    entity.resolve = resolve
    const e = createEntityType(type, entityName, entity)
    return e
  }
}

module.exports = {
  validateResolve,
  validateFactory,
  createEntityType,
  createEntityInstance,
  create
}
