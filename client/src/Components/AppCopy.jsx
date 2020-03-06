/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import './App.css';
// import { hot } from "react-hot-loader";
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import MapContainer from './Components/MapContainer.jsx';
import { onSignIn } from '../dist/script';
// Topbar Menu imports
import MenuItem from './MenuItem.jsx';
import Menu from './Menu.jsx';
import MenuButton from './MenuButton.jsx';

import UserProfile from './Components/userProfile.jsx';
import CreateEvent from './CreateEvent.jsx';
import Home from './Components/Home.jsx';
import UserEvents from './Components/UserEvents.jsx';
import AttendingEvents from './Components/AttendingEvents.jsx';
import EventPage from './Components/EventPage.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      googleUser: [],
      menuOpen: false,
      currentUsername: '',
      userId: 0,
      userEvents: [],
      clickedEventId: '',
      currentId: '',
      currentView: 'Signup',
      // appView: 'Home',
      events: [],
      user: '',
      userName: '',
    };
    // this.createEvent = this.createEvent.bind(this);
    this.getUserEvents = this.getUserEvents.bind(this);
    this.postUser = this.postUser.bind(this);
    this.getUser = this.getUser.bind(this);
    this.handleUserEventClick = this.handleUserEventClick.bind(this);
    this.userInfo = this.userInfo.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (localStorage.getItem('user')) {
      this.setState({
        events: JSON.parse(localStorage.getItem('events')),
        userName: JSON.parse(localStorage.getItem('userName')),
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('events', JSON.stringify(nextState.events));
    localStorage.setItem('userName', JSON.stringify(nextState.userName));
  }

  getUser() {
    return axios({
      method: 'get',
      url: `api/user/users/${this.state.googleUser.profileObj.email}`,
    })
      .then(res => {
        this.setState({ userId: res.data[0].id });
      });
  }

  getUserEvents() {
    const { userId } = this.state;
    axios({
      method: 'get',
      url: `/api/event/events/${userId}`,
    })
      .then(res => {
        this.setState({ events: res.data });
      });
  }

  postUser() {
    axios({
      method: 'post',
      url: 'api/user/users/',
      data: {
        username: this.state.currentUsername,
        email: this.state.googleUser.profileObj.email,
      },
    });
  }

  userInfo() {
    this.postUser();
    this.getUser()
      .then(() => {
        this.setState({
          user: this.state.googleUser,
          userName: this.state.currentUsername,
        });
      })
      .then(() => {
        this.getUserEvents();
      });
  }

  // create event button on click changes appView
  // createEvent() {
  //   this.setState({
  //     appView: 'CreateEvent',
  //   });
  // }

  // chat view
  // changeView(view) {
  //   this.setState({
  //     currentView: view,
  //   });
  // }

  // chat sign up
  // createUser(username) {
  //   axios({
  //     method: 'post',
  //     url: 'api/chatkit/users',
  //     data: {
  //       id: username,
  //       name: username,
  //     },
  //   })
  //     .then((res) => {
  //       console.log(res.data.id);
  //       this.setState({
  //         currentUsername: res.data.name,
  //         currentId: res.data.id,
  //         currentView: 'chatApp',
  //       });
  //     }).catch((err) => {
  //       console.log(err);
  //       if (err.status === 400) {
  //         this.setState({
  //           currentUsername: username,
  //           currentId: username,
  //           currentView: 'chatApp',
  //         });
  //       } else {
  //         console.log(err.status);
  //       }
  //     });
  // }

  // Menu handler
  handleMenuClick() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  handleLinkClick(link) {
    this.setState({ menuOpen: false });
    // this.setState({ appView: link.val });
  }


  handleUserEventClick(event) {
    this.setState({ clickedEventId: event.target.id });
    // this.setState({ appView: 'EventPage' });
  }

  render() {
    //
    const responseGoogle = (response) => {
      console.log(response);
    };
    //
    const onSignIn = (googleUser) => {
      console.log(googleUser, 'settingstate');
      this.setState({
        // appView: 'Profile Page',
        currentUsername: googleUser.profileObj.name,
        googleUser,
      }, this.userInfo);
    };

    // navbar css
    const styles = {
      container: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: '99',
        opacity: 0.9,
        display: 'flex',
        alignItems: 'center',
        background: 'black',
        width: '100%',
        color: 'white',
        fontFamily: 'Lobster',
      },
      logo: {
        margin: '0 auto',
      },
      body: {
        paddingTop: '65px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        filter: this.state.menuOpen ? 'blur(2px)' : null,
        transition: 'filter 0.5s ease',
      },
    };
    // navbar menu items
    // const menu = ['Home', 'Created Events', 'RSVP\'d Events', 'Profile Page'];
    // const menuItems = menu.map((val, index) => {
    //   return (
    //     <MenuItem
    //       key={index}
    //       delay={`${index * 0.1}s`}
    //       onClick={() => { this.handleLinkClick({ val }); }}
    //     >{val}
    //     </MenuItem>
    //   );
    // });


    // // App conditional render
    // let appView = '';
    // if (this.state.appView === 'Home') {
    //   appView = <Home viewSummary={this.handleUserEventClick} userId={this.state.userId} handleClick={this.createEvent} />;
    // } else if (this.state.appView === 'CreateEvent') {
    //   appView = <CreateEvent currentUser={this.state.currentUsername} googleUser={this.state.googleUser} />;
    // } else if (this.state.appView === 'Created Events') {
    //   appView = <UserEvents events={this.state.userEvents} handleClick={this.handleUserEventClick} />;
    // } else if (this.state.appView === 'RSVP\'d Events') {
    //   appView = <AttendingEvents />;
    // } else if (this.state.appView === 'Profile Page') {
    //   appView = <UserProfile user={this.state.googleUser} userName={this.state.currentUsername} postUser={this.postUser} getUser={this.getUser} getUserEvents={this.getUserEvents} />;
    // } else if (this.state.appView === 'EventPage') {
    //   appView = <EventPage eventID={this.state.clickedEventId} googleUser={this.state.googleUser} />;
    // }

    const menu = [{ name: 'Home', link: '/' }, { name: 'Created Events', link: '/userevents' }, { name: 'RSVP\'d Events', link: '/attendingevents' }, { name: 'Profile Page', link: '/profile' }];

    return (
      <div>
        <BrowserRouter>
          <div className="g-signin2">
            <GoogleLogin
              clientId="870155244088-hav8sg0oo71s181ghhetvqdgrssuo8ln.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={onSignIn}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
          <div style={styles.container}>
            <MenuButton open={this.state.menuOpen} onClick={() => this.handleMenuClick()} color="white" />
            <div style={styles.logo}>Social Club</div>
          </div>
          <div>
            <Menu open={this.state.menuOpen}>

              {/* {menuItems} */}
              {menu.map((val, index) => {
                return (
                  <MenuItem
                    key={index}
                    delay={`${index * 0.1}s`}
                    onClick={() => { this.handleLinkClick(); }}
                  >
                    <Link to={val.link}>
                      {val.name}
                    </Link>
                  </MenuItem>
                );
              })}
            </Menu>
          </div>
          {/* {appView} */}
          <Switch>
            <Route exact path="/" render={(routerProps) => (<Home {...routerProps} viewSummary={this.handleUserEventClick} userId={this.state.userId} />)} />
            <Route exact path="/createevent" render={(routerProps) => (<CreateEvent {...routerProps} currentUser={this.state.currentUsername} googleUser={this.state.googleUser} />)} />
            <Route exact path="/userevents" render={(routerProps) => (<UserEvents {...routerProps} userId={this.state.userId} events={this.state.events} handleClick={this.handleUserEventClick} />)} />
            <Route exact path="/attendingevents" render={(routerProps) => (<AttendingEvents {...routerProps} userId={this.state.userId} />)} />
            <Route exact path="/profile" render={(routerProps) => (<UserProfile {...routerProps} user={this.state.user} userName={this.state.userName} postUser={this.postUser} getUser={this.getUser} getUserEvents={this.getUserEvents} />)} />
            <Route exact path="/eventpage" render={(routerProps) => (<EventPage {...routerProps} eventID={this.state.clickedEventId} googleUser={this.state.googleUser} />)} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;