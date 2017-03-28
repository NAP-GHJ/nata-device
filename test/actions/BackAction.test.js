import Device from '../../'
import should from 'should'
import ActionParser from '../../lib/actions/ActionParser'

describe('testing BackAction', () => {
  const deviceId = '4387cae1'
  const actionString = 'Back'

  let device = new Device(deviceId)

  // before(async function() {
  //   this.timeout(20000)
  //   await Device.startServer()
  //   device = new Device(deviceId)
  // })

  it('should get input action', function (done) {
    this.timeout(20000)
    const action = ActionParser.parse(device, actionString)
    console.log(action)
    action.fire().then(()=>{
      done()    
    })
  })
})


/**
 * npm run compile
 * mocha --compilers js:babel-core/register test/actions/BackAction.test.js
 */