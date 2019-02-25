import React,{Component} from 'react';
import logo from '../common/img/logo-100.png';
import { Redirect,Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification } from './Environment';

class ResetPW extends Component{
    constructor(props){
        debugger;
        super(props);
        this.state={
        resetPassword:""
        }
    }
UpdatePassword(){
    var UpdatePasswordAPI = environment.dynamicUrl + 'dynamic2';
    // const endpoint = "http://180.211.103.189:3000/dynamic";

    return $.ajax({
      url: UpdatePasswordAPI,
      type: Type.post,
      data: {
        query:"UPDATE user_master u SET u.PASSWORD = 'NEW' WHERE emailAddress='psspl.trainee32@outlook.com'"
      }
    });
}
resetPasswordvalidate=()=>{
  var res= this.UpdatePassword();

}

render(){
    debugger;
    return(
        <div>
            <form className="form-signin p-3 shadow" id="RPWform">
                    <h2 className="form-signin-heading text-center">
                        <img src={logo} alt="Prakash" className="img-fluid" />
                    </h2>
                    <div className="form-group">
                        <label className="sr-only">New Password</label>
                        <input type="password" id="ResetNewPW" name="ResetNewPWRequired" className="form-control" placeholder="Type New PassWord"
                          onChange={this.emailForFPWonChange}
                            value={this.state.emailForFPW} required/>
                    </div>
                    <div className="form-group">
                        <label className="sr-only">Confirm Password</label>
                        <input type="password" id="ConfirmNewPW" name="ConfirmNewPWRequired" className="form-control" placeholder="Retype New PassWord"
                          onChange={this.emailForFPWonChange}
                            value={this.state.emailForFPW} required/>
                    </div>
                    <div className="form-group">
                    <a className="btn btn-lg btn-success" type="button" id= "loginbutton" onClick={""} >Update</a>&nbsp;
                    <a className="btn btn-lg btn-danger" type="button" onClick={""}>Reset</a><br/>
                    </div>
                    <div className="divider">
                     <Link to="/">Login Page</Link>
                    </div>
                   
                </form>
                <ToastContainer/>
        </div>
    )
}
}
export default ResetPW;