import React from 'react'
import cookies from 'next-cookies'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps (ctx) {
    const { token } = cookies(ctx)

    if (!token) {
      // Empty object means token is not present in cookie,
      // and we just redirects user to login page.
      if (process.browser) {
        Router.push('/login')
      } else {
        ctx.res.writeHead(301, { Location: '/login' })
        ctx.res.end()
      }
    } else {
      // Token is present, and we can make API call with token.
      return { token: token }
    }
  }
  render () {
    return (
      <div>This is authenticated content. Token: {this.props.token}</div>
    )
  }
}
