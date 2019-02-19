import React from 'react'
import Router from 'next/router'
import sanity from '@sanity/client'
import cookies from 'next-cookies'

const client = sanity({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET
})

export default class extends React.Component {
  static async getInitialProps (ctx) {
    const { token } = cookies(ctx)

    // If no token exists, we redirect to login page
    if (!token) { this.redirectToLogin(ctx.res) }

    // We have a token which we then can use
    // to get data from Sanity which requires authentication.
    const users = await this.getUsers(token)
    return { token, users }
  }
  static redirectToLogin (res) {
    // We have to do different redirect,
    // depending upon wether we are client
    // side or server side.
    if (process.browser) {
      Router.push('/login')
    } else {
      res.writeHead(301, { Location: '/login' })
      res.end()
    }
  }
  // Tries to get list of all users,
  // but the result should be an array
  // only including yourself, since you
  // only have permissions to read/write
  // to your own profile.
  static async getUsers (token) {
    const query = `*[_type == 'user'] {
      name,
      _id
    }
    `
    client.config({ token })
    return client.fetch(query)
  }
  render () {
    return (
      <React.Fragment>
        <h1>Your secret profile 🔐</h1>
        {this.props.users &&
          <div>
            {this.props.users.map((user, key) =>
              <div>
                <div key={key}>{user.name}</div>
              </div>
            )}
          </div>
        }
      </React.Fragment>
    )
  }
}
