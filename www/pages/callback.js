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
      const { token, image, expire } = await response.json()
      return { token, image, expire }
    } else {
      // // https://github.com/developit/unfetch#caveats
      // let error = new Error(response.statusText)
      // error.response = response
      // return Promise.reject(error)
      return {}
    }
  }
  componentDidMount () {
    // TODO: Maybe better to set cookie on elsewhere
    const expires = new Date(this.props.expire)
    cookie.set('token', this.props.token, { expires })
    Router.push('/')
  }
  render () {
    return null
  }
}
