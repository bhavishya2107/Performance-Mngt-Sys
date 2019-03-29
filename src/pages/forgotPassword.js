import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
import { Redirect, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification } from './Environment';

class ForgotPW extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailForFPW: "",
            Success: false,
            resetToken: "",
        }
    }

    forgotPWEmailSendAPI = () => {
        // var emailid=localStorage.setItem('emailForFPW');
        var body =
        {
            emailSubject: "Reset Password",
            emailBody: `<html>
                <body>
                <p>Click the Below Link to Reset Your Password</p>
                <a href="http://localhost:3000/resetPassword?token=${this.state.resetToken}"><i>Reset Password</i></a>
                </body>
                </html>`,
            toemailadress: `${this.state.emailForFPW}`
        }


        const azureURL = environment.emailToSend;
        return $.ajax({
            url: azureURL,
            type: Type.post,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }


    addTokenToAPI = () => {
        var tokenTopass = {
            query: `update user_master  set resetToken =  '${this.state.resetToken}'  where emailaddress = '${this.state.emailForFPW}'`
        }
        var addTokenAPI = environment.dynamicUrl + 'dynamic';
        return $.ajax({
            url: addTokenAPI,
            type: Type.post,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(tokenTopass),

        });
    }


    isEmailIDexist = () => {

        const emailAlreadyExist = environment.apiUrl + moduleUrls.User + '?_where=(emailAddress,eq,' + this.state.emailForFPW + ')';
        return $.ajax({
            url: emailAlreadyExist,
            type: Type.get,
            data: '',
            success: function (resultData) {
           
            }
        });

    }




    //generating token function
    generate_token = (length) => {

        var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
        var b = [];
        for (var i = 0; i < length; i++) {
            var j = (Math.random() * (a.length - 1)).toFixed(0);
            b[i] = a[j];
        }
        return b.join("");
    }



    emailForFPWonChange = (event) => {
        $(".existEmailinAPI").hide();
        this.setState({
            emailForFPW: event.target.value,
            resetToken: this.generate_token(36)
        })
      
    }

    ClickToSendEmailForFPW = () => {
        var isvalidate = window.formValidation("#FPWform")
        if (isvalidate) {
            var result = this.isEmailIDexist();
            result.done((response) => {

                if (response.length > 0) {
                    var addToken = this.addTokenToAPI();
                    addToken.done((tokenResponse) => {
                        console.log("added token to api")

                    });
                    addToken.fail((error) => {
                        console.log("not added")

                    });

                    var res = this.forgotPWEmailSendAPI();

                    res.done((data) => {
                        if (data.Success === true) {
                            toast.success(" " + Notification.EmailSent, {
                                position: toast.POSITION.TOP_RIGHT
                            });

                        }
                        else {


                        }
                    })
                    res.fail((error) => {

                    })
                } else if (response.length === 0) {

                    $(".existEmailinAPI").show();
                }

            })
        }

    }


    //reset form
    resetFPWForm = (event) => {
        window.location.reload();
    }

    render() {
        return (
            <div>
                <form className="form-signin p-3 shadow" id="FPWform">
                    <h2 className="form-signin-heading text-center">
                        <img src={logo} alt="Prakash" className="img-fluid" />
                    </h2>
                    <div className="form-group">
                        <label className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" name="FPWemailRequired" className="form-control" placeholder="Email address"
                            onChange={this.emailForFPWonChange}
                            value={this.state.emailForFPW} required />
                    </div>  <p className="existEmailinAPI" style={{ "display": "none", "color": "red" }}>{Notification.emailExist}</p>
                    <div className="form-group">
                        <a className="btn btn-lg btn-success" type="button" id="loginbutton" onClick={this.ClickToSendEmailForFPW} >Submit</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.resetFPWForm}>Reset</a><br />
                    </div>
                    <div className="divider">
                        <Link to="/">Go back</Link>
                    </div>

                </form>
                <ToastContainer />
            </div>
        )
    }
}
export default ForgotPW;