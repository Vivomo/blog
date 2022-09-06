const http = require('http')
const DomParser = require('dom-parser')
const fs = require('fs')
const encoding = require('encoding');

const parser = new DomParser()

const startUrl = 'http://www.shiren.org/shiku/gs/tangshi/index.htm'
const origin = 'http://www.shiren.org/'


http.get(startUrl, (res) => {
  let arr = []
  res.on('data', (chunk) => {
    arr.push(chunk)
  })
  res.on('end', () => {
    arr = Buffer.concat(arr)
    let dom = parser.parseFromString(encoding.convert(arr, 'utf8', 'gbk').toString())
    let list = dom.getElementsByClassName('licol4')
    list.forEach((li) => {
      let link = li.getElementsByTagName('a')[0]
      let href = 'http://www.shiren.org/shiku/gs/tangshi/' + link.getAttribute('href');
      download(href, link.textContent.trim())
    })
  })
})

const download = (href, title) => {
  let filename = '../../ignore/qts/' + title + '.txt'
  requestControl.add(href, filename)
}

const requestControl = {
  stack: [],
  limit: 10,
  onRequest: 0,
  failed: [],
  add (url, filePath) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 0) {
      console.log(filePath, 'exist')
      return
    }
    this.stack.push({ url, filePath })
    this.check()
  },
  check () {
    if (this.onRequest < this.limit && this.stack.length > 0) {
      let { url, filePath } = this.stack.shift()
      this.download(url, filePath)
      this.onRequest++
    }
  },
  download (url, filePath, count = 1) {
    try {
      http.get(url, (res) => {
        let arr = []
        res.on('data', (chunk) => { arr.push(chunk) })
        res.on('end', () => {
          let dom = parser.parseFromString(encoding.convert(Buffer.concat(arr), 'utf8', 'gbk').toString())
          let divList = dom.getElementsByTagName('div')
          let contentDiv = divList.find((div) => {
            return div.getAttribute('align') === 'left'
          });
          try {
            fs.writeFileSync(filePath, contentDiv.textContent);
          } catch (e) {
            console.error('write error', filePath)
          }
          this.onRequest--;
          this.check();
        })
      }).on('error', () => {
        if (count === 3) {
          this.onRequest--;
          console.error('error', url, filePath)
          this.check();
        } else {
          this.downloadImg(url, filePath, count + 1);
        }
      })
    } catch (e) {
      console.error('---------------------------')
      console.error(e)
      console.error('---------------------------')
    }
  }
}

