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
            displayComplexityId: "",
            displayProjectStatus: "",
            selectComplexityMaster: "",
            selectProjectStatus: "",
            templateDataTable: [],
            displayManageBy: "",
            displayResources: "",
            projectName: "",
            startDate: "",
            endDate: "",
            complexityId: "",
            complexityName: "",
            manageBy: "",
            resources: "",
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
        var isvalidate = window.formValidation("#projectform");
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
                        "complexityId": this.state.complexityId,
                        "status": this.state.status,
                        "manageBy": this.state.manageBy,
                        "description": this.state.description,
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
                    "userId": this.state.userId
                }
            }
        });
        res.fail(error => {
        });
    }

    updateDetailsApi(data) {
        var body =
        {
            "projectName": data.projectName.trim(),
            "startDate": data.startDate,
            "endDate": data.endDate,
            "complexityId": data.complexityId,
            "status": data.status,
            "manageBy": data.manageBy,
            "description": data.description,
        }
        const endpointPATCH = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
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

    UpdateProjectDetails(data) {
        var isvalidate = window.formValidation("#projectform");
        if (isvalidate) {
            var res = this.isEditProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()

                } else {
                    var res = this.updateDetailsApi(data);
                    res.done(() => {
                        this.setState({
                            redirectToList: true
                        })
                        toast.success("Project " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    })
                    res.fail((error) => {
                    })
                }
            });
            res.fail((error) => {
            })
        } else {
            $(".recordexists").hide()
            return false;
        }
    }

    //#endregion


    onChangeResources(event) {
        this.setState({
            manageBy: event.target.value
        })
    }

    getResourcesData() {
        const endpointGET = environment.apiUrl + moduleUrls.User + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.userId} value={i.userId}>{i.userName}</option>
                    )
                });
                this.setState({
                    displayManageBy: displayDataReturn
                })
            },
        });
    }



    onChangeComplexityMaster(event) {
        this.setState({
            complexityId: event.target.value
        })
    }
    getcomplexityIdData() {
        const endpointGET = environment.apiUrl + moduleUrls.ComplexityMaster + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.complexityId} value={i.complexityId}>{i.complexityName}</option>
                    )
                });
                this.setState({
                    displayComplexityId: displayDataReturn
                })
            },
        });
    }


    onChangeResources(event) {
        this.setState({
            resources: event.target.value
        })
    }

    getResourcesData() {
        const endpointGET = environment.apiUrl + moduleUrls.User + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.userId} value={i.userId}>{i.userName}</option>
                    )
                });
                this.setState({
                    displayResources: displayDataReturn
                })
            },
        });
    }

    onChangeManageBy(event) {
        this.setState({
            manageBy: event.target.value
        })
    }

    getmanageByData() {
        const endpointGET = environment.apiUrl + moduleUrls.User + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.userId} value={i.userId}>{i.userName}</option>
                    )
                });
                this.setState({
                    displayManageBy: displayDataReturn
                })
            },
        });
    }


    // onChangeProjectStatus(event) {

    //     this.setState({
    //         selectProjectStatus: event.target.value
    //     })
    // }
    // getProjectStatusData() {
    //     const endpointGET = environment.apiUrl + moduleUrls.Project + '/'
    //     $.ajax({
    //         type: Type.get,
    //         url: endpointGET,
    //         complete: (temp) => {
    //             console.log(temp);
    //             var temp = temp.responseJSON;
    //             var displayDataReturn = temp.map((i) => {
    //                 return (
    //                     <option value={i.status}>{i.status}</option>
    //                 )
    //             });
    //             this.setState({
    //                 displayProjectStatus: displayDataReturn
    //             })
    //         },
    //     });
    // }


    componentDidMount() {
        this.getmanageByData();
        this.getcomplexityIdData();
        this.getResourcesData();
        this.setState({
            title: ModuleNames.Project
        })
        if (this.state.projectId !== undefined) {
            var res = this.getProjectDetailsApi();
            res.done((response) => {
                console.log(res);
                this.setState({
                    projectName: response[0].projectName,
                    startDate: response[0].startDate,
                    endDate: response[0].endDate,
                    complexityId: response[0].complexityId,
                    status: response[0].status,
                    manageBy: response[0].manageBy,
                    description: response[0].description,
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }

    // onChangeComplexityMaster(event) {

    //     this.setState({
    //         selectComplexityMaster: event.target.value
    //     })
    // }

    // addProject() {
    //     ;
    //     var templateDataapi = {
    //         "projectName": this.state.selectComplexityMaster,
    //         "status": this.state.selectProjectStatus
    //     }
    //     templateData.push(templateDataapi)

    //     this.setState({
    //         templateDataTable: templateData
    //     })
    //     this.$el = $(this.el);
    //     this.$el.DataTable({
    //         datasrc: templateData,
    //         data: templateData,
    //         columns: [
    //             {
    //                 data: "projectName",
    //                 target: 0
    //             },
    //             {
    //                 data: "status",
    //                 target: 1
    //             },
    //         ]
    //     })
    // }
    // getProjectComplexityData() {
    //     $.ajax({
    //         type: 'GET',
    //         url: 'http://192.168.10.109:3000/api/project_master',
    //         complete: (temp) => {
    //             console.log(temp);
    //             var temp = temp.responseJSON;
    //             var displayDataReturn = temp.map((i) => {
    //                 return (
    //                     <option value={i.projectName}>{i.projectName}</option>
    //                 )
    //             });
    //             this.setState({
    //                 displayProjectComplexity: displayDataReturn
    //             })
    //         },
    //     });
    // }

    // componentWillMount() {
    //     this.getProjectComplexityData();
    //     this.getProjectStatusData();

    // }
    render() {
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/projects" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.projectId !== undefined ? <span>Edit {ModuleNames.Project}</span> : <span>Add   {ModuleNames.Project}</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col">
                        <form id="projectform">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="projectName">Project Name</label>
                                        <input className="form-control" maxLength="50" name="projectName" type="text" onBlur={() => (this.onChangeBlur())} value={this.state.projectName}
                                            onChange={(event) => {
                                                $(".recordexists").hide()
                                                this.setState({
                                                    projectName: event.target.value
                                                })
                                            }} required />
                                        <label className="recordexists" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="startDate">Start Date</label>
                                        <input type="date" dateformat="dd-mm-yy" className="form-control" name="startDate" value={this.state.startDate}
                                            onChange={(event) => {
                                                this.setState({
                                                    startDate: event.target.value
                                                })
                                            }} required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label className="required" htmlFor="endDate">End Date</label>
                                    <input type="date" className="form-control" name="endDate" value={this.state.endDate}
                                        onChange={(event) => {
                                            this.setState({
                                                endDate: event.target.value
                                            })
                                        }} required />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <label >Complexity</label>
                                    <select required name="complexitydropdown" className="form-control" htmlFor="complexityId" onChange={(e) => { this.onChangeComplexityMaster(e) }} value={this.state.complexityId}  >
                                        <option value="">select</option>
                                        {this.state.displayComplexityId}
                                    </select>

                                </div>
                                <div className="col-md-4">
                                    <label>Project Status</label>
                                    <select required name="projectStatusdropdown" className="form-control" value={this.state.status}  >
                                        <option value="">select</option>
                                        {this.state.displayProjectStatus}
                                        <option>Not Started</option>
                                        <option>On Going</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="manageBy">Managed By</label>
                                        <select required name="manageBydropdown" className="form-control" onChange={(e) => { this.onChangeManageBy(e) }} value={this.state.manageBy}  >
                                            <option value="">select</option>
                                            {this.state.displayManageBy}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label>Resources</label>
                                    <select multiple id="multipleResource" className="chosen-select" required name="resourcesdropdown" className="form-control"
                                     onChange={(e) => { this.onChangeResources(e) }} 
                                    //  value={this.state.resources} 
                                      >
                                       
                                        {this.state.displayResources}
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
                                                this.UpdateProjectDetails(this.state);
                                            }}>Update</button>
                                            : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {
                                                this.saveApiDetails(this.state);
                                            }}>Save</button>}
                                        <button type="button" className="btn btn-info mr-2" onClick={() => {
                                            this.resetForm();
                                        }}>Reset</button>
                                        <Link to={{ pathname: '/projects', }} className="btn btn-danger mr-2">Cancel</Link>
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
