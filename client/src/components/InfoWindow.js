import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button } from 'react-bootstrap';
import { InfoWindow } from "react-google-maps";

class InfoWindows extends Component {
  constructor(props){
    super(props);
    this.state = {
      isOpen: '',
      toUser: false,
      toMessage: false,
      food: [
      'https://picsum.photos/100/100/?image=859',
      'https://picsum.photos/100/100/?image=882',
      'https://picsum.photos/100/100/?image=856',
      'https://picsum.photos/100/100/?image=1060',
      'https://picsum.photos/100/100/?image=835',
      'https://picsum.photos/100/100/?image=785',
      'https://picsum.photos/100/100/?image=635',
      'https://picsum.photos/100/100/?image=513',
      'https://picsum.photos/100/100/?image=431',
      'https://picsum.photos/100/100/?image=395',
      'https://picsum.photos/100/100/?image=225']
    }
  }

  componentWillMount() {
    const state = this.state;
    this.setState(...state, {isOpen: this.props.open});
  }

  _onCloseclick(){
    this.props.onClose();
  }

  _onlick(){
    const state = this.state;
    this.setState(...state, {toUser: true});
  }

  _sendMessage(){
    const state = this.state;
    this.setState(...state, {toMessage: true});
  }

  _navigate(){
    window.open(this.props.info.shortUrl);
  }

  _restaurantChosen() {
    this.props.restaurantChosen(this.props.info);
  }

  render() {
    if (this.state.toUser === true) {
      return <Redirect to={'users/'+  this.props.info.id} />
    }

    if (this.state.toMessage === true) {
      return <Redirect to={'messages/'+  this.props.info.id} />
    }

    const content = this.props.info.image ? (//infoWindow for people
        <div>
          <img src={this.props.info.image} alt='peopleImage'/>
          <p>{this.props.info.name}</p>
          <p>Company: {this.props.info.company}</p>
          <Button onClick={this._sendMessage.bind(this)}>Send message</Button>
        </div>
    ) : (//infoWindow for restaurants
        <div>
          <img src={this.state.food[this.props.markerNumber]}
              onClick={this._navigate.bind(this)} alt='restaurantImage'/>
          <p>{this.props.info.name}</p>
          <p>{this.props.info.location.formattedAddress[0]} </p>
          <Button onClick={this._restaurantChosen.bind(this)}>Choose</Button>
        </div>
    )

    return (<InfoWindow onCloseClick={this._onCloseclick.bind(this)}>
        {content}
      </InfoWindow>
    );
  }
}

export default InfoWindows;