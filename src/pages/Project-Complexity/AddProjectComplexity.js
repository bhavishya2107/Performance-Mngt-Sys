import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
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
    saveProjectComplexityDetails() {
        var _this = this;
        var ProjectComplexityData =
        {
            "projectTypeName": this.state.projectTypeName,
            "description": this.state.description,
        }
        var re = window.formValidation("#projectForm");
        if (re) {

        } else {
            return false;
        }
        $.ajax({
            url: "http://180.211.103.189:3000/api/project_type_master",
            type: "POST",
            data: ProjectComplexityData,
            success: function (resultData) {
                _this.setState({ redirectToList: true });
                toast.success("Project Complexity Added Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    getProjectComplexityDeatilsApi(projectTypeId) {
        const endpoint = `http://180.211.103.189:3000/api/project_type_master/${this.state.projectTypeId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }
    //#endregion


    //#region update fucntionality details
    updateDetailsApi(data) {
        var body =
        {
            "projectTypeName": data.projectTypeName,
            "description": data.description,
        }
        debugger;
        return $.ajax({
            url: `http://180.211.103.189:3000/api/project_type_master/${this.state.projectTypeId}`,
            type: "PATCH",
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
                toast.success("Project Complexity Updated Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            res.fail((error) => {
                debugger;
            })

        } else {

            return false;
        }
    }
    componentDidMount() {
        if (this.state.projectTypeId !== undefined) {
            var res = this.getProjectComplexityDeatilsApi();
            console.log(res);
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
                                <input type="text" id="projectTypeName" className="form-control" minLength="" value={this.state.projectTypeName}
                                    onChange={(event) => {
                                        this.setState({
                                            projectTypeName: event.target.value
                                        })
                                    }} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea id="description"  className="form-control" rows="4" value={this.state.description}
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

                                <button type="clear" className="btn btn-info mr-2" onClick={() => {
                                    this.clearForm()
                                }}>Clear</button>
                                <Link to="/project-complexity" className="btn btn-danger ">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            //#endregion 
        );
    }
}
export default AddProjectComplexity;
