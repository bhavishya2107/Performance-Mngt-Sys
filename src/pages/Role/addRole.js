import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
const $ = require('jquery');

class UserRoleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirect: false,
            roleName: "",
            description:"",
            id: props.match.params.id,

        };
    }

    isExistRoleonChange() {
        if (this.state.id != undefined) {
            var res = this.updateroleEditExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            }
            )
        }
        else {
            var res = this.RoleAlreadyExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                }
            })
        }
    }

    submitDataFromRoleform() {

        var isvalidate = window.formValidation("#userRoleForm");
        if (isvalidate) {
            var res = this.RoleAlreadyExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".hiderole").show()
                } else {
                    var _this = this;
                    var roleFormData =
                    {
                        "roleName": this.state.roleName.trim(),
                        "description":this.state.description,
                        "createdBy":localStorage.getItem('userId')

                    }
                    const endpointPOST = environment.apiUrl + moduleUrls.Role + '/'
                    $.ajax({
                        url: endpointPOST,
                        type: Type.post,
                        data: roleFormData,
                        success: function (resultData) {

                            _this.setState({ Redirect: true });
                            toast.success("Role " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            });
            res.fail(error => {

            });

        } else {

            return false;
        }


    }

    RoleAlreadyExistApi() {
        // http://192.168.10.109:3000/api/modulename?_where=(fieldname,eq,searchtext)
        const roleAlreadyExist = environment.apiUrl + moduleUrls.Role + '?_where=(roleName,eq,' + this.state.roleName.trim() + ')';
        return $.ajax({
            url: roleAlreadyExist,
            type: Type.get,
            data: ''
        });
    }


    getRoleDetailsApi() {
        const getRoleDetails = environment.apiUrl + moduleUrls.Role + '/' + `${this.state.id}`
        // const endpoint = `http://180.211.103.189:3000/api/role_master/${this.state.id}`;
        return $.ajax({
            url: getRoleDetails,
            type: Type.get,

        })
    }

    updateRoleDetailsApi(data) {
        const updateRoleDetails = environment.apiUrl + moduleUrls.Role + '/' + `${data.id}`
   

        var body =
        {
            "roleName": data.roleName.trim(),
            "description":data.description,
            "modifiedBy":localStorage.getItem('userId')
        }
        return $.ajax({
            // url: `http://180.211.103.189:3000/api/role_master/${data.id}`,
            url: updateRoleDetails,
            type: Type.patch,
            headers: {
                "Content-Type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }

    updateroleEditExistApi() {
        const updateroleExist = environment.apiUrl + moduleUrls.Role + '?_where=(roleName,eq,' + this.state.roleName.trim() + ')' + '~and(roleId,ne,' + this.state.id + ')';
        return $.ajax({
            url: updateroleExist,
            type: Type.get,
            data: ''
        })
    }
    UpdateRoleDetails(data) {

        var isvalidate = window.formValidation("#userRoleForm");
        if (isvalidate) {
            var res = this.updateroleEditExistApi();
            debugger;
            res.done((response) => {
                if (response.length > 0) {
                    $(".hiderole").show()

                } else {
                    var res = this.updateRoleDetailsApi(data);
                    res.done((result) => {
                        this.setState({
                            Redirect: true
                        })
                        toast.success("Role " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });

                    });
                    res.fail((error) => { })


                }
            });
            res.fail((error) => {

            })

        } else {
            $(".hiderole").hide()
            return false;
        }

    }


    myFunction() {
        window.location.reload();
    }




    componentDidMount() {
        if (this.state.id !== undefined) {
            var res = this.getRoleDetailsApi();
            res.done((response) => {

                this.setState({
                    roleName: response[0].roleName, 
                    description: response[0].description
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
                    <h2 className="col">
                        {this.state.id !== undefined ? <span>Edit {ModuleNames.Role}</span> : <span>Add New {ModuleNames.Role}</span>}
                    </h2>
                </div>
                <form id="userRoleForm" >
                    <div className="form-group">
                        <label htmlFor="roleName" className="required">Name</label>
                        <div className="">
                            <input id="roleName" type="text" className="form-control col-6" name="rolename" onBlur={() => { this.isExistRoleonChange() }} maxLength="15"
                                value={this.state.roleName}
                                onChange={(event) => {
                                    $(".hiderole").hide()
                                    this.setState(
                                        {
                                            roleName: event.target.value
                                        }
                                    )
                                }} required />
                            <p className="hiderole" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</p>
                        </div>
                    </div>
                    <div className="form-group">
                        <label className=" " htmlFor="roleDescription">Description</label>
                        <div className="">
                            <textarea name="roleDescription" className="form-control col-6" rows="3"
                                value={this.state.description}
                                onChange={(event) => {
                                    this.setState(
                                        {
                                            description: event.target.value
                                        }
                                    )
                                }}></textarea><br />
                        </div>
                    </div>
                    {this.state.id !== undefined ?
                        <button className="btn btn-success " type="button" onClick={() => {
                            this.UpdateRoleDetails(this.state);
                        }}>Update</button>
                        : <button className="btn btn-success " type="button" onClick={() => {
                            this.submitDataFromRoleform(this.state);
                        }}>Save</button>}&nbsp;
                    <button type="button" className="btn btn-info" onClick={() => { this.myFunction() }}>Reset</button>&nbsp;
                    <Link to="/role" className="btn btn-danger">Cancel</Link>
                    <br />
                </form>
                <ToastContainer />
            </div>
        )
    }
}
export default UserRoleForm;