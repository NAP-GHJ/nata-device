import adb from 'adbkit'
import _ from 'lodash'
import os from 'os'
import fs from 'fs'
import { exec } from 'child_process'
import AndroidKeyCode from './AndroidKeyCode.js'

const client = adb.createClient()

class Device {
  constructor(deviceId) {
    this.deviceId = deviceId
  }

  /**
   * pm grant <PACKAGE_NAME> <PERMISSION>
   */
  // async grantPermission(pkg, permission) {
  //   const cmd = `pm grant ${pkg} ${permission}`
  //   await this.adbshell(cmd)
  // }

  /**
   * sleep for ms time
   * @param  {Integer} ms time in ms
   * @return {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => { setTimeout(resolve, ms) })
  }

  /**
   * get the ids of online connected devices
   * @return {Promise } ids [String] 
   */
  async getOnlineDeviceIds() {
    const devices = await client.listDevices()
    const ids = _.map(devices, device => {
      return device.id
    })
    return ids
  }

  /**
   * get [adbkit-logcat](https://www.npmjs.com/package/adbkit-logcat) client
   * @return {client}
   */
  logcat() {
    return client.openLogcat(this.deviceId, { clear: true })
  }

  /**
   * run adb shell commmand and get the output
   * @param  {String} cmd command to run
   * @return {Promise} output
   */
  adbshell(cmd) {
    return new Promise((resolve, reject) => {
      client.shell(this.deviceId, cmd)
      .then(adb.util.readAll)
      .then((output) => { resolve(output.toString().trim()) })
      .catch((err) => { reject(err) })
    })
  }

  /**
   * Static
   * run shell command and get the output
   * @param  {String} cmd to run
   * @return {Promise} stdout || stderr
   */
  static shell(cmd) {
    return new Promise((resolve, reject) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) reject(err)
        else resolve(stdout || stderr)
      })
    })
  }

  /**
   * clear app data of pkg
   * @param  {String} pkg  pkg to be cleared
   * @return {Promise} wheather success to delete
   */
  async clearAppData(pkg) {
    const cmd = `pm clear ${pkg}`
    const output = await this.adbshell(cmd)
    return output === 'Success'
  }

  /**
   * install apk
   * @param  {String} apk path
   * @return {Promise}
   */
  install(apk) {
    return client.install(this.deviceId, apk)
  }

  /**
   * Static
   * get permissions of apk, make sure you can call aapt from command line
   * @param  {String} apk path
   * @return {Promise} permissions [String]
   */
  static async getPermissionsFromApk(apk) {
    const cmd = `aapt d permissions ${apk}`
    const output = await this.shell(cmd)
    const permissions = _
          .chain(output)
          .split('\n')
          .filter(line => line.startsWith('uses-permission'))
          .map(line => line.split(' ')[1].slice(6, -1))
          .value()
    return permissions
  }

  /**
   * getPermissions pkg
   * @param  {String} pkg package of the app
   * @return {Promise} permissions [String]
   */
  async getPermissions(pkg) {
    const codePath = (await this.adbshell(`dumpsys package ${pkg} | grep codePath`)).trim().slice(9)
    const apkPath = await this.pullFile(codePath, `${os.tmpdir()}/app.apk`)
    const permissions = await Device.getPermissionsFromApk(apkPath)
    return permissions
  }

  /**
   * adb shell dumpsys package com.cvicse.zhnt | grep android.permission
   * get granted permissions
   * @param  {String} pkg package of the app
   * @return {Promise} permissions [String] granted permissions
   */
  async getGrantedPermissions(pkg) {
    const output = await this.adbshell(`dumpsys package ${pkg} | grep android.permission`)
    const permissions = _
            .chain(output)
            .split('\n')
            .map(line => line.trim())
            .value()
    return permissions
  }

  /**
   * get not granted permissions
   * @param  {String} pkg package of the app
   * @return {Promise} notGrantedPermissions [String] not granted permissions
   */
  async getNotGrantedPermissions(pkg) {
    const grantedPermissions = await this.getGrantedPermissions(pkg)
    const permissions = await this.getPermissions(pkg)
    const notGrantedPermissions = _
            .chain(permissions)
            .difference(grantedPermissions)
            .uniq()
            .value()
    return notGrantedPermissions
  }

  /**
   * click (x,y)
   * @param  {String} x - coordinate x
   * @param  {String} y - coordinate y
   * @return {Promise}
   */
  async click(x, y) {
    const cmd = `input tap ${x} ${y}`
    await this.adbshell(cmd)
  }

  /**
   * send key event from https://developer.android.com/reference/android/view/KeyEvent.html
   * @param  {String} keycode keycode from Android
   * @return {Promise}
   */
  async sendKeyEvent(keycode) {
    const cmd = `input keyevent ${keycode}`
    await this.adbshell(cmd)
  }

  /**
   * press back key of the device
   * @return {Promise}
   */
  back() {
    return this.sendKeyEvent(AndroidKeyCode.BACK)
  }

  /**
   * get current focused package and activity
   * @return {Promise}
   */
  async getFocusedPackageAndActivity() {
    const reg = /[a-zA-Z0-9.]+\/.[a-zA-Z0-9.]+/
    const cmd = 'dumpsys input | grep FocusedApplication'
    const output = await this.adbshell(cmd)
    return output.match(reg)[0]
  }

  /**
   * get current package name
   * @return {Promise}
   */
  async getCurrentPackageName() {
    const pkgact = await this.getFocusedPackageAndActivity()
    return pkgact.split('/')[0]
  }

  /**
   * get current activity
   * @return {Promise}
   */
  async getCurrentActivity() {
    const pkgact = await this.getFocusedPackageAndActivity()
    return pkgact.split('/')[1]
  }

  /**
   * Dump ui xml and pull it to local temp file
   * @return {Promise} resolve the target xml file
   */
  async dumpUI() {
    const source = '/storage/sdcard0/window_dump.xml'
    const cmd = `uiautomator dump ${source}`
    const target = `${os.tmpdir()}/dumpfile.xml`
    await this.adbshell(cmd)
    return await this.pullFile(source, target)
  }

  /**
   * start activity
   * @param  {String} component pkg/act
   * @return {Promise}
   */
  async startActivity(component) {
    const cmd = `am start -S -W -n ${component}`
    // return client.startActivity(this.deviceId, { component, wait: true })
    await this.adbshell(cmd)
  }

  /**
   * pull file from device to local file system
   * @param  {String} source src file path of the device
   * @param  {String} target target file path of the local file system
   * @return {Promise} target file path
   */
  pullFile(source, target) {
    return new Promise((resolve, reject) => {
      client.pull(this.deviceId, source)
      .then((transfer) => {
        transfer.on('end', () => resolve(target))
        transfer.on('error', reject)
        transfer.pipe(fs.createWriteStream(target))
      })
    })
  }
}

export default Device

/**
 * tests
 */

// const deviceId = 'DU2SSE1478031311'
// // const deviceId = '080539a400e358f3'

// // const apk = 'assets/cxnt.apk'
// const device = new Device(deviceId)
// device.getNotGrantedPermissions('com.cvicse.zhnt').then(permissions => {
//   console.log(permissions)
// })

// device.logcat().then((logcat) => {
//   logcat.includeAll('JavaBinder',6)
//   logcat.on('entry', (entry) => {
//     console.log(`${entry.tag} :    ${entry.message}`)
//   })

//   logcat.on('finish', () => {

//   })
// })

// // device.dumpUI().then((output) => console.log(output))
// // device.getFocusedPackageAndActivity().then((output) => console.log(output))
// // device.getCurrentActivity().then((act) => console.log(act))
// // device.getCurrentPackageName().then((pkg) => console.log(pkg))
// device.startActivity('com.cvicse.zhnt/.LoadingActivity').then(() => {
//   console.log('should start the activity')
// })

