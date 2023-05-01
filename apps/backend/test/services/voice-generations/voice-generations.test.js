// For more information about this file see https://dove.feathersjs.com/guides/cli/service.test.html
import assert from 'assert'
import { app } from '../../../src/app.js'

describe('voice-generations service', () => {
  it('registered the service', () => {
    const service = app.service('voice-generations')

    assert.ok(service, 'Registered the service')
  })
})
