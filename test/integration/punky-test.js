'use strict'

const assert = require('assert')
const Punky = require(__lib + 'punky')
const Role = require(__lib + 'cluster/role')

describe('punky', () => {
  beforeEach(() => {
    this.punky = new Punky()
  })

  it('.run() should init the service', () => {
    return this.punky.run()
      .then(() => this.punky.close())
  })

  it(`.role() should return ${Role.SERVER}`, () => {
    assert.equal(this.punky.role, Role.SERVER)
  })
})
