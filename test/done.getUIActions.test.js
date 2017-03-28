import Device from '../'
import should from 'should'
import _ from 'lodash'

describe('testing getUIActions', () => {
  const deviceId = 'ZTEBV0730'
  let device

  before(() => {
    device = new Device(deviceId)
  })

  it('should get ui actions', function(done) {
    this.timeout(20000)
    device.getUIActions()
    .then(actions => {
      actions.should.be.instanceOf(Array)
      console.log(actions.length)
      
      _.forEach(actions, (action) => {
        console.log(action.widget.className)
        //get function
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
