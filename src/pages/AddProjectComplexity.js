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
        debugger;
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
        })
    }

    //#endregion
   
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
            return <Redirect to={{ pathname: "/ProjectComplexity" }} />
        }
        return (
          //#region form of project complexity
          <div className="row">
                {this.state.projectTypeId !== undefined ? <div></div> : <div></div>}
                <form id="projectForm" className="col-12">
                    <div className="form-group">
                        <label className="required" for="projectName">Project Name</label>
                        <input className="form-control" minlength="3" type="text" value={this.state.projectTypeName}
                            onChange={(event) => {
                                this.setState({
                                    projectTypeName: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="form-group">
                        <label for="description">Description</label>
                        <textarea className="form-control" rows="4"  minLength="10" type="text" value={this.state.description}
                            onChange={(event) => {
                                this.setState({
                                    description: event.target.value
                                })
                            }} ></textarea>
                    </div>
                    <br />
                    {this.state.projectTypeId !== undefined ?
                        <button type="button" class="btn btn-success mr-2" onClick={() => {
                            this.UpdateProjectComplexityDetails(this.state);
                        }}>Update</button>
                        : <button type="button" class="btn btn-success mr-2" value="submit" onClick={() => {
                            this.saveProjectComplexityDetails(this.state);
                        }}>Save</button>}
                    <button className="btn btn-info mr-2">Clear</button>
                    <Link to={{ pathname: '/ProjectComplexity', }} className="btn btn-danger mr-2">Cancel</Link>                

                    </form>
            </div>
            //#endregion 
        );
    }
}
export default AddProjectComplexity;
