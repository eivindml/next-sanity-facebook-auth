const next = require('next')
const { parse } = require('url')
const httpProxy = require('http-proxy')
const { createServer } = require('http')

// TODO: Go through this and clean up and understand
// TODO: Can we use micro instead of http?
// TODO: What does a proxy do?

const app = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = app.getRequestHandler()
const proxy = httpProxy.createProxyServer()

app.prepare()
  .then(() => {
    createServer((req, res) => {
      const parsedUrl = parse(req.url, true)
      const { pathname, query } = parsedUrl

      switch (pathname) {
        case '/':
          app.render(req, res, '/', query)
          break
        case '/login':
          app.render(req, res, '/login', query)
          break
        case '/api/login.js':
          proxy.web(req, res, { target: 'http://localhost:3001' }, error =>
            console.log('Error!', error)
          )
          break
        case '/profile':
          app.render(req, res, '/profile', query)
          break
        case '/api/profile.js':
          proxy.web(req, res, { target: 'http://localhost:3001' }, error =>
            console.log('Error!', error))
          break
        default:
          handle(req, res, parsedUrl)
          break
      }
    })
      .listen(3000, err => {
        if (err) { throw err }
        console.log('> Ready on http://localhost:3000')
      })
  })
