import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { environment, moduleUrls, Type, Notification } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');

class AddProjectComplexity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTypeId: props.match.params.id,
            projectTypeName: "",
            description: "",
            redirectToList: false
        };
    }
    clearForm() {
        this.setState({
            projectTypeName: "",
            description: ""
        })
    }
    //#region  save projectcomplexity details
    isProjectComplexityExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.ProjectComplexity + '?_where=(projectTypeName,eq,' + this.state.projectTypeName + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }

    saveProjectComplexityDetails() {
        var isvalidate = window.formValidation("#projectForm");
        if (isvalidate) {
            var res = this.isProjectComplexityExistsApi();
            res.done((response) => {
                    if (response.length > 0) {
                        $(".recordexists").show()
                    } else {
                        var _this = this;
                        var ProjectComplexitydata = {
                            "projectTypeName": this.state.projectTypeName,
                            "description": this.state.description,

                        }
                        const endpointPOST = environment.apiUrl + moduleUrls.ProjectComplexity + '/'
                        $.ajax({
                            url: endpointPOST,
                            type: Type.post,
                            data: ProjectComplexitydata,
                            success: function (resultData) {
                                _this.setState({ redirectToList: true });
                                toast.success("Record " + Notification.saved, {
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

    getProjectComplexityDeatilsApi(projectTypeId) {
        const endpointGET = environment.apiUrl + moduleUrls.ProjectComplexity + '/' + `${this.state.projectTypeId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }
    //#endregion


    //#region update fucntionality details
    updateDetailsApi(data) {
        const endpointPATCH = environment.apiUrl + moduleUrls.ProjectComplexity + '/' + `${this.state.projectTypeId}`
        var body =
        {
            "projectTypeName": data.projectTypeName,
            "description": data.description,
        }
        return $.ajax({
            url: endpointPATCH,
            type: Type.patch,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateProjectComplexityDetails(data) {
        var isvalidate = window.formValidation("#projectForm");
        if (isvalidate) {
            var res = this.updateDetailsApi(data);
            res.done((response) => {
                this.setState({
                    redirectToList: true
                })
                toast.success("Record " + Notification.updated, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            res.fail((error) => {
            })
        } else {
            return false;
        }
    }
    //#endregion

    componentDidMount() {
        if (this.state.projectTypeId !== undefined) {
            var res = this.getProjectComplexityDeatilsApi();
            res.done((response) => {
                this.setState({
                    projectTypeName: response[0].projectTypeName,
                    description: response[0].description
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }

    render() {
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/project-complexity" }} />
        }
        return (
            //#region form of project complexity
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> Project Complexity >
                {this.state.projectTypeId !== undefined ? <span>Edit</span> : <span>Add</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="projectForm">
                            <div className="form-group">
                                <label className="required">Project Name</label>
                                <input type="text" id="projectTypeName" className="form-control" name="projectTypeName" value={this.state.projectTypeName}
                                    onChange={(event) => {
                                        this.setState({
                                            projectTypeName: event.target.value
                                        })
                                    }} required />
                                <label className="recordexists" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</label>
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea id="description" className="form-control" name="description" rows="4" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} ></textarea>
                            </div>
                            <div className="form-group">
                                {this.state.projectTypeId !== undefined ?
                                    <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.UpdateProjectComplexityDetails(this.state);
                                    }}>Update</button>

                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.saveProjectComplexityDetails(this.state);
                                    }}>Save</button>}
                                        <button type="clear" className="btn btn-info mr-2" >Reset</button>
                                <Link to="/project-complexity" className="btn btn-danger ">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
            //#endregion 
        );
    }
}
export default AddProjectComplexity;
