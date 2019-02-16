const { send, run } = require('micro')

const login = async (req, res) => {
  send(res, 200, 'ape')

  // send(res, 200, 'Hei')
  // const { username } = await json(req)
  // const username = 'eivindml'
  // const url = `https://api.github.com/users/${username}`
  //
  // try {
  //   const response = await fetch(url)
  //   if (response.ok) {
  //     console.log('asdkasdk')
  //     const { id } = await response.json()
  //     send(res, 200, { token: id })
  //   } else {
  //     console.log('doh')
  //     send(res, response.status, response.statusText)
  //   }
  // } catch (error) {
  //   console.log('dohasdasd')
  //   throw createError(error.statusCode, error.statusText)
  // }
}

module.exports = (req, res) => run(req, res, login)
