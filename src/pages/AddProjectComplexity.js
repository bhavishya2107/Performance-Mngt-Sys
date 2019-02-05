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
    saveProjectComplexityDetails() {
        var _this = this;
        var ProjectComplexityData =
        {
            "projectTypeName": this.state.projectTypeName,
            "description": this.state.description,
        }
        $.ajax({

            url: "http://192.168.10.109:3000/api/project_type_master",
            type: "POST",
            data: ProjectComplexityData,
            // dataType:"text", 
            success: function (resultData) {
                _this.setState({ redirectToList: true });
                toast.success("Success  Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    getProjectComplexityDeatilsApi(projectTypeId) {
        const endpoint = `http://192.168.10.109:3000/api/project_type_master/${this.state.projectTypeId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }
    updateDetailsApi(data) {
        var body =
        {
            "projectTypeName": data.projectTypeName,
            "description": data.description,
        }
        debugger;
        return $.ajax({
            url: `http://192.168.10.109:3000/api/project_type_master/${this.state.projectTypeId}`,
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
            debugger;
            this.setState({
                redirectToList: true
            })
            toast.info("Updated!", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {
        })
    }
    componentDidMount() {
        if (this.state.projectTypeId !== undefined) {
            var res = this.getProjectComplexityDeatilsApi();
            console.log(res);
            res.done((response) => {
                debugger;
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

            <div className="row">
                {this.state.projectTypeId !== undefined ? <div>Edit</div> : <div>ADD</div>}

                <form id="kpiform" className="col-12">
                    <div className="form-group">
                        <label>Project Name</label>
                        <input className="form-control" value={this.state.projectTypeName}
                            onChange={(event) => {
                                this.setState({
                                    projectTypeName: event.target.value
                                })
                            }} />
                    </div>
                    <div className="form-group">
                        <label>Description</label> <textarea className="form-control" rows="4" value={this.state.description}
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
                        }}>Save</button>
                        : <button type="button" class="btn btn-success mr-2" onClick={() => {
                            this.saveProjectComplexityDetails(this.state);
                        }}>ADD</button>}
                    <button className="btn btn-info">Clear</button>
                </form>
            </div>
            /* <Link to={{ pathname: '/ProjectComplexity' }} onClick={(event) => { this.save(event) }} class="btn btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
            <button type="button" id="btnClr" class="btn btn-success" onClick={(event) => { this.clearfields(event) }} style={{ float: "center" }}>Clear</button> */

        );
    }
}
export default AddProjectComplexity;
