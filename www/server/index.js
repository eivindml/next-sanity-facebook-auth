const next = require('next')
const { parse } = require('url')
const httpProxy = require('http-proxy')
const { createServer } = require('http')

// Server which handles all routing. Proxies
// requests to auth backend or to next.js frontend.

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
        case '/auth/login.js':
          proxy.web(
            req, res,
            { target: 'http://localhost:3001' },
            error => console.log('Error!', error)
          )
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
