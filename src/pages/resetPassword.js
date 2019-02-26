import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
import { Redirect, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification } from './Environment';

class ResetPW extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resetPassword: "",
      reEnterPassword: "",
      getResetToken: '',
    }
  }
  // url.searchParams.get("c");
  // getTokenFromURL=$(location).attr('search');

  UpdatePassword() {
    debugger;
    var UpdatePasswordAPI = environment.dynamicUrl + 'dynamic';
    var resetPassword = {
      query: `UPDATE user_master SET password = '${this.state.resetPassword}', resetToken = NULL WHERE resetToken = '${this.state.getResetToken}'`
    }
    return $.ajax({
      url: UpdatePasswordAPI,
      type: Type.post,
      data: JSON.stringify(resetPassword),
      headers: {
        "Content-Type": "application/json",
      }
    });
  }
  // UPDATE user_master SET password = '11111', resetToken = NULL WHERE resetToken = ''

  //function to get token from the URL
  getUrlParameter = (sParam) => {
    var sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;
    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  };

  //password validation
  resetPasswordvalidate = () => {
    debugger;
    var isvalidate = window.formValidation("#RPWform")
    if (isvalidate) {
      var res = this.UpdatePassword()
      res.done((result) => {
        toast.success(" " + Notification.ChangePassword, {
          position: toast.POSITION.TOP_RIGHT
        });
      });
      res.fail((error) => {

      })
    }else{
      $(".matchPassword").hide();
    }
  }

  //reset form
  clearResetform() {
    window.location.reload();
  }


  render() {
    return (
      <div>
        <form className="form-signin p-3 shadow" id="RPWform">
          <h2 className="form-signin-heading text-center">
            <img src={logo} alt="Prakash" className="img-fluid" />
          </h2>
          <div className="form-group">
            <label className="sr-only">New Password</label>
            <input type="password" id="ResetNewPW" name="ResetNewPWRequired" className="form-control" placeholder="Type New PassWord"
              onChange={
                (event) => {

                  this.setState(
                    {
                      getResetToken: this.getUrlParameter('token'),
                      resetPassword: event.target.value
                    }
                  )
                }}
              value={this.state.resetPassword} />
          </div>
          <div className="form-group">
            <label className="sr-only">Confirm Password</label>
            <input type="password" id="ConfirmNewPW" name="ConfirmNewPWRequired" className="form-control" placeholder="Retype New PassWord"
              onChange={
                (event) => {

                  this.setState(
                    {
                      reEnterPassword: event.target.value
                    }
                  )
                }}
              value={this.state.reEnterPassword} />
          </div><p className="matchPassword" style={{ "display": "none", "color": "red" }}>Password Does Not Match</p>
          <div className="form-group">
            <a className="btn btn-lg btn-success" type="button" id="loginbutton" onClick={this.resetPasswordvalidate} >Update</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.clearResetform}>Reset</a><br />
          </div>
          <div className="divider">
            <Link to="/">Login Page</Link>
          </div>

        </form>
        <ToastContainer />
      </div>
    )
  }
}
export default ResetPW;