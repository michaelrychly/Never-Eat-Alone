import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import Navbar from './Navbar';
import Index from './Index';
import Users from './Users';
import UserProfile from './UserProfile';
import UserPreferences from './UserPreferences';
import Messages from './Messages';
import Login from './Login';
import Signup from './Signup';
import Footer from './Footer';
import Favorites from './Favorites'
import UsersWithMaps from './UsersWithMaps';
import Restaurant from './Restaurant';

class Parent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: "",
      email: ""
    }
  }

  componentWillMount() {
  }

  //prop method for login, setting the email state
  _doLogin = (input) => {
    const state = this.state;
    this.setState(...state, { id: input.id, email: input.email });
  }

  _logout() {
    const state = this.state;
    this.setState(...state, { id: '', email: '', message: []});
  }

  render() {
    return (<div>
      <Navbar id={this.state.id} email={this.state.email} logout={this._logout.bind(this)} />
      <Grid className='grid'>
        <Switch>
          <Route path='/api/users/:id/preferences' render={(props) => (
            <UserPreferences {...props} id={this.state.id} email={this.state.email} />)} />
          <Route path='/api/users/:id/messages' render={(props) => (
            <Messages {...props} id={this.state.id} email={this.state.email} />)} />
          <Route path='/api/users/:id/favorites' render={(props) => (
            <Favorites {...props} id={this.state.id} email={this.state.email} />)} />
          <Route path='/api/users/:id' component={UserProfile} />
          <Route path='/api/users' render={(props) => (
            <Users {...props} id={this.state.id} email={this.state.email} />)} />
          <Route path='/api/messages/:id/' render={(props) => (
            <Messages {...props} id={this.state.id} email={this.state.email} />)} />
          <Route exact path='/api/login' render={(props) => (
            <Login {...props} doLogin={this._doLogin} />)} />
          <Route exact path='/api/signup' render={(props) => (
            <Signup {...props} doLogin={this._doLogin} />)} />
          <Route exact path='/api/maps' render={(props) => (
            <UsersWithMaps {...props} id={this.state.id} email={this.state.email} />)} />
          <Route path='/api/restaurant' component={Restaurant} />
          <Route path='/api/about' component={Footer} />
          <Route path='/' component={Index} />
        </Switch>
      </Grid>
    </div>
    )
  }
}
export default Parent;