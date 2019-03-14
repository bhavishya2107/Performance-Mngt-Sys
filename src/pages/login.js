import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
import { environment, moduleUrls, Type, Notification } from './Environment';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';

class loginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: "",
            password: "",
            firtName: "",
            lastName: "",
            userName: "",
            userId: '',
            profileImage: "",
            RedirectLoginDetails: false,


        };
    }

    loginCheckIsValid() {

        const credentialValid = environment.apiUrl + moduleUrls.User + '?_where=(emailAddress,eq,' + `${this.state.emailAddress}` + ')' + '~and(password,eq,' + `${this.state.password}` + ')';
        return $.ajax({
            url: credentialValid,
            type: Type.get,
            data: ''
        });
    }
    //#region role data
    getRoleData(roleId) {
        const roleUrl = environment.apiUrl + moduleUrls.Role + "/" + roleId;
        return $.ajax({
            url: roleUrl,
            type: Type.get,
            data: ''
        });
    }
    //#endregion

    //email when changed reflects in setState
    emailAddressOnChange = (event) => {
        $(".errorIfInvalIdInput").hide()
        this.setState({
            emailAddress: event.target.value
        })

    }
    //password when changed reflects in setState
    passwordOnChange = (event) => {
        $(".errorIfInvalIdInput").hide()
        this.setState({
            password: event.target.value
        })
    }
    checkCredential = (event) => {
        // event.preventDefault(event);
        var isvalidate = window.formValidation("#loginForm")

        if (isvalidate) {
            var res = this.loginCheckIsValid();
            res.done((response) => {
                if (response.length > 0) {
                    this.fetchingValueInLocalStorage(response[0]);
                }
                else {
                    $(".errorIfInvalIdInput").show();
                }
            })
            res.fail((error) => {

            })
        } else {
            return false;
        }
    }

    fetchingValueInLocalStorage(response) {
        localStorage.setItem('emailAddress', response.emailAddress);
        localStorage.setItem('userId', response.userId);
        localStorage.setItem('userName', response.userName);
        localStorage.setItem('firstName', response.firstName);
        localStorage.setItem('lastName', response.lastName);
        localStorage.setItem('profileImage', response.profileImage);
        localStorage.setItem('isAuthenticated', true);

        var responseRoleData = this.getRoleData(response.roleId);
        responseRoleData.done((response) => {
            if (response.length > 0) {
                localStorage.setItem('roleName', response[0].roleName);
            }
        })
        
        this.setState({
            RedirectLoginDetails: true,
        })
    }

    resetLoginForm = (event) => {
        window.location.reload();
    }


    onPressEnterLogin = (event) => {
        document.querySelector('#loginbutton').addEventListener("keyPress", this.checkCredential)
        if (event.keyCode === '13') {
            alert(1)

        }
    }
    render() {

        if (this.state.RedirectLoginDetails) {
            window.location.href = '/dashboard'
        } else {
            return (
                <div>
                    <form className="form-signin p-3 shadow" id="loginForm">
                        <h2 className="form-signin-heading text-center">
                            <img src={logo} alt="Prakash" className="img-fluid" />
                        </h2>
                        <div className="form-group">
                            <label className="sr-only">Email address</label>
                            <input type="email" id="inputEmail" name="emailRequired" className="form-control" placeholder="Email address"
                                onChange={this.emailAddressOnChange}
                                value={this.state.emailAddress} />
                        </div>
                        <div className="form-group">
                            <label className="sr-only">Password</label>
                            <input type="password" id="inputPassword" name="passwordRequired" className="form-control" placeholder="Password"
                                onChange={this.passwordOnChange}
                                value={this.state.password} />
                        </div>
                        <p className="errorIfInvalIdInput" style={{ "display": "none", "color": "red" }}>{Notification.loginError}</p>
                        <div className="form-group">
                            <div className="checkbox">
                                <label style={{ float: "right" }}>
                                    {/* <input type="checkbox" value="remember-me" name="rememberme" /> Remember me */}
                                </label>
                            </div>
                        </div>
                        <div className="form-group">
                            <a className="btn btn-lg btn-success" type="button" id="loginbutton" onClick={this.checkCredential}>Login</a>&nbsp;
                        <a className="btn btn-lg btn-danger" type="button" onClick={this.resetLoginForm}>Reset</a><br />
                        </div>
                        <div className="divider">
                            <Link to="/forgotPassword">Forgot Password</Link>
                        </div>
                        
                    </form>
                </div>
            )
        }

    }
}
export default loginPage;