import React from 'react'
import Router from 'next/router'

export default class extends React.Component {
  static async getInitialProps ({ res }) {
    // Immediately redirct to the Facebook login.
    // Facebook login will then redirect back to
    // your URL specified in your .env file.
    this.redirectToFacebookLogin(res)
  }
  static redirectToFacebookLogin (res) {
    const url = `https://www.facebook.com/v2.10\
/dialog/oauth\
?client_id=${process.env.FACEBOOK_APP_ID}\
&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}`

    // We have to do different redirect,
    // depending upon wether we are client
    // side or server side.
    if (process.browser) {
      Router.push(url)
    } else {
      res.writeHead(302, { Location: url })
      res.end()
    }
  }
  render () {
    return null
  }
}
