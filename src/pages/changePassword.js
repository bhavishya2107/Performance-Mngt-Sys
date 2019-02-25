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
        }
    }
    updatePassword = () => {
        alert(2)
        debugger;
var q =  `"update user_master  set password =  '${this.state.password}'  where emailaddress = '${localStorage.getItem('emailAddress')}'"`
alert(q)
        var updatePasswordAPI = environment.dynamicUrl + 'dynamic';
        return $.ajax({
            url: updatePasswordAPI,
            type: Type.post,
            data: {
                query: `"update user_master  set password =  '${this.state.password}'  where emailaddress = '${localStorage.getItem('emailAddress')}'"`
            },
        });
    }
  
    // ClickToSendEmailForCPW = () => {
    //         // var res = this.updatePassword();
    //         // $(".hide").show()
    //         // $.validator.addMethod('passwordMatch', function (value, element) {
    //         //     var password = $("#ChangePW").val();
    //         //     var confirmPassword = $("#ConfirmPW").val();
    //         //     if (password === confirmPassword) {
    //         //         return this.updatePassword();
    //         //     }
    //         //     // else if (password === confirmPassword){
    //         //     //     return $(".hide").show()
    //         //     // }
    //         //     else {
    //         //         return false;
    //         //     }
    //         // }, "Please must match with above New Password");
        
  
    //     }
    
    matchCurrentPasswordAPI = () => {
        alert(1)

        var url = environment.apiUrl + moduleUrls.User + '/' + `${localStorage.getItem('userId')}`
        return $.ajax({
            url: url,
            type: Type.get,
            success: function (resultData) {
                console.log(resultData)
            }

        })



    }
    userCurrentpwCheck = () => {
        var isvalidate = window.formValidation("#CPWform")
        if (isvalidate) {
        var res = this.matchCurrentPasswordAPI()
        var updatepw=this.updatePassword()
        res.done((result) => {
          
            if (result[0].password === this.state.currentPassword) {
                return true
            }
            else if (result[0].password != this.state.currentPassword) {
                return ($(".matchPW").show())
            }
            else if(this.state.password===this.state.retypePassword){
                return updatepw
            }
        
            else {
                return false
            }

        });
        res.fail((error) => {

        })
    }
}


    updatedPassword = (event) => {

        this.setState({
            password: event.target.value
        })

    }
    confirmUpdatedPassword = (event) => {

        this.setState({
            retypePassword: event.target.value
        })

    }
    resetCPWform() {
        window.location.reload();
    }

    render() {
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
                            value={this.state.currentPassword} required /><br />
                        <p className="matchPW" style={{ "display": "none", "color": "red" }}>cannot enter same password</p>
                        <p className="requiredField" style={{ "display": "none", "color": "red" }}>Field Required</p>

                        <label className="sr-only">Enter Your New Password</label>
                        <input type="password" id="ChangePW" name="ChangePWemail" className="form-control" placeholder="Enter Your New Password"
                            onChange={this.updatedPassword}
                            value={this.state.password} required /><br/>

                        <label className="sr-only">Password Does Not Match</label>
                        <input type="password" id="ConfirmPW" name="ConfirmPWemail" className="form-control" placeholder="Confirm New Password"
                            onChange={this.confirmUpdatedPassword}
                            value={this.state.retypePassword} required/>

                    </div>
                    <div className="form-group">
                        <a className="btn btn-lg btn-success" type="button" id="submitbutton" onClick={this.updatePassword} >Submit</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.resetCPWform}>Reset</a><br />
                    </div>
                    <div className="divider">
                        <Link to="/">Login Page</Link>
                    </div>

                </form>
            </div>
        )
    }
}
export default ChangePW;