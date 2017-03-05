import Device from '../'
import should from 'should'

describe('testing getAvaliableActions', () => {
  const deviceId = 'ZTEBV0730'
  let device

  before(() => {
    device = new Device(deviceId)
  })

  it('should get ui actions', function(done) {
    this.timeout(20000)
    device.getAvaliableActions()
    .then(actions => {
      actions.should.be.instanceOf(Array)
      console.log(actions.length)

      actions.forEach((action)=>{
        console.log(action._type)
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
 * mocha --compilers js:babel-core/register test/getAvaliableActions.test.js
 */