const fs = require('fs')
const axios = require('axios')

module.exports = {
  data: () => {
    const path = __dirname + '/../views/layouts/markdown/content.md'
    const text = fs.readFileSync(path, 'utf8')
    return axios.post('https://api.github.com/markdown', {
      text,
      mode: 'markdown'
    }).then(res => {
      return {
        markdown: res.data
      }
    })
  }
}
