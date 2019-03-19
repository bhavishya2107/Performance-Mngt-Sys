import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class ADDQuater extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirect: false,
            quaterName: "",
            description:"",
            id: props.match.params.id,

        };
    }

    isExistRoleonChange() {

        var isvalidate = window.formValidation("#userRoleForm");
        if (isvalidate) {
            var res = this.RoleAlreadyExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".hideQuater").show()
                } else {
                    var _this = this;
                    var roleFormData =
                    {
                        "quaterName": this.state.quaterName,
                    }
                }
            });
            res.fail(error => {

            });

        }
    }

    submitDataFromRoleform() {

        var isvalidate = window.formValidation("#userRoleForm");
        if (isvalidate) {
            var res = this.RoleAlreadyExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".hideQuater").show()
                } else {
                    var _this = this;
                    var roleFormData =
                    {
                        "quaterName": this.state.quaterName.trim(),
                        "description": this.state.description.trim(),
                        "createdBy": localStorage.getItem('userId')

                    }
                    const endpointPOST = environment.apiUrl + moduleUrls.Quater + '/'
                    $.ajax({
                        url: endpointPOST,
                        type: Type.post,
                        data: roleFormData,
                        success: function (resultData) {

                            _this.setState({ Redirect: true });
                            toast.success("Quarter " + Notification.saved, {
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
        const roleAlreadyExist = environment.apiUrl + moduleUrls.Quater + '?_where=(quaterName,eq,' + this.state.quaterName.trim() + ')';
        return $.ajax({
            url: roleAlreadyExist,
            type: Type.get,
            data: ''
        });
    }


    getRoleDetailsApi() {
        const getRoleDetails = environment.apiUrl + moduleUrls.Quater + '/' + `${this.state.id}`
        // const endpoint = `http://180.211.103.189:3000/api/role_master/${this.state.id}`;
        return $.ajax({
            url: getRoleDetails,
            type: Type.get,

        })
    }
    updateRoleDetailsApi(data) {
        const updateRoleDetails = environment.apiUrl + moduleUrls.Quater + '/' + `${data.id}`
        // '/?_size=1000' + '&_sort=-kraId' 

        var body =
        {
            "quaterName": data.quaterName.trim(),
            "description": data.description.trim(),
            "modifiedBy": localStorage.getItem('userId'),
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
        const updateroleExist = environment.apiUrl + moduleUrls.Quater + '?_where=(quaterName,eq,' + this.state.quaterName.trim() + ')' + '~and(quaterId,ne,' + this.state.id + ')';
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
            res.done((response) => {
                if (response.length > 0) {
                    $(".hideQuater").show()

                } else {
                    var res = this.updateRoleDetailsApi(data);
                    res.done((result) => {
                        this.setState({
                            Redirect: true
                        })
                        toast.success("Quarter " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });

                    });
                    res.fail((error) => { })


                }
            });
            res.fail((error) => {

            })

        } else {
            $(".hideQuater").hide()
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
                    quaterName: response[0].quaterName,
                    description: response[0].description,
                })
            });
            res.fail((error) => {

            })
        } else {

        }
    }


    render() {
        if (this.state.Redirect) {
            return <Redirect to={{ pathname: "/quater", state: "2222" }} />
        }
        return (
            <div className="container-fluid">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.id !== undefined ? <span>Edit {ModuleNames.quater}</span> : <span>Add New {ModuleNames.quater}</span>}
                    </h2>
                </div>
                <form id="userRoleForm" >
                    <div className="form-group">
                        <label htmlFor="quaterName" className="required">Name</label>
                        <div className="">
                            <input id="quaterName" type="text" className="form-control col-6" name="quaterName" onBlur={() => { this.isExistRoleonChange() }} maxLength="15"
                                value={this.state.quaterName}
                                onChange={(event) => {
                                    $(".hideQuater").hide()
                                    this.setState(
                                        {
                                            quaterName: event.target.value
                                        }
                                    )
                                }} required />
                            <p className="hideQuater" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</p>
                        </div>
                        <div className="form-group">
                            <label>Description</label> <textarea id="quaterDescription" className="form-control col-6" name="description" rows="4" value={this.state.description}
                                onChange={(event) => {
                                    this.setState({
                                        description: event.target.value
                                    })
                                }} ></textarea>
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
                    <Link to="/quater" className="btn btn-danger">Cancel</Link>
                    <br />
                </form>
                <ToastContainer />
            </div>
        )
    }
}
export default ADDQuater;