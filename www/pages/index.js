import React from 'react'
import sanity from '@sanity/client'

let s = sanity({
  projectId: 'okmnxtw8',
  dataset: 'production',
  useCdn: false
})

const query = `*[_type == "user"] {
  username,
  note
}[0]
`

export default class extends React.Component {
  static async getInitialProps () {
    return {
      users: await s.fetch(query)
    }
  }
  render () {
    return (
      <div>
        <div>
          Hello {this.props.users.username}
        </div>
        <div>
          Your secret note:
        </div>
        <pre>
          {this.props.users.note}
        </pre>
      </div>
    )
  }
}
