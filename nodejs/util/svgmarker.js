const fs = require('fs')
const request = require('request')

// 从终端读取svg路径地址并下载
const fileUrl = `http:${process.argv[2]}`
const filename = 'svgfont.js'
const stream = fs.createWriteStream(`./app/files/${filename}`)
request(fileUrl).pipe(stream).on('close', () => svgformat())
// svg格式化处理
function svgformat() {
  fs.readFile(`./app/files/${filename}`, 'utf8', (error, data) => {
    if (error) {
      throw error
    } else {
      const svgArr = data.split('</symbol>') // 获取svg图标数组
      svgArr.pop() // 最后一个为js代码忽略
      let svgTmp = ''
      let viewBox = ''
      svgArr.forEach((svg) => {
        const tmpPath = svg.split('<path')
        // 删除iconfont的图片的'icon-'字母，将-连接的变量转为驼峰式命名变量
        const viewBoxKey = tmpPath[0].match('id=.*"')[0].split('"')[1].replace('icon-', '').replace(/-(\w)/g, x => x.slice(1).toUpperCase())
        // 获取viewBox大小
        const viewBoxValue = tmpPath[0].match('viewBox=.*"')[0].split('"')[1]
        // 默认为 0 0 1024 1024的viewBox不写入文件
        if (viewBoxValue !== '0 0 1024 1024') {
          viewBox[viewBoxKey] = viewBoxValue
          viewBox += `${viewBoxKey}:'${viewBoxValue}',\n`
        }
        const pathArr = []
        // 第一个用来获取viewBox获取信息，后面的数据为path
        tmpPath.shift()
        tmpPath.forEach((path) => {
          // 组装为object对象
          pathArr.push(`{${path.replace(/=/g, ':').replace('fill', ',fill').replace('></path>', '')}}`)
        })
        svgTmp += `${viewBoxKey}:[${pathArr}],\n`
      })
      const svgStr =
        `export default {
          viewBox:{${viewBox}},
          ${svgTmp}
        }`
      fs.writeFileSync('./app/files/font/iconfont.svg.js', svgStr, 'utf8')
      fs.unlink(`./app/files/${filename}`, (err) => { if (err) throw err })
    }
  })
}
