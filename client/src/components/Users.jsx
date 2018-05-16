import React from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Resource from '../models/resource';
import Maps from './Map';
import { Grid, Row, Col, Alert, DropdownButton, MenuItem, ButtonToolbar, Thumbnail, Button, Modal,FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Restaurant from './Restaurant';
import TimePicker from 'react-bootstrap-time-picker';

const userData = Resource('users')

class Users extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: [],
      backup: [],
      user_offers: [],
      industries: [],
      offers_needs: [],
      favorites: [],
      scrollData: [],
      filter: {
        industry: '',
        offer: ''
      },
      loadMore: true,
      isOpen: false,
      content: '',
      to_user: '',
      liked: false,
      personClicked: '',
      reply_id: '',
      reply_name: '',
      restaurant: '',
      time: 0
    }
  }

  componentWillMount() {
    userData.findAll()
      .then((data) => {
        let result= data.filter(item=>{
          return item.id !== this.props.id
        })
        this.setState({
          lists: result,
          backup: result,
          errors: null,
        })
      })
      .then(() => {
        this.initData();
      })
      .catch((errors) => this.setState({ errors: errors }))

    userData.findIdustries()
      .then((result) => {
        this.setState({ industries: result })
      })
      .catch((errors) => this.setState({ errors: errors }))

    userData.findOffersNeeds()
      .then((result) => {
        this.setState({ offers_needs: result })
      })
      .catch((errors) => this.setState({ errors: errors }))

    userData.findFavorites(this.props.id)
      .then((result) => {
        this.setState({ favorites: result })
      })
      .catch((errors) => this.setState({ errors: errors }))
  }

  initData = () => {
    let data = this.state.backup.slice(0, 21)
    this.setState({ scrollData: data }, () => {
      this.props.currentSelection(this.state.scrollData);
    })
  }
  // componentDidMount() {
  //   window.addEventListener('scroll', this.handleOnScroll);
  // }
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.handleOnScroll);
  // }

  loadMore = () => {
    let checkMore = this.state.backup.length
    let length = this.state.scrollData.length
    if (checkMore === length) {
      this.setState({ loadMore: false })
    } else {
      let data = this.state.backup.slice(length, 21 + length)
      let newData = this.state.scrollData.concat(data)
      this.setState({ scrollData: newData }, () => {
      this.props.currentSelection(this.state.scrollData);
      })
    }
  }

  // handleOnScroll = () => {
  //   let scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
  //   let scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
  //   let clientHeight = document.documentElement.clientHeight || window.innerHeight;
  //   let scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;

  //   if (scrolledToBottom) {
  //     this.loadMore();
  //   }
  // }

  _handleIndustrySelect = (e) => {
    let newFilter = this.state.filter
    newFilter.industry = e
    this.setState({ filter: newFilter })
    let newList = [];
    let off = this.state.filter.offer
    if (e && off) {
      newList = this.state.lists.filter(list => {
        return list.industry === e && (list.offers[0] === off || list.offers[1] === off || list.offers[2] === off)
      })
    } else if (e && !off) {
      newList = this.state.lists.filter(list =>
        list.industry === e)
    } else if (!e && off) {
      newList = this.state.lists.filter(list => {
        return (list.offers[0] === off || list.offers[1] === off || list.offers[2] === off)
      })
    } else {
      newList = this.state.lists
    }
    this.setState({
      backup: newList
    }, () => {
      let data = this.state.backup.slice(0, 21)
      this.setState({ scrollData: data }, () => {
      this.props.currentSelection(this.state.scrollData);
      })
    });
  }

  _handleOfferSelect = (e) => {
    let newFilter = this.state.filter
    newFilter.offer = e
    this.setState({ filter: newFilter })
    let newList = []
    let indu = this.state.filter.industry
    if (e && indu) {
      newList = this.state.lists.filter(list => {
        return list.industry === indu && (list.offers[0] === e || list.offers[1] === e || list.offers[2] === e)
      })
    } else if (e && !indu) {
      newList = this.state.lists.filter(list => {
        return (list.offers[0] === e || list.offers[1] === e || list.offers[2] === e)
      })
    } else if (!e && indu) {
      newList = this.state.lists.filter(list =>
        list.industry === indu)
    } else {
      newList = this.state.lists;
    }
    this.setState({
      backup: newList
    }, () => {
      let data = this.state.backup.slice(0, 21)
      this.setState({ scrollData: data }, () => {
      this.props.currentSelection(this.state.scrollData);
      })
    });
  }

  _handleLike = (e) => {
    console.log("klike")
    let id = e.target.getAttribute('data-key')
    id = parseInt(id)
    if (this.state.favorites.indexOf(id) < 0) {
      userData.addFavorites(this.props.id, id)
        .then((result) => {
          console.log("i am in adddddddd")
          let fav_array = this.state.favorites
          fav_array.push(id)
          this.setState({ favorites: fav_array })
        })
        .catch((errors) => this.setState({ errors: errors }))
    } else {
      userData.deleteFavorites(this.props.id, id)
        .then((result) => {
          console.log("i am herer")
          let index = this.state.favorites.indexOf(id)
          let fav_array = this.state.favorites
          fav_array.splice(index, 1)
          this.setState({ favorites: fav_array })
        })
        .catch((errors) => this.setState({ errors: errors }))
    }
  }

  toggleModal = (e) => {
    if (!this.state.isOpen) {
      let id = e.target.getAttribute('data-keyid')
      id = parseInt(id)
      let name = e.target.getAttribute('data-keyname')
      this.setState({
        isOpen: !this.state.isOpen,
        reply_id :id,
        reply_name: name
      });
    } else {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  _handleSubmit = (e) => {
    const state = this.state;
    const date = this.convertSeconds(this.state.time);
    const message = this.state.content + " At: " + this.state.restaurant + " Time: " + date;
    this.setState(...state, {content: message} , () => {
      userData.sendMessages(this.props.id, this.state.reply_id, this.state.content)
        .then(() => {
          console.log("ok")
        })
        .catch((errors) => this.setState({ errors: errors }))
        this.toggleModal()
      });
  }


  convertSeconds(seconds) {
    let days     = Math.floor(seconds / (24*60*60));
        seconds -= days    * (24*60*60);
    let hours    = Math.floor(seconds / (60*60));
        seconds -= hours   * (60*60);
    let minutes  = Math.floor(seconds / (60));
        seconds -= minutes * (60);

    if (minutes === 0)
    {minutes = '00'};
    let hoursAndMinutes = hours + ":" + minutes;
    return hoursAndMinutes;
  }

  _handleChange = (e) => {
    this.setState({content: e.target.value});
  }

  _onClick(personClicked){
    const state = this.state;
    this.setState(...state, {personClicked: personClicked}, () => {
      this.props.person(this.state.personClicked);
      })
  }

  _restaurantChosen(restaurant){
    console.log("in users", restaurant)
    const state = this.state;
    this.setState(...state, {restaurant: restaurant.name,
                             restaurantObject: restaurant});
  }

  _udpateRestaurant(event) {
    event.preventDefault();
    const state = this.state;
    this.setState(...state, {restaurant: event.target.value});
  }

  _handleTimeChange(time) {
    const state = this.state;
    this.setState(...state, {time: time});
  }
  // _handleLiked = (e) => {
  //   let newList = []
  //   newList = this.state.lists.filter((item)=> {
  //     return this.state.favorites.includes(item.id)
  //   })
  //   this.setState({
  //     backup: newList,
  //     liked: !this.state.liked
  //   }, () => {
  //     let data = this.state.backup.slice(0, 21)
  //     this.setState({ scrollData: data })
  //   });
  // }

  render() {

    const displayImage = this.state.scrollData.map((scroll, idx) => {
      return (<Col xs={4} md={4}>
        <Thumbnail className='usersThumb' src={scroll.image} alt="242x210" onClick={this._onClick.bind(this, scroll)}>
          <h5><strong>{scroll.name}</strong></h5>
          <h6>Industry: {scroll.industry}</h6>
          <h6>Offers: {scroll.offers[0]}, {scroll.offers[1]},{scroll.offers[2]} </h6>
          {this.state.favorites.indexOf(scroll.id) < 0 ?
            (<Button bsStyle="primary" data-key={scroll.id} onClick={this._handleLike.bind(this)}>Like</Button>) :
            (<Button bsStyle="danger" data-key={scroll.id} onClick={this._handleLike.bind(this)}>Liked</Button>)}
          <Button data-keyid={scroll.id} data-keyname={scroll.name} bsStyle="default" onClick={this.toggleModal.bind(this)}>Invite</Button>
        </Thumbnail>
      </Col >)
    })

//    if (!this.props.email) {
//      return (<Row>
//        <h2>Please<Link to='/api/signup'> Signup</Link> or<Link to='/api/login'> Login</Link> first!</h2>
//      </Row>)
//    } else {
      return (<Grid>
        <Row className='usersDropRow'>
          <ButtonToolbar>
            <DropdownButton
              bsStyle='primary'
              title={this.state.filter.industry ? this.state.filter.industry : "Industry"}
              id='dropdown-basic-industry'
            >
              {this.state.industries.map((industry, idx) => {
                return <MenuItem eventKey={industry.title} onSelect={this._handleIndustrySelect.bind(this)}>{industry.title}</MenuItem>
              })}
              <MenuItem eventKey="" onSelect={this._handleIndustrySelect.bind(this)}>All</MenuItem>
            </DropdownButton>

            <DropdownButton
              bsStyle='warning'
              title={this.state.filter.offer ? this.state.filter.offer : 'Offers'}
              id='dropdown-basic-offers'
            >
              {this.state.offers_needs.map((item, idx) => {
                return <MenuItem eventKey={item.title} onSelect={this._handleOfferSelect.bind(this)}>{item.title}</MenuItem>
              })}
              <MenuItem eventKey="" onSelect={this._handleOfferSelect.bind(this)}>All</MenuItem>
            </DropdownButton>
          </ButtonToolbar>
        </Row>
        <Row className='usersImageRow'>
          {displayImage}
        </Row>
        <Modal show={this.state.isOpen} bsSize="lg"
          onHide={this.toggleModal.bind(this)} style={{zIndex: 1210}}>
          <Row>
          <Col xs={12} md={6} className='usersWithMapsCol'>
          <Modal.Header closeButton>
            <Modal.Title>Reply to {this.state.reply_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body bsSize="large">
            <FormGroup controlId="formControlsTextarea">
              <ControlLabel>Message:</ControlLabel>
              <FormControl componentClass="textarea" placeholder="Write your message..." onChange={this._handleChange.bind(this)} />
              <div class="input-group">
                <span class="input-group-addon" id="sizing-addon2">Suggested restaurant: </span>
                <input type="text" class="form-control" aria-describedby="sizing-addon2"
                onChange={this._udpateRestaurant.bind(this)} value={this.state.restaurant}
                placeholder="Pick from map or type..." />
              </div>
              <div class="input-group">
                <span class="input-group-addon" id="sizing-addon2">Suggested time: </span>
                <TimePicker start="10:00" end="15:00" step={30}
                  onChange={this._handleTimeChange.bind(this)} value={this.state.time} />
              </div>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this._handleSubmit.bind(this)}>Send</Button>
          </Modal.Footer>
          </Col>
          <Col xs={12} md={6} className='usersWithMapsCol'>
          <Restaurant restaurantChosen={this._restaurantChosen.bind(this)}/>
          </Col>
          </Row>
          </Modal>
        <Row className='usersLoadRow'>
          {this.state.loadMore ?
            <Button onClick={this.loadMore} style={{ display: 'flex', justifyContent: 'center' }}>Load More!</Button> :
            <Alert bsStyle="warning"><strong>No more profiles</strong></Alert>}
        </Row>
        </Grid>)
    //}
  }
}

export default Users