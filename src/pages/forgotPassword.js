import React,{Component} from 'react';
import logo from '../common/img/logo-100.png';
import { Redirect,Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification } from './Environment';

class ForgotPW extends Component{
    constructor(props){
        super(props);
        this.state={
            emailForFPW:"",
            // emailSent:"",
            Success:false,
            resetToken:"",
        }
    }

    forgotPWEmailSendAPI=()=>{
        // var emailid=localStorage.setItem('emailForFPW');
        var body=
            {
                emailSubject:"Reset Password",
                emailBody:`<html>
                <body>
                <p>Click the Below Link to Reset Your PassWord</p>
                <a href="http://localhost:3000/resetPassword?emailid=${this.state.emailForFPW}"><i>Reset Password</i></a>
                </body>
                </html>`,
                toemailadress:"psspl.trainee32@outlook.com"
            }
           

        const azureURL = "https://prod-17.centralindia.logic.azure.com:443/workflows/ecb28aa6326c46d2b632dbe5a34f76af/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qK3dMqlg6f1nEjlqWvG-KtxyVrAXqb3Zn1Oy5pJJrXs";
        return $.ajax({
            url: azureURL,
            type: Type.post,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    emailForFPWonChange = (event) => {
        this.setState({
            emailForFPW: event.target.value
        })
        // localStorage.setItem('emailForFPW',`${event.target.value}`);
    }

    ClickToSendEmailForFPW=()=>{
        var isvalidate=window.formValidation("#FPWform")

        if (isvalidate) {
            var res = this.forgotPWEmailSendAPI();

            res.done((data) => {debugger;
                if (data.Success=== true) {
                    toast.success(" " + Notification.EmailSent, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    
                }
                else {

                 //any validation to hide or show

                }
            })
            res.fail((error) => {

            })
        } else {
            return false;
        }
    }

    //reset form
    resetFPWForm = (event) => {
        window.location.reload();
    }

    // ResetToken=(length)=>{
    //     console.log(length)
    //         var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    //         var b = [];  
    //         for (var i=0; i<this.resetToken.length; i++) {
    //             var j = (Math.random() * (a.length-1)).toFixed(0);
    //             b[i] = a[j];
    //         }
    //         return b.join("");
        
    // }

    // generateResetToken=()=>{
    //     console.log()
    //     var res =this.ResetToken();
    //     res.length(36);
     
    // }
   


render(){
    return(
        <div>
            <form className="form-signin p-3 shadow" id="FPWform">
                    <h2 className="form-signin-heading text-center">
                        <img src={logo} alt="Prakash" className="img-fluid" />
                    </h2>
                    <div className="form-group">
                        <label className="sr-only">Email address</label>
                        <input type="email" id="inputEmail" name="FPWemailRequired" className="form-control" placeholder="Email address"
                          onChange={this.emailForFPWonChange}
                            value={this.state.emailForFPW} required/>
                    </div>
                    <div className="form-group">
                    <a className="btn btn-lg btn-success" type="button" id= "loginbutton" onClick={this.ClickToSendEmailForFPW} >Submit</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={this.resetFPWForm}>Reset</a><br/>
                    </div>
                    <div className="divider">
                     <Link to="/">Go back</Link>
                    </div>
                   
                </form>
                <ToastContainer/>
        </div>
    )
}
}
export default ForgotPW;