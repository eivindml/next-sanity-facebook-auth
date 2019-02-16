import React from 'react'
import Router from 'next/router'
import fetch from 'isomorphic-unfetch'
import cookie from 'js-cookie'

export default class extends React.Component {
  static async getInitialProps (ctx) {
    let code = ctx.query.code
    const response = await fetch('http://localhost:3000/auth/login.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    if (response.ok) {
      const { token, image } = await response.json()
      console.log('Login success.')
      return { token, image }
    } else {
      console.log('Login failed.')
      // // https://github.com/developit/unfetch#caveats
      // let error = new Error(response.statusText)
      // error.response = response
      // return Promise.reject(error)
      return {}
    }
  }
  componentDidMount () {
    // login({ token })
    // TODO: Set token here, and redirect to index.
    // We need to set the cookie client side.
    // TODO: Maybe better to set cookie on elsewhere
    cookie.set('token', this.props.token/* , { expires: 100 } */)
    Router.push('/')
  }
  render () {
    return null
  }
}
