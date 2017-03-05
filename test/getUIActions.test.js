import Device from '../'
import should from 'should'
import _ from 'lodash'

describe('testing getUIActions', () => {
  const deviceId = '4387cae1'
  let device

  before(() => {
    device = new Device(deviceId)
  })

  it('should get ui actions', function(done) {
    this.timeout(20000)
    device.getUIActions()
    .then(actions => {
      actions.should.be.instanceOf(Array)
      actions.length.should.not.be.equal(0)
      
      _.forEach(actions, (action) => {
        console.log(action._widget._className)
      })

      done()
    })
    .catch(err => {
      should.not.exist(err)
    })
  })
})


/**
 * npm run compile
 * mocha --compilers js:babel-core/register test/getUIActions.test.js
 */