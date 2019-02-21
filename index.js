let http = require('http')
let https = require('https')
let fs = require('fs')
let path = require('path')
let makeDir = require('make-multiple-dir')
async function runDownload({list, directory, together}) {
  for (let i = 0; i < list.length; i++) {
    // url
    let url = list[i]
    // 匹配url
    let um = url.match(/(\w+:\/\/)([^/:]+)(:\d*)?/)
    // 文件名
    let filename = url.replace(/^.*[/\\\\]/ig, '')
    // 协议
    let agreement = um[1].replace('://', '').toLowerCase()
    // 域名
    let hostname = um[2]
    // 路径
    let customPath = url.split(hostname)[1].replace(filename, '')
    await download({
      url,
      filename,
      agreement,
      hostname,
      customPath,
      list,
      directory,
      together,
      index: i
    }, i)
  }
}
let hs = {
  http,
  https
}
let download = async ({
                        url,
                        filename,
                        agreement,
                        hostname,
                        customPath,
                        list,
                        directory,
                        together,
                        index
                      }) => {
  return new Promise((resolve, reject) => {
    console.log(`[Dowmload] 准备下载第${index + 1}个文件`)
    console.log(`[Dowmload] ${url}`)
    hs[agreement].get(url, (res) => {
      console.log('[Dowmload] 正在下载中...')
      let fileData = ''
      // 一定要设置response的编码为binary否则会下载下来的图片打不开
      res.setEncoding('binary')
      res.on('data', chunk => {
        fileData += chunk
      })
      let userPath = ''
      if (together) { // 文件下载到一起
        userPath = path.join(directory || 'default')
      } else { // 文件不下载到一起
        userPath = path.join(directory || 'default' ,customPath)
      }
      res.on("end", () => {
        makeDir(userPath, {
          cwd: path.resolve()// 此文件夹必须存在
        })
        fs.writeFile(path.join(userPath, filename), fileData, "binary", err => {
          if (err) {
            console.log('[Dowmload] 下载失败')
            console.log(`[Dowmload] ${err}`)
            resolve(false)
            return
          }
          console.log('[Dowmload] 下载保存成功')
          console.log('[Dowmload] ' + path.join(path.resolve(), userPath, filename))
          resolve(true)
        })
      })
      res.on("error", err => {
        console.log('[Dowmload] 请求失败')
        console.log(`[Dowmload] ${err}`)
        resolve(false)
      })
    })
  })
}
module.exports = runDownload