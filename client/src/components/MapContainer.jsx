import React from 'react';
import MapsReact from 'google-maps-react';
import Maps from './Maps';
import GoogleApiComponent from '../GoogleApiComponent';

export class Container extends React.Component {
  render() {
    const style = {
      width: '500px',
      height: '500px '
    }
    if (!this.props.loaded) {
      return <div>Loading...</div>
    }
    return (
      <Maps google={this.props.google} />
    )
  }
}

export default GoogleApiComponent({
  apiKey: 'AIzaSyA8Mufeh6GACIkLqJlIXnjC0o3NEi0FaBY'
})(Container)