import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification } from '../Environment'
import DatePicker from "react-datepicker";
import { join } from 'path';
var moment = require('moment');

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
            startDate: new Date(),
            endDate: new Date()
        }
    }

    //#region Bind Dropdown Lists.

    //#endregion


    //#region AJax Calls
    saveTemplateDetailsApi(data) {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + "/bulk";
        return $.ajax({
            url: url,
            type: Type.post,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data)
        })
    }
    getTemplateDetailsApi() {
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

    //#endregion

    //#region Methods


    //#endregion

    //#region Events
    componentDidMount() {
        this.getQuaterData();
        this.getTemplateData();
        this.getProjectData();
        this.getProjectResourcesData();
        this.getTemplateDetails();
        this.getUserDataDetails();
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
        debugger
        this.setState({
            projectId: event.target.value
        });

        this.getUserData(event.target.value);

    }
    onChangeUser(event) {
        this.setState({
            //userId: event.target.value,
            userId: [].slice.call(event.target.selectedOptions).map(o => {
                return o.value;
            })
        });
    }
    //#endregion
    //#region update Template details
    updateAjaxCall(data) {
        var TempList =
        {
            "quaterId": data.quaterId,
            "templateId": data.templateId,
            "projectId": data.projectId,
            "userId": data.userId,
            "startDate": data.startDate,
            "endDate": data.endDate

        }
        this.setState({
            RedirectToTemplate: true
        })
        debugger
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

    UpdateTemplateDetails(data) {
        debugger
        var result = window.formValidation("#createTemplate");
        if (result) {
            var res = this.updateAjaxCall(data);
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

    getTemplateDetails() {            //update api

        if (this.state.assignId !== undefined) {
            var res = this.getTemplateDetailsApi();
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
                    
                }
            })
            res.fail((error) => {

            })
        } else {

        }
    }
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


        // $.ajax({
        //     url: url,
        //     type: Type.get,
        //     success: (tempQuater) => {
        //         var displayQuaterData = tempQuater.map(function (i) {
        //             return (
        //                 <option key={i.quaterId} value={i.quaterId}>{i.quaterName}</option>
        //             )
        //         });
        //         this.setState({
        //             displayQuaterData: displayQuaterData
        //         })
        //     },
        // });
    }
    getTemplateData() {
        var url = environment.apiUrl + moduleUrls.Template
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempTemplate) => {
                var displayTemplateData = tempTemplate.map(function (i) {
                    return (
                        <option key={i.templateId} value={i.templateId}>{i.templateName}</option>
                    )
                });
                this.setState({
                    displayTemplateData: displayTemplateData,
                    startDate: this.state.startDate
                })
            },
        });
    }
    getProjectData() {
        var url = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempProject) => {
                var displayProjectDataReturn = tempProject.map(function (i) {
                    return (
                        <option key={i.projectId} value={i.projectId}>{i.projectName}</option>
                    )
                });
                this.setState({
                    displayProjectData: displayProjectDataReturn

                })
            },
        });
    }

    getProjectResourcesData() {
        var url = environment.apiUrl + moduleUrls.ProjectResources + '/' + `${this.state.projectId}`
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempProjectResources) => {
                var displayProjectResourcesDataReturn = tempProjectResources.map(function (i) {
                    return (
                        <option key={i.projectId} value={i.projectId}>{i.userId}</option>
                    )
                });
                this.setState({
                    displayProjectResourcesData: displayProjectResourcesDataReturn

                })
            },
        });
    }
    getUserDataDetails() {
        debugger
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.projectId}`
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempUser) => {
                var displayUserDataReturn = tempUser.map(function (i) {
                    return (
                        <option key={i.userid} value={i.userid}>{i.firstName + " " + i.lastName}</option>
                    )
                });
                this.setState({
                    displayUserDataReturn: displayUserDataReturn

                })
            },
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
                    displayUserData: tempUser,
                    multiSelectDDL: true
                })
            },
        });

    }

    //#region save details
    saveAssignTemplate() {
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
                });
            });
            var res = this.saveTemplateDetailsApi(multiArraySaveDataList);
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
    //#endregion

    render() {
        var displayUserDataReturn = this.state.displayUserData.map(function (i) {
            return (<option key={i.userid} value={i.userid}>{i.firstName + " " + i.lastName}</option>)
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
                                            <select name="quaterDropDown" onChange={(e) => { this.onChangeQuater(e) }} value={this.state.quaterId} className="form-control" >
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
                                            <select name="TemplateDropDown" onChange={(e) => { this.onChangeTemplate(e) }} value={this.state.templateId} className="form-control" >
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
                                            <select name="projectDropDown" onChange={(e) => { this.onChangeProject(e) }} value={this.state.projectId} className="form-control" >
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
                                            {this.state.assignId == undefined ?
                                                <select id="multiSelect" name="user" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control" multiple={true} >
                                                    <option value=""></option>
                                                    {displayUserDataReturn}
                                                </select>
                                                :
                                                <select name="user" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control">
                                                    <option value=""></option>
                                                    {displayUserDataReturn}
                                                </select>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label className="required" htmlFor="startDate">Start Date</label><br></br>
                                            <DatePicker className="form-control" name="startDate"
                                                selected={this.state.startDate}
                                                onChange={(e) => {
                                                    this.setState({
                                                        startDate: moment(e).format("")
                                                    })
                                                }}
                                                dateFormat="YYYY-MM-dd"
                                                required />
                                        </div>
                                    </div>
                                    <div >
                                        <label className="required" htmlFor="endDate">End Date</label><br></br>
                                        <DatePicker className="form-control" name="endDate"
                                            selected={this.state.endDate}
                                            onChange={(e) => {
                                                this.setState({
                                                    endDate: moment(e).format("")
                                                })
                                            }}//only when value has changed
                                            dateFormat="YYYY-MM-dd"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group">
                                            {this.state.assignId !== undefined ?
                                                <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                    this.UpdateTemplateDetails(this.state);
                                                }}>Update</button>
                                                : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                    this.saveAssignTemplate(this.state)
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