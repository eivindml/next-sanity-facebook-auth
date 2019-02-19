import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'

export default class extends React.Component {
  // Start login flow, which eventually returns token and expiration date
  static async getInitialProps (ctx) {
    const url = 'http://localhost:3000/auth/login.js'
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ctx.query.code })
    })

    const { token, expires } = await response.json()
    return { token, expires }
  }
  componentDidMount () {
    // Store the token in a cookie
    // and return back to homepage.
    const expires = new Date(this.props.expires)
    cookie.set('token', this.props.token, { expires })
    Router.push('/')
  }
  render () {
    return null
  }
}
