import Device from '../'
import should from 'should'

describe('testing common actions', () => {
  const deviceId = 'ZTEBV0730'
  let device

  before(() => {
    device = new Device(deviceId)
  })

  // it('the device should be online', async function(done) {
  //   this.timeout(2000)
  //   const isOnline = await Device.isDeviceOnline(deviceId)
  //   isOnline.should.be.true()
  //   done()
  // })

  // it('should press back key', async function (done) {
  //   await device.back()
  //   done()
  // })

  it('should press menu key', function(done) {
    device.menu().then(()=>{
      done()
    })
  })

  // it('should press home key',function(done) {
  //   device.home().then(()=>{
  //     done()
  //   })
  // })

})


/**
 * npm run compile
 * mocha --compilers js:babel-core/register test/commons.test.js
 */