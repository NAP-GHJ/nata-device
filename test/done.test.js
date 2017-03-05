import Device from '../'
import assert from 'assert'
import path from 'path'

describe('testing device api', () => {
  const deviceId = 'ZTEBV0730'
  const apkPath = path.join(__dirname, '../assets/cxnt.apk')
  let device

  before(() => {
    device = new Device(deviceId)
  })

  beforeEach(() => {
    device.sleep(2000)
  })

  // it('should install apk', async function(done) {
  //   this.timeout(40000)
  //   await device.install(apkPath)
  //   done()
  // })

  it('should dump ui', function(done){
    this.timeout(5000)
    device.dumpUI().then(target=>{
      //console.log(target)
      done()
    })
  })

  it('should get focused pkgact', done => {
    device.getFocusedPackageAndActivity().then((pkgact)=>{
        console.log(pkgact)
        done()
    })
  })

  // it('should clear App Data', async done => {
  //   const pkg = 'com.cvicse.zhnt'
  //   await device.clearAppData(pkg)
  //   done()
  // })

  it('should startActivity', function(done) {
    // com.zte.UserHelp/.UserHelpActivity
  
    // const act = '.LoadingActivity'
    // const pkg = 'com.cvicse.zhnt'
    const pkg = 'com.zte.UserHelp'
    const act = '.UserHelpActivity'
    const componet = `${pkg}/${act}`

    device.startActivity(componet).then(()=>{
      device.getCurrentPackageName().then((pkg)=>{
        console.log(pkg)
        done()
      })
    })
  })

  // it('should click (x,y)', async done => {
  //   const x = 100
  //   const y = 100
  //   await device.click(x, y)
  //   done()
  // })

  it('should back', (done) => {
    device.back().then(()=>{
      done()
    })
  })

  // it('should return all the connnected devices id', async done => {
  //   const ids = await device.getOnlineDeviceIds()
  //   console.log(ids)
  //   done()
  // })

  // it('shoudl get all permissions', (done) => {
  //   Device.getPermissions(apkPath)
  //   assert.notEqual(permissions.length, 0)
  //   done()
  // })

  
})