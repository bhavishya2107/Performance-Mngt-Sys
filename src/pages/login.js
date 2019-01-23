import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
class loginPage extends Component {
    render() {
        return (
            <div>
                <form className="form-signin card p-3 shadow">
                    <h2 className="form-signin-heading text-center">
                        <img src={logo} alt="Prakash" className="img-fluid" />
                    </h2>
                    <div className="form-group">
                        <label className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" />
                    </div>
                    <div className="form-group">
                        <label className="sr-only">Password</label>
                        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />
                    </div>
                    <div className="form-group">
                        <div className="checkbox">
                            <label>
                                <input type="checkbox" value="remember-me" /> Remember me
                        </label>
                        </div>
                    </div>
                    <a href="/dashboard" className="btn btn-lg btn-primary btn-block">Sign in</a>
                </form>
            </div>
        )
    }
}
export default loginPage;