import Device from '../'
import should from 'should'

// let pck = 'com.cvicse.zhnt/.HomePageActivityNew'

describe('testing index',()=>{
    const deviceId = 'ZTEBV0730'
    let device;

    before(()=>{
        device = new Device(deviceId)
    })

    // it('get online devices',function(done){
    //     Device.getOnlineDevices().then(devices=>{
    //         console.log(devices)
    //         done()
    //     }).catch(err=>{
    //         console.log(err)
    //     })     
    // })

    // it('check if device online',function(done){
    //     Device.isDeviceOnline('ZTEBV0730').then(index=>{
    //         if(index === false)
    //             console.log('Device isn\'t online');
    //         else console.log('Device is online')
    //         done()
    //     })
    // })

    let apkList = [];

    it('get package list',function(done){
        this.timeout(20000)
        device.getPackageList().then(packageList=>{
            const array = packageList.split('\r\n')
            array.forEach(element=>{
                if(element.indexOf("zte")!=-1){
                    console.log(element)
                    apkList.push(element)
                }
            })
            done()
            
        })
    })

    it('get apkpath',function(done){
        device.getApkpath('com.android.contacts').then((path)=>{
        console.log(path)
            done()
        })
    })
})

/**
 * npm run compile
 * mocha --compilers js:babel-core/register test/index.test.js
 */