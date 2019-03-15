import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
import Select from 'react-select';

import { Redirect } from "react-router-dom";
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
var moment = require('moment');

var ProjectResourcesData = []
var projectData = []

const options = [];

class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tempData: {},
            projectId: props.match.params.id,
            RedirectToSample: false,
            displayComplexityId: "",
            displayProjectStatus: "",
            templateDataTable: [],
            displayManageBy: "",
            displayResources: "",
            projectName: "",
            startDate: "",
            endDate: "",
            complexityId: "",
            complexityName: "",
            userId: "",
            manageBy: "",
            resources: {},
            isSelect: false,
            ResourceOptions: [],
            selectedOption: null,
            redirectToList: false
        };
        this.handleChange = (displaySelectedOption) => {
            $(".requiredfield").hide()
            this.setState({ selectedOption: displaySelectedOption });
        }
    }

    resetForm() {
        window.location.reload();
    }

    checkDateValidation(startDate, endDate) {
        // check the dates
        if ((new Date(startDate) > new Date(endDate)) || (new Date(endDate) < new Date(startDate))) {
            // set date error validation true 
        } else {
            // null or false date error validation 
        }
    }

    onChangeBlur() {
        if (this.state.projectId != undefined) {
            var res = this.isEditProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            }
            )
        }
        else {
            var res = this.isProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                }
                else {
                }
            })
        }
    }

    getResourceDetailsAPI() {
        const endpointGET = environment.apiUrl + moduleUrls.ProjectResources + '?_where=(projectId,eq,' + this.state.projectId + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }


    getProjectDetailsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }

    //#region is project already exist or not api


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
    //#endregion

    //#region mail sent on project save
    sendMailAPI(body) {
        const emailUrl = "https://prod-17.centralindia.logic.azure.com:443/workflows/ecb28aa6326c46d2b632dbe5a34f76af/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qK3dMqlg6f1nEjlqWvG-KtxyVrAXqb3Zn1Oy5pJJrXs";
        return $.ajax({
            url: emailUrl,
            type: "post",
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
    temp() {

        this.setState({
            tempData: options
        })
    }

    sendProjectMail() {
        var resourceName = '';
        $(this.state.selectedOption).each((e, item) => {
            resourceName += item.label + ",";
        })
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.manageBy}`
        return $.ajax({
            url: url,
            type: Type.get,
            success: (res) => {
                var emailBody =
                    `<html>
                    <body>
                    <p>Hello `+ res[0].firstName + ' ' + res[0].lastName + `, </p>
                    <p>New Project Assigned to you. Below are the details of project:</p>`;
                emailBody += `
                       project name is <b>` + this.state.projectName + `</b><br>
                       Date:<b>` + moment(this.state.startDate).format("DD-MM-YYYY") + ' ' + `to` + ' ' + moment(this.state.endDate).format("YYYY-MM-DD") + ` </b><br>
                       Resources:<b>` + resourceName + `</b><br>
                       Description:<b>` + this.state.description + `</b>
                    </p>                        
                    <p>Thanks,</p>
                    <p>PSSPL ADMIN</p>
                </body>
                </html>`;
                var body =
                {
                    emailSubject: "New Project assigned",
                    emailBody: emailBody,
                    toemailadress: "janmeshnayak1997@gmail.com"
                }
                this.sendMailAPI(body);
            }
        })
    }
    //#endregion

    //#region save data(api)


    saveProjectResourceAPI(tempData) {
        var ResourcesData = JSON.stringify(tempData);
        const resourcesApi = environment.apiUrl + moduleUrls.ProjectResources + '/bulk';
        return $.ajax({
            url: resourcesApi,
            type: Type.post,
            data: ResourcesData,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            }
        });
    }

    saveProjectResource(projectId, userData) {
        var isvalidate = window.formValidation("#projectform");
        if (isvalidate) {
            var tempData = [];
            userData.map(item => {
                var resources = {
                    "projectId": projectId,
                    "userId": item.value,
                }
                tempData.push(resources);
            })
            var res = this.saveProjectResourceAPI(tempData);
            res.done((response) => {
                this.sendProjectMail();
                this.setState({ redirectToList: true });
                toast.success("Project " + Notification.saved, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            res.fail((error) => {
            })
        }
        else {
            $(".requiredfield").show()
            return false;
        }
    }

    saveProjectDetailsAPI(projectData) {
        const saveProjectUrl = environment.apiUrl + moduleUrls.Project + '/'
        return $.ajax({
            url: saveProjectUrl,
            type: Type.post,
            data: projectData,

        });
    }

    saveProjectDetails(projectData) {
        var res = this.saveProjectDetailsAPI(projectData);
        res.done((response) => {
            this.saveProjectResource(response.insertId, this.state.selectedOption);
        })
        res.fail((error) => {

        })
    }

    saveProject() {
        var isvalidate = window.formValidation("#projectform");

        if (this.state.selectedOption === null || this.state.selectedOption.length == 0) {
            isvalidate = false;
            $(".requiredfield").show();
        }

        if (isvalidate) {
            var res = this.isProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var projectData = {
                        "projectName": this.state.projectName.trim(),
                        "startDate": moment(this.state.startDate).format("YYYY-MM-DD"),
                        "endDate": moment(this.state.endDate).format("YYYY-MM-DD"),
                        "complexityId": this.state.complexityId,
                        "status": this.state.status,
                        "manageBy": this.state.manageBy,
                        "description": this.state.description,
                        "createdBy": localStorage.getItem('userId')
                    }
                    this.saveProjectDetails(projectData);
                }
            });
            res.fail(error => {
            });
        }
        else {
            return false;
        }

    }
    //#endregion

    //#region update api

    updateProjectResourceAPI(tempData) {
        var ResourcesData = JSON.stringify(tempData);
        const resourcesApi = environment.apiUrl + moduleUrls.ProjectResources + '/bulk';
        return $.ajax({
            url: resourcesApi,
            type: Type.post,
            data: ResourcesData,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            }
        });
    }

    deleteResources(projectId) {
        return $.ajax({
            url: "http://192.168.10.110:3000/dynamic",
            type: Type.post,
            data: {
                "query": "delete from project_resources where projectId = " + projectId
            },
        })
    }

    updateProjectResource(projectId, userData) {
        var responseDeleteResources = this.deleteResources(projectId);
        responseDeleteResources.done((response) => {
            var tempData = [];
            userData.map(item => {
                var resources = {
                    "projectId": projectId,
                    "userId": item.value
                }
                tempData.push(resources);
            })

            var res = this.updateProjectResourceAPI(tempData);
            res.done((response) => {
                this.setState({ redirectToList: true });
                toast.success("Project " + Notification.updated, {
                    position: toast.POSITION.TOP_RIGHT
                });
            })
            res.fail((error) => {
            })
        })
        responseDeleteResources.fail((error) => {
        })
    }

    updateProjectDetailsAPI(updateData) {
        var updateData = JSON.stringify(updateData);
        const endpointPATCH = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        return $.ajax({
            url: endpointPATCH,
            type: Type.patch,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: updateData
        });
    }

    updateDetailsAPI(updateData) {
        debugger;
        var isvalidate = window.formValidation("#projectform");
        if (this.state.selectedOption === null || this.state.selectedOption.length == 0) {
            isvalidate = false;
            $(".requiredfield").show();
        }
        if (isvalidate) {
            var res = this.isEditProjectExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var TempData =
                    {
                        "projectName": updateData.projectName.trim(),
                        "startDate": moment(updateData.startDate).format("YYYY-MM-DD"),
                        "endDate": moment(updateData.endDate).format("YYYY-MM-DD"),
                        "complexityId": updateData.complexityId,
                        "status": updateData.status,
                        "manageBy": updateData.manageBy,
                        "description": updateData.description,
                        "modifiedBy": localStorage.getItem('userId')
                    }
                    var res = this.updateProjectDetailsAPI(TempData);
                    res.done((response) => {
                        this.updateProjectResource(this.state.projectId, this.state.selectedOption);
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

    //#region onchange for Complexity Master Data

    onChangeComplexityMaster(event) {
        this.setState({
            complexityId: event.target.value,
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
    //#endregion

    //#region  onchange for resources Data

    onChangeResources(event) {
        $(".requiredfield").hide()
        this.setState({
            resources: event.target.value,
        })
    }

    getResourcesData() {
        var output = [];
        const endpointGET = environment.apiUrl + moduleUrls.User + '/'
        return $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {

                var temp = temp.responseJSON;
                $(temp).each((e, item) => {
                    var singleObjId = {
                        value: item.userId,
                        label: item.userName
                    };
                    options.push(singleObjId);
                }
                )
                this.setState({
                    ResourceOptions: options
                })
            },
        });
    }
    //#endregion

    //#region onchange for Managed By  Data from user page

    onChangeManageBy(event) {
        this.setState({
            manageBy: event.target.value,
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
                        <option key={i.userId} value={i.userId}>{i.firstName} {i.lastName}</option>
                    )
                });
                this.setState({
                    displayManageBy: displayDataReturn
                })
            },
        });
    }

    onChangeProjectStatus(event) {
        this.setState({
            status: event.target.value,
        })
    }

    getProjectStatus() {
        const endpointGET = environment.apiUrl + moduleUrls.Project + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option>{i.status}</option>
                    )
                });
                this.setState({
                    displayProjectStatus: displayDataReturn
                })
            },
        });
    }


    //#endregion

    componentDidMount() {
        this.setState({
            title: ModuleNames.Project
        })

        this.getmanageByData();
        this.getcomplexityIdData();
        var responseResourcesData = this.getResourcesData();
        responseResourcesData.done((response) => {
            if (this.state.projectId !== undefined) {
                var res = this.getProjectDetailsApi();
                res.done((response) => {
                    this.setState({
                        projectName: response[0].projectName,
                        complexityId: response[0].complexityId,
                        status: response[0].status,
                        manageBy: response[0].manageBy,
                        description: response[0].description,
                        startDate: response[0].startDate,
                        endDate: response[0].endDate
                    })

                    var resource = this.getResourceDetailsAPI();
                    resource.done((response) => {
                        var tempData = [];
                        response.map(item => {
                            if (item.userId !== null) {
                                var found_names = $.grep(this.state.ResourceOptions, function (v) {
                                    return v.value === item.userId
                                });
                                if (found_names.length > 0) {
                                    var resources = {
                                        "value": item.userId,
                                        "label": found_names[0].label
                                    }
                                    tempData.push(resources);
                                }
                            }

                        });
                        this.setState({
                            selectedOption: tempData
                        })
                    });
                    resource.fail((error) => {
                    })
                });
            }
        });
        responseResourcesData.fail((error) => {
        })
    }

    render() {
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/projects" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.projectId !== undefined ? <span>Edit {ModuleNames.Project}</span> : <span>Add  {ModuleNames.Project}</span>}
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
                                        <label className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="startDate">Start Date</label><br></br>
                                        <div>
                                            <DatePicker className="form-control" name="startDate"
                                                selected={this.state.startDate} autoComplete="off"
                                                dateFormat="dd-MM-YYYY"
                                                onChange={(e) => {
                                                    $(".requiredfield").hide()
                                                    this.setState({
                                                        isSelect: true,
                                                        startDate: moment(e).format("YYYY-MM-DD") == "Invalid date" ? null : moment(e).format("YYYY-MM-DD")
                                                    })
                                                }}
                                                required />
                                        </div>
                                        {/* <label className="requiredfield" style={{ "display": "none", "color": "#dc3545" }}>This field is required.</label> */}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <label className="required" htmlFor="endDate">End Date</label><br></br>
                                        <DatePicker required className="form-control" name="endDate"
                                            selected={this.state.endDate} autoComplete="off"
                                            dateFormat="dd-MM-YYYY"
                                            onChange={(e) => {

                                                // $(".requiredfield").hide()
                                                this.setState({
                                                    isSelect: true,
                                                    endDate: moment(e).format("YYYY-MM-DD") == "Invalid date" ? null : moment(e).format("YYYY-MM-DD")
                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Complexity</label>
                                    <select required name="complexitydropdown" className="form-control" htmlFor="complexityId"
                                        onChange={(e) => {
                                            this.onChangeComplexityMaster(e)
                                        }} value={this.state.complexityId}  >
                                        <option value="">select</option>
                                        {this.state.displayComplexityId}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label>Project Status</label>
                                    <select required name="projectStatusdropdown" className="form-control" value={this.state.status}
                                        onChange={(e) => {
                                            this.onChangeProjectStatus(e)
                                        }} value={this.state.status}  >

                                        {this.state.displayProjectStatus}
                                        <option defaultValue="Not Started">Not Started</option>
                                        <option>On Going</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="manageBy">Managed By</label>
                                        <select required name="manageBydropdown" className="form-control"
                                            onChange={(e) => {
                                                this.onChangeManageBy(e)
                                            }} value={this.state.manageBy}  >
                                            <option value="">select</option>
                                            {this.state.displayManageBy}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label>Resources</label>
                                    <Select isMulti name="resources" id="mySelect"
                                        onChange={(event) => {
                                            $(".requiredfield").hide()
                                            this.setState({
                                                isSelect: true,
                                                resources: event.target.value
                                            })
                                        }} value={this.state.selectedOption}
                                        options={this.state.ResourceOptions}
                                        onChange={this.handleChange}
                                    />
                                    <label className="requiredfield" style={{ "display": "none", "color": "#dc3545" }}>This field is required.</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label>Description</label> <textarea className="form-control" name="description" rows="4" value={this.state.description}
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

                                            <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                this.updateDetailsAPI(this.state);
                                            }}>Update</button>

                                            : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {

                                                this.saveProject(this.state);
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
