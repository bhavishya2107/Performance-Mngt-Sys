import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
const $ = require('jquery');



class UserRoleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitDataFromRoleForm: "",
            Redirect: false,
            roleName:"",
            roleFormData:"",

        };
    }

    submitDataFromKra() {
        debugger;
        var _this = this;

        var roleFormData =
        {
            "roleName": this.state.roleName,
            // "createdBy": "",
            // "createdOn": "",
            // "modifiedBy": "",
            // "modifiedOn": ""
        };



        $.ajax({
            url: "http://192.168.10.109:3000/api/role_master",
            type: "POST",
           
            data: roleFormData,
            // dataType: "text",
            success: function (resultData) {
               
                _this.setState({ Redirect: true });
            },
       
        });

    }

    render() {
        if (this.state.Redirect) {
            return <Redirect to={{ pathname: "/userRolePMS", state: "2222" }} />
        }
        return (
            <div>
                <form action="" style={{ textAlign: "center", paddingTop: "100px" }}>
                    <label for="roleName">Name</label>
                    <input id="roleName" type="text" width="250px" className="form"
                        value={this.state.roleName}
                        onChange={(event) => {
                            this.setState(
                                {
                                    roleName: event.target.value
                                }
                            )
                        }} /><br />
                   
                    <button type="button" className="btn btn-success btn-sm" onClick={() =>  this.submitDataFromKra() }>Save</button>&nbsp;
                <button className="btn btn-success btn-sm">Clear</button>

                </form>

            </div>
        )
    }
}
export default UserRoleForm;