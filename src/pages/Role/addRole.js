import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {environment} from '../Environment';
const $ = require('jquery');



class UserRoleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirect: false,
            roleName: "",
            id: props.match.params.id,

        };
    }

    submitDataFromRoleform() {
        
        var res = window.formValidation("#userRoleForm");
        if (res) {    
    
        } else  {
          
            return false;
        }
        var _this = this;

        var roleFormData =
        {
            "roleName": this.state.roleName,
        };
   
        const endpoint = environment.apiUrl + 'role_master/'

        $.ajax({
            // url: "http://180.211.103.189:3000/api/role_master",
            url: endpoint,
            type: "POST",
            data: roleFormData,
            success: function (resultData) {

                _this.setState({ Redirect: true });
                toast.success("Saved Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                })
            },

        });
            
    }
    getRoleDetailsApi() {
        const endpoint = environment.apiUrl + 'role_master/' + `${this.state.id}`
        // const endpoint = `http://180.211.103.189:3000/api/role_master/${this.state.id}`;
        return $.ajax({
            url: endpoint,
            type: "GET",

        })
    }
    updateRoleDetailsApi(data) {
        const endpoint = environment.apiUrl + 'role_master/' + `${data.id}`

        var body =
        {
            "roleName": data.roleName,
        }
        return $.ajax({
            // url: `http://180.211.103.189:3000/api/role_master/${data.id}`,
            url:endpoint,
            type: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateRoleDetails(data) {

        var res = this.updateRoleDetailsApi(data);
        res.done((response) => {
        this.setState({
                Redirect: true

            })
            toast.success("Role Updated Successfully!", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {

        })
        var result = window.formValidation("#userRoleForm");
        if (result) {
            // alert("Success")
        } else  {  
          
            return false;
        }

    }

    userFormdetailsClear(){
        this.setState({
            roleName: "",
        });
    }
    componentDidMount() {
        debugger;

        if (this.state.id !== undefined) {
            var res = this.getRoleDetailsApi();
            res.done((response) => {

                this.setState({
                    roleName: response[0].roleName,
                })
            });
            res.fail((error) => {

            })
        } else {

        }
    }


    render() {
        if (this.state.Redirect) {
            return <Redirect to={{ pathname: "/role", state: "2222" }} />
        }
        return (
            <div className="container-fluid">
              <div className="clearfix d-flex align-items-center row page-title">
                <h2 className="col"> Role >
                {this.state.id !== undefined ? <span>Edit</span> : <span>Add</span>}
                </h2>
            </div>
         
                <form id="userRoleForm" >
                        <div className="form-group">
                            <label htmlFor="roleName" className="required">Name</label>
                            <div className="">
                                <input id="roleName" type="text" className="form-control col-6" name="rolename" 
                                    value={this.state.roleName}
                                    onChange={(event) => {
                                        this.setState(
                                            {
                                                roleName: event.target.value
                                            }
                                        )
                                    }} required/>
                            </div>
                        </div>
                        {this.state.id !== undefined ?
                            <button className="btn btn-success " type="button" onClick={() => {
                                this.UpdateRoleDetails(this.state);
                            }}>Update</button>
                            : <button className="btn btn-success " type="button" onClick={() => {
                                this.submitDataFromRoleform(this.state);
                            }}>Save</button>}&nbsp;
                    <button type="clear" className="btn btn-info"  onClick={()=>{this.userFormdetailsClear()}}>Clear</button>&nbsp;
                    <Link to="/role" className="btn btn-danger">Cancel</Link>
                        <br/>
                           </form>

            </div>
        )
    }
}
export default UserRoleForm;