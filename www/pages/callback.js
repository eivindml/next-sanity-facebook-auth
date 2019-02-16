import React from 'react'

export default class extends React.Component {
  static async getInitialProps ({ query }) {
    return { query }
  }
  render () {
    console.log(this.props.query)
    return (
      <div>
        Callback
      </div>
    )
  }
}
