import React from 'react'
import {Grid} from 'react-bootstrap'
import Resource from '../models/resource'

const userData = Resource('users')

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userId: (this.props.match.params.id || null),
      messages:[]
    }
  }

  componentWillMount() {
    userData.findMessages(this.state.userId)
    .then((result) => {
      this.setState({ messages: result })
    })
    .catch((errors) => this.setState({ errors: errors }))
  }

  render() {
    return (
      <div>
        <Grid>
          Welcome to your messages!
        </Grid>
      </div>
    )
  }
}

export default Messages
