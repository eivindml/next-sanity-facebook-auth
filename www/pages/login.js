import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps ({ res }) {
    const APP_ID = '2097319520329465'
    const REDIRECT_URI = 'http://localhost:3000/callback'
    const url = `https://www.facebook.com/v2.10/dialog/oauth?client_id=${APP_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    if (res) {
      res.writeHead(302, {
        Location: url
      })
      res.end()
    } else {
      Router.push(url)
    }
    return {}
  }
  render () {
    return (
      <div>
        <div>Login</div>
        <a href='/'>Home</a>
      </div>
    )
  }
}
