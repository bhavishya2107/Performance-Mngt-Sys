import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
import { Redirect } from "react-router-dom";
const $ = require('jquery');

$.DataTable = require('datatables.net-bs4');
var templateData = []
var ProjectData = []
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
            displayManageBy:"",
            manageBy:"",
            redirectToList: false
        };
    }
    resetForm() {
        window.location.reload();
    }
    isProjectExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '?_where=(projectName,eq,' + this.state.projectName.trim() + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    isEditProjectExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '?_where=(projectName,eq,' + this.state.projectName.trim() + ')' + '~and(projectId,ne,' + this.state.projectId + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }


    saveApiDetails() {
        var isvalidate = window.formValidation("#projectForm");
        if (isvalidate) {
            var res = this.isProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var _this = this;
                    var projectData = {
                        "projectName": this.state.projectName.trim(),
                        "startDate": this.state.startDate,
                        "endDate": this.state.endDate,
                        "description": this.state.description,
                        "complexityId": this.state.complexityId,
                        "status": this.state.status,
                        "manageBy": this.state.manageBy
                    }
                    const saveKpiUrl = environment.apiUrl + moduleUrls.Project + '/'
                    $.ajax({
                        url: saveKpiUrl,
                        type: Type.post,
                        data: projectData,
                        success: function (resultData) {
                            _this.setState({ redirectToList: true });
                            toast.success("Project " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            });
            res.fail(error => {
            });
        }
        else {
            $(".hide").hide()

            return false;
        }
    }
    getProjectDetailsApi(projectId) {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }

    onChangeBlur() {
        var res = this.isProjectExistsApi();
        res.done((response) => {
            if (response.length > 0) {
                $(".recordexists").show()
            } else {
                var _this = this;
                var Kpidata = {
                    "projectName": this.state.projectName.trim(),
                    "startDate": this.state.startDate,
                    "endDate": this.state.endDate,
                    "description": this.state.description,
                    "complexityId": this.state.complexityId,
                    "status": this.state.status,
                    "manageBy": this.state.manageBy
                }
            }
        });
        res.fail(error => {
        });
    }

    addProjectManageBy() {
        var ProjectDataKpi = {
            "manageBy": this.state.manageBy,
        }
        ProjectData.push(ProjectDataKpi)
        this.setState({
            ProjectDataTable: ProjectData
        })
        this.$el = $(this.el);
        this.$el.DataTable({
            datasrc: ProjectData,
            data: ProjectData,
            columns: [
                {
                    data: "userName",
                    target: 0
                },
            ]
        })
    }

    onChangeManageBy(event) {
        this.setState({
            manageBy: event.target.value
        })
    }
    getmanageByData() {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.manageBy} value={i.manageBy}>{i.userName}</option>
                    )
                });
                this.setState({
                    displayManageBy: displayDataReturn
                })
            },
        });
    }


    componentWillMount() {
        this.getmanageByData();
    }





    componentDidMount() {
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            console.log(res);
            res.done((response) => {
                ;
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
        ;
        this.setState({
            selectProjectComplexity: event.target.value
        })
    }
    onChangeProjectStatus(event) {
        ;
        this.setState({
            selectProjectStatus: event.target.value
        })
    }
    addProject() {
        ;
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
                                        <label for="projectName">Project Name</label>
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
                                    <label className="mr-2">Complexity Master:</label>
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

                                <div className="col-md-4">

                                    <div className="form-group">
                                        <label for="managedBy">Managed By</label>
                                        <select required name="manageBydropdown"  onChange={(e) => { this.onChangeManageBy(e) }}  className="form-control" value={this.state.manageBy}>
                                            <option>select</option>
                                            {this.state.displayManageBy}
                                        </select>
                                    </div>
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
                                        <button type="button" className="btn btn-info mr-2" onClick={() => {
                                            this.resetForm();
                                        }}>Reset</button>
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
