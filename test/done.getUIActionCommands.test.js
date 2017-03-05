import Device from '../'
import should from 'should'

describe('testing getUIActionCommands', () => {
  //const deviceId = 'DU2SSE1478031311'
  const deviceId = 'ZTEBV0730'
  let device

  before(() => {
    device = new Device(deviceId)
  })

  it('should get ui action commands', function(done) {
    this.timeout(20000)
    device.getUIActionCommands()
    .then(actions => {
      actions.should.be.instanceOf(Array)
      console.log(actions.length)

      console.log(actions)
      done()
    })
    .catch(err => {
      should.not.exist(err)
    })
  })
})


/**
 * npm run compile
 * mocha --compilers js:babel-core/register test/getUIActionCommands.test.js
 */