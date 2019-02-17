import React from 'react'
import Router from 'next/router'
import cookies from 'next-cookies'
import sanity from '@sanity/client'

// TODO: Fix unhandled promise rejection error
// TODO: Refactor into functions etc

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
      const query = `*[_type == 'user'] {
        username,
        _id
      }
      `
      const s = sanity({
        projectId: process.env.SANITY_PROJECT_ID,
        dataset: process.env.SANITY_DATASET,
        useCdn: false,
        token: token
      })

      const re = await s.fetch(query)

      return { token: token, users: re }
    }
  }
  render () {
    return (
      <div>
        This is authenticated content. Token: {this.props.token}
        {this.props.users &&
          <div>
            {this.props.users.map((user, key) =>
              <div key={key}>
                {user.username}
              </div>
            )}
          </div>
        }
      </div>
    )
  }
}
