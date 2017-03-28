var Device = require('../')
var spawn = require('child_process').spawn

let device = new Device('ZTEBV0730')
//var proc = spawn('adb',['logcat','-B']);



    device.openLogcat().then((proc)=>{
        console.log(proc)
        proc.stdout.on('data',function (data) {
            console.log(data.toString())
        })
    })
    //proc.kill()
    

