const { send } = require('micro')
const login = require('./login')

const dev = async (req, res) => {
  switch (req.url) {
    case '/auth/login.js':
      await login(req, res)
      break
    default:
      send(res, 404, '404. Not found.')
      break
  }
}

module.exports = dev
