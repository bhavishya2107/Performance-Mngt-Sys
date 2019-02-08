import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from "react-router-dom";
const $ = require('jquery');
var templateData = []

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: props.match.params.id,
            RedirectToSample: false,
            displayProjectComplexity: "",
            displayProjectStatus: "",
            selectProjectComplexity: "",
            selectProjectStatus: "",
            templateDataTable: [],
            redirectToList: false
        };
    }
    saveProjectDetails() {
        var _this = this;
        var projectdata = {
            "projectName": this.state.projectName,
            "description": this.state.description,
            "scalesetId": 5
        }
        var re = window.formValidation("#projectForm");
        if (re) {
            alert("Success")
        } else {

            return false;
        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/project_master",
            type: "POST",
            data: projectdata,
            success: function (resultData) {
                alert("Save Complete");
                _this.setState({ redirectToList: true });
                toast.success("Success Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    getKpiDetailsApi(KpiId) {
        const endpoint = `http://192.168.10.109:3000/api/project_master/${this.state.kpiId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }
    updateDetailsApi(data) {
        var body =
        {
            "KpiTitle": data.kpiTitle,
            "target": data.target,
        }
        debugger;
        return $.ajax({
            url: `http://192.168.10.109:3000/api/kpi_master/${this.state.kpiId}`,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateKpiDetails(data) {
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
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            console.log(res);
            res.done((response) => {
                debugger;
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }

    onChangeProjectComplexity(event) {
        debugger;
        this.setState({
            selectProjectComplexity: event.target.value
        })
    }
    onChangeProjectStatus(event) {
        debugger;
        this.setState({
            selectProjectStatus: event.target.value
        })
    }
    addProject() {
        debugger;
        var templateDataapi = {
            "projectName": this.state.selectProjectComplexity,
            "status": this.state.selectProjectStatus
        }
        templateData.push(templateDataapi)

        this.setState({
            templateDataTable: templateData
        })
        this.$el = $(this.el);
        this.$el.DataTable({
            datasrc: templateData,
            data: templateData,
            columns: [
                {
                    data: "projectName",
                    target: 0
                },
                {
                    data: "status",
                    target: 1
                },
            ]
        })
    }
    getProjectComplexityData() {
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/project_master',
            complete: (temp) => {
                console.log(temp);
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option value={i.projectName}>{i.projectName}</option>
                    )
                });
                this.setState({
                    displayProjectComplexity: displayDataReturn
                })
            },
        });
    }
    getProjectStatusData() {
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/project_master',
            complete: (temp) => {
                console.log(temp);
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option value={i.status}>{i.status}</option>
                    )
                });
                this.setState({
                    displayProjectStatus: displayDataReturn
                })
            },
        });
    }

    componentWillMount() {
        this.getProjectComplexityData();
        this.getProjectStatusData();

    }
    render() {
        if (this.state.redirectToList == true) {

            return <Redirect to={{ pathname: "/Projects" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> Project >
                    {this.state.projectId !== undefined ? <span>Edit</span> : <span>Add</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col">
                        <form id="projectForm">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label for="projectName">Project Name(required, at least 3 characters)</label>
                                        <input className="form-control" minlength="5" type="text" value={this.state.projectName}
                                            onChange={(event) => {
                                                this.setState({
                                                    projectName: event.target.value
                                                })
                                            }} />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input type="date" className="form-control" />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label>End Date</label>
                                    <input type="date" className="form-control" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <label className="mr-2">Project Complexity:</label>
                                    <select onChange={(e) => { this.onChangeProjectComplexity(e) }} className="form-control">
                                        <option>select</option>
                                        {this.state.displayProjectComplexity}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label className="mr-2">Project Status:</label>
                                    <select onChange={(e) => { this.onChangeProjectStatus(e) }} className="form-control">
                                        <option>select</option>
                                        {this.state.displayProjectStatus}
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Description</label> <textarea className="form-control" rows="4" value={this.state.description}
                                            onChange={(event) => {
                                                this.setState({
                                                    description: event.target.value
                                                })
                                            }} ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        {this.state.projectId !== undefined ?
                                            <button type="button" class="btn btn-success mr-2" onClick={() => {
                                                this.UpdateKpiDetails(this.state);
                                            }}>Save</button>
                                            : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {
                                                this.saveProjectDetails(this.state);
                                            }}>ADD</button>}
                                        <button className="btn btn-info mr-2">Clear</button>
                                        <Link to={{ pathname: '/Projects', }} className="btn btn-danger mr-2">Cancel</Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}
export default AddProject;
