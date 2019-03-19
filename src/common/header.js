import React, { Component } from 'react';
import logo from './img/logo-100.png';
import user from './img/user-image.png';
import Redirect from 'react-router-dom';
//import './app.css';


class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userName: "",
      firstName: "",
      lastName: "",
      userId: "",
      profileImage: "",

    }

  }
  logOutClearStorage() {
    localStorage.clear();
    window.location.href = '/'
  }

  render() {

    return (
      <div>
        <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="/dashboard"><img src={logo} alt="Prakash" /></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="navbar-nav flex-row ml-md-auto d-none d-md-flex">
            <li className="nav-item dropdown">
              <a className="nav-item nav-link dropdown-toggle mr-md-2 text-white" href="#" id="bd-versions" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

                { localStorage.getItem('profileImage') === null || localStorage.getItem('profileImage') === ""  ?

                  (<img src="../img/default-user.png"  className="rounded-circle img-responsive" height="40px" width="40px" />) :

                  (<img src={localStorage.getItem('profileImage')} className="rounded-circle img-responsive" height="40px" width="40px" />)
                }&nbsp;
                {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
              </a>
              
              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="bd-versions">
                <a className="dropdown-item" href="/myProfile">Profile</a>
                <a className="dropdown-item" href="/changePassword">Change Password</a>
                <a className="dropdown-item" onClick={this.logOutClearStorage}>LogOut</a>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Header;

