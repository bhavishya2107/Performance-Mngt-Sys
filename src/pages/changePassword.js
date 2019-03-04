import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
import { environment, moduleUrls, Type, Notification } from './Environment';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect, Link } from 'react-router-dom';
import $ from 'jquery';

class ChangePW extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPassword: "",
            password: "",
            retypePassword: "",
            redirectTologin:false,
        }
    }

    //update password api call
    updatePassword = () => {
        var updatePasswordAPI = environment.dynamicUrl + 'dynamic';
        var changePWquery = {
            query: `update user_master  set password =  '${this.state.password}'  where emailAddress = '${localStorage.getItem('emailAddress')}'`
        }
        return $.ajax({
            url: updatePasswordAPI,
            type: Type.post,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(changePWquery),

        });
    }

    //match current password and password in API
    matchCurrentPasswordAPI = () => {
        var url = environment.apiUrl + moduleUrls.User + '/' + `${localStorage.getItem('userId')}`
        return $.ajax({
            url: url,
            type: Type.get,
            success: function (resultData) {
              
            }
        })
    }
    
    //main function and validate function
    userCurrentpwCheck = () => {
        debugger;
        var isvalidate = window.formValidation("#CPWform")
        if (isvalidate) {
            var res = this.matchCurrentPasswordAPI()
            var _this=this;
            res.done((result) => {

                if (result[0].password === this.state.currentPassword) {
                    
                    if (this.state.password === this.state.retypePassword) {

                        var changePassword= this.updatePassword();
                   
                
                        changePassword.done((response)=>{
                            toast.success(" " + Notification.ChangePassword, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        
                      
                        });
                        _this.setState({
                            redirectTologin:true
                        })

                        changePassword.fail((error)=>{
                       
    
                        })
                    }
    
                    else {
                        return $(".matchPassword").show();
                    }
                }
                else if (result[0].password != this.state.currentPassword) {
                    return ($(".matchPW").show())
                }
               

            });
            res.fail((error) => {

            })
        }
    }

    updatedPassword = (event) => {
        $(".matchPassword").hide();
        this.setState({
         
            password: event.target.value
        })
    }
    confirmUpdatedPassword = (event) => {
        $(".matchPassword").hide();
        this.setState({
            retypePassword: event.target.value
        })
    }

    //reset form
    resetCPWform() {
        window.location.reload();
    }

    render() {
        if (this.state.redirectTologin) {
        
            window.location.href = '/myProfile'
        }
        else
        {
        return (
            <div>
                <form className="form-signin p-3 shadow" id="CPWform">
                    <h2 className="form-signin-heading text-center">
                        <img src={logo} alt="Prakash" className="img-fluid" />
                    </h2>
                    <div className="form-group">

                        <label className="sr-only">Enter Current Password</label>
                        <input type="password" id="CurrentPW" name="CurrentPWemail" className="form-control" placeholder="Enter Your Current Password"
                            onChange={
                                (event) => {
                                    $(".matchPW").hide()
                                    this.setState(
                                        { currentPassword: event.target.value }
                                    )
                                }}
                            value={this.state.currentPassword} required />

                    </div>
                    <p className="matchPW" style={{ "display": "none", "color": "red" }}>password does not match current password</p>

                    <div className="form-group">

                        <label className="sr-only">Enter Your New Password</label>
                        <input type="password" id="ChangePW" name="ChangePWemail" className="form-control" placeholder="Enter Your New Password"
                            onChange={this.updatedPassword}
                            value={this.state.password} required />
                    </div>

                    <div className="form-group">

                        <label className="sr-only">Password Does Not Match</label>
                        <input type="password" id="ConfirmPW" name="ConfirmPWemail" className="form-control" placeholder="Confirm New Password"
                            onChange={this.confirmUpdatedPassword}
                            value={this.state.retypePassword} required />

                    </div><p className="matchPassword" style={{ "display": "none", "color": "red" }}>Password must match in above two fields</p>

                    <div className="form-group">
                        <a className="btn btn-lg btn-success" type="button" id="submitbutton" onClick={this.userCurrentpwCheck} >Submit</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.resetCPWform}>Reset</a><br />
                    </div>
                    <div className="divider">
                    {/* <Link to={window.location.href="/myProfile"}>Back</Link> */}
                    </div>

                </form>
                <ToastContainer />
            </div>
        )
                            }
    }
}
export default ChangePW;