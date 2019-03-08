import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification } from '../Environment'
import DatePicker from "react-datepicker";
var moment = require('moment');
const options = []
var ArrayState = []
class addAssignTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignId: props.match.params.assignId,
            quaterId: "",
            templateId: "",
            projectId: "",
            userId: "",
            RedirectToTemplate: false,
            displayUserData: [],
            multiSelectDDL: false,
            startDate: "",
            endDate: "",
            options: "",
            tempUser: "",

        }
    }
    //#region Bind Dropdown Lists.
    getQuaterData() {
        var url = environment.apiUrl + moduleUrls.Quater;
        this.getDropDownValues(url).done(
            (tempQuater) => {
                var displayQuaterData = tempQuater.map(function (i) {
                    return (<option key={i.quaterId} value={i.quaterId}>{i.quaterName}</option>)
                });
                this.setState({
                    displayQuaterData: displayQuaterData
                });
            }
        ).fail((error) => { console.log(error) });
    }
    getTemplateData() {
        var url = environment.apiUrl + moduleUrls.Template
        this.getDropDownValues(url).done(
            (tempTemplate) => {
                var displayTemplateData = tempTemplate.map(function (i) {
                    return (
                        <option key={i.templateId} value={i.templateId}>{i.templateName}</option>
                    )
                });
                this.setState({
                    displayTemplateData: displayTemplateData,
                })
            })
    }
    getProjectData() {
        var url = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        this.getDropDownValues(url).done(
            (tempProject) => {
                var displayProjectDataReturn = tempProject.map(function (i) {
                    return (
                        <option key={i.projectId} value={i.projectId}>{i.projectName}</option>
                    )
                });
                this.setState({
                    displayProjectData: displayProjectDataReturn
                })
            })
    }
    getProjectResourcesData() {
        var url = environment.apiUrl + moduleUrls.ProjectResources + '/' + `${this.state.projectId}`
        this.getDropDownValues(url).done(
            (tempProjectResources) => {
                var displayProjectResourcesDataReturn = tempProjectResources.map(function (i) {
                    return (
                        <option key={i.projectId} value={i.projectId}>{i.userId}</option>
                    )
                });
                this.setState({
                    displayProjectResourcesData: displayProjectResourcesDataReturn
                })
            })
    }

    //#endregion
    //#region AJax Calls
    saveTemplateAssignDetailsApi(data) {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + "/bulk?_ids=" + `${this.state.assignId}`;
        return $.ajax({
            url: url,
            type: Type.post,
            dataSrc: "",
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
    }
    getTemplateAssignDetailsApi() {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${this.state.assignId}`
        return $.ajax({
            url: url,
            type: Type.get,
        })
    }
    getDropDownValues(url) {
        return $.ajax({
            url: url,
            type: Type.get
        })

    }
    updateTemplateAssignAjaxCall(data) {
        var TempList =
        {
            "userId": data.userId,
            "startDate": moment(data.startDate).format('YYYY-MM-DD'),
            "endDate": moment(data.endDate).format('YYYY-MM-DD')
        }
        this.setState({
            RedirectToTemplate: true
        })
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${data.assignId}`
        return $.ajax({
            url: url,
            type: Type.patch,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(TempList),
        });
    }
    //#endregion
    //#region Methods
    getResourceDetailsAPI(projectId) {
        const url = environment.dynamicUrl + 'dynamic'
        return $.ajax({
            url: url,
            type: Type.post,
            dataSrc: "",
            data: {
                "query": `select u.userid,u.firstName,u.lastName from user_master u left join project_resources p on p.userId = u.userId where p.projectId =${projectId}`
            },
            success: (response) => {
                this.setState({
                    displayUserData: response,
                });
            }

        })
    }

    getUserDataDetailsApi() {
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.projectId}`
        return $.ajax({
            url: url,
            type: Type.get,

        });
    }

    getUserData(selectedProjectId) {
        var url = environment.dynamicUrl + "dynamic"

        var userData = {
            query: `select u.userid,u.firstName,u.lastName from user_master u left join project_resources p on p.userId = u.userId where p.projectId = ${selectedProjectId}`
        };
        $.ajax({
            url: url,
            type: Type.post,
            dataSrc: "",
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json",
            },
            success: (tempUser) => {
                this.setState({
                    displayUserData: tempUser
                })
            },
        });

    }

    getTemplateAssignDetails() {            //update api

        if (this.state.assignId !== undefined) {
            var res = this.getTemplateAssignDetailsApi();

            res.done((response) => {
                if (response !== undefined) {
                    var res = response[0];
                    this.setState({
                        quaterId: res.quaterId,
                        templateId: res.templateId,
                        projectId: res.projectId,
                        userId: res.userId,
                        startDate: res.startDate,
                        endDate: res.endDate
                    })

                    /* START - GET RESOURCE OF SELECTED PROJECT */
                    var result = this.getResourceDetailsAPI(res.projectId);
                    result.done((response) => {
                        this.setState({
                            displayUserData: response
                        })
                    })
                    result.fail((error) => {
                        alert(error)
                    });
                    /* END - GET RESOURCE OF SELECTED PROJECT */
                }
            })
            res.fail((error) => {

            })
        }
    }
    //#endregion
    //#region Events
    componentDidMount() {
        this.getQuaterData();
        this.getTemplateData();
        this.getProjectData();
        this.getProjectResourcesData();
        this.getTemplateAssignDetails();
    }
    onChangeQuater(event) {
        this.setState({
            quaterId: event.target.value
        })
    }
    onChangeTemplate(event) {
        this.setState({
            templateId: event.target.value
        })
    }
    onChangeProject(event) {
        this.setState({
            projectId: event.target.value
        });
        this.getUserData(event.target.value);
    }
    onChangeUser(event) {
        this.setState({
            userId: event.target.value,
            userId: [].slice.call(event.target.selectedOptions).map(o => {
                return o.value;
            })
        });
    }
    //#endregion
    //#region save and update details
    saveTemplateAssignDetails() {
        var res = window.formValidation("#createTemplate");
        var multiArraySaveDataList = [];
        if (res) {
            this.state.userId.map((user) => {
                multiArraySaveDataList.push({
                    "quaterId": this.state.quaterId,
                    "templateId": this.state.templateId,
                    "projectId": this.state.projectId,
                    "userId": user,
                    "startDate": moment(this.state.startDate).format("YYYY-MM-DD"),
                    "endDate": moment(this.state.endDate).format("YYYY-MM-DD"),
                })
            })

            var res = this.saveTemplateAssignDetailsApi(multiArraySaveDataList);
            res.done((response) => {
                this.setState({
                    RedirectToTemplate: true
                })
                toast.success("Template " + Notification.saved, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            res.fail((error) => {
            });
        }
        else {
            return false;
        }
    }

    UpdateTemplateAssignDetails(data) {
        var result = window.formValidation("#createTemplate");
        if (result) {
            var res = this.updateTemplateAssignAjaxCall(data);
            res.done((response) => {
                toast.success("Template " + Notification.updated, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            res.fail((error) => {
            })
        }
        else {
            return false;
        }
    }
    //#endregion
    render() {
        //for multiselect user ddl
        var existingUserId = this.state.userId;
        //console.log('existingUserId ', existingUserId);
        var displayUserDataReturn = this.state.displayUserData.map(function (i) {
            return (
                existingUserId == i.userid ?
                    (<option key={i.userid} value={i.userid} selected="selected">{i.firstName + " " + i.lastName}</option>)
                    :
                    (<option key={i.userid} value={i.userid} >{i.firstName + " " + i.lastName}</option>)
            )
        });
        if (this.state.RedirectToTemplate) {
            return <Redirect to={{ pathname: "/Template" }} />
        }
        return (
            <div>
                <div className="clearfix">
                    <div className="clearfix d-flex align-items-center row page-title">
                        <h2 className="col">
                            {this.state.assignId !== undefined ? <span>Edit AssignTemplate</span> : <span>Add AssignTemplate</span>}
                        </h2>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <form id="createTemplate">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="required">Quater</label>
                                            <select required name="quaterDropDown" onChange={(e) => { this.onChangeQuater(e) }} disabled={this.state.assignId !== undefined ? true : false} value={this.state.quaterId} className="form-control" >
                                                <option value="">Select Quater</option>
                                                {this.state.displayQuaterData}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="required">Template</label>
                                            <select required name="TemplateDropDown" onChange={(e) => { this.onChangeTemplate(e) }} disabled={this.state.assignId !== undefined ? true : false} value={this.state.templateId} className="form-control" >
                                                <option value="">Select Template</option>
                                                {this.state.displayTemplateData}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="required">Project</label>
                                            <select required name="projectDropDown" onChange={(e) => { this.onChangeProject(e) }} disabled={this.state.assignId !== undefined ? true : false} value={this.state.projectId} className="form-control" >
                                                <option value="">Select Project</option>
                                                {this.state.displayProjectData}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>User</label>
                                            <select required id="multiSelect" name="user" onChange={(e) => { this.onChangeUser(e) }} disabled={this.state.assignId !== undefined ? true : false} className="form-control" multiple={this.state.assignId == undefined ? true : false} >
                                                <option value="0">--</option>
                                                {displayUserDataReturn}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="required" htmlFor="startDate">Start Date</label><br></br>
                                            <DatePicker required className="form-control" name="startDate" autoComplete="off"
                                                selected={this.state.startDate}
                                                dateFormat="dd-MM-YYYY"
                                                onChange={(e) => {
                                                    this.setState({
                                                        startDate: moment(e).format("YYYY-MM-DD") == "Invalid date" ? null : moment(e).format("YYYY-MM-DD")

                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="required" htmlFor="endDate">End Date</label><br></br>
                                        <DatePicker required className="form-control" name="endDate" autoComplete="off"
                                            selected={this.state.endDate}
                                            dateFormat="dd-MM-YYYY"
                                            onChange={(e) => {
                                                this.setState({
                                                    endDate: moment(e).format("YYYY-MM-DD") == "Invalid date" ? null : moment(e).format("YYYY-MM-DD")

                                                })
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            {this.state.assignId !== undefined ?
                                                <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                    this.UpdateTemplateAssignDetails(this.state);
                                                }}>Update</button>
                                                : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                    this.saveTemplateAssignDetails(this.state)
                                                }}>Save</button>}
                                            <Link to='/Template' className="btn btn-danger mr-2">Cancel</Link>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default addAssignTemplate;