import React, { Component } from 'react';
import logo from '../common/img/logo-100.png';
import { environment, moduleUrls, Type, Notification } from './Environment'
import { Redirect,Link } from 'react-router-dom';
import $ from 'jquery';

class loginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            emailAddress: "",
            password: "",
            firtName:"",
            lastName:"",
            userName:"",
            userId:'',
            profileImage:"",
            RedirectLoginDetails:false,
           
        };
    }
    loginCheckIsValid() {

        // console.log(this.state.emailAddress);
        const credentialValid = environment.apiUrl + moduleUrls.User + '?_where=(emailAddress,eq,' + `${this.state.emailAddress}` + ')' + '~and(password,eq,' + `${this.state.password}` + ')';
        return $.ajax({
            url: credentialValid,
            type: Type.get,
            data: ''
        });
    }
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

        var isvalidate=window.formValidation("#loginForm")
      
     if(isvalidate){
            var res = this.loginCheckIsValid();

            res.done((response)=>{
                if(response.length > 0){
                this.setState({
                    userName: response[0].userName,
                    firstName: response[0].firstName,
                    lastName: response[0].lastName,
                    emailAddress: response[0].emailaddress,
                    userId:response[0].userId,
                    profileImage:response[0].profileImage,
                    RedirectLoginDetails:true,
                })
                this.fetchingValueInLocalStorage(response[0]);
            }
                   else {

                        $(".errorIfInvalIdInput").show();
                    
                    }
            })
            res.fail((error)=>{

            })
    }else{
        return false;
    }

}

    fetchingValueInLocalStorage(response) {
    
        localStorage.setItem('emailAddress',response.emailAddress);
        localStorage.setItem('userId',response.userId);
        localStorage.setItem('userName',response.userName);
        localStorage.setItem('firstName',response.firstName);
        localStorage.setItem('lastName',response.lastName);
        localStorage.setItem('profileImage',response.profileImage);
    }
    resetLoginForm=(event)=> {
        window.location.reload();
    }

   
    onPressEnterLogin = (event) => {
        document.querySelector('#loginbutton').addEventListener("keyPress",this.checkCredential)
        if(event.keyCode === '13'){
        alert(1)
      
        }
    }   
   
  



    render() {
        if (this.state.RedirectLoginDetails) {
            return <Redirect to={{ pathname: "/dashboard"}} />
           
        }
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
                            value={this.state.emailAddress} required/>
                    </div>
                    <div className="form-group">
                        <label className="sr-only">Password</label>
                        <input type="password" id="inputPassword" name="passwordRequired" className="form-control" placeholder="Password" 
                            onChange={this.passwordOnChange}
                            value={this.state.password} required/>
                    </div><br/>
                    <p className="errorIfInvalIdInput" style={{ "display": "none", "color": "red" }}>{Notification.loginError}</p>
                    <div className="form-group">
                        <div className="checkbox">
                            <label style={{float:"right"}}>
                                <input type="checkbox" value="remember-me"  /> Remember me
                        </label>
                        </div>
                    </div>
                    <div className="form-group">
                    <a href="/dashboard" className="btn btn-lg btn-success" type="button" id= "loginbutton" onClick={this.checkCredential}>Login</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.resetLoginForm}>Reset</a><br/>
                    </div>
                    <div className="divider">
                    <Link to="">Forgot Password</Link>
                    </div>
                   
                </form>
            </div>
        )
    }
}
export default loginPage;