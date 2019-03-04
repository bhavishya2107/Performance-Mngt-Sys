import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification } from '../Environment'
import DatePicker from "react-datepicker";
var moment = require('moment');

var ArrayState = []
class addAssignTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignDetailId: props.match.params.userId,
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
        this.getUserData(92);

    }
    onChangeUser(event) {
        this.setState({
            //userId: event.target.value,
            userId: [].slice.call(event.target.selectedOptions).map(o => {
                return o.value;
            })
        });
    }
    getQuaterData() {
        var url = environment.apiUrl + moduleUrls.Quater
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempQuater) => {
                var displayQuaterData = tempQuater.map(function (i) {
                    return (
                        <option key={i.quaterId} value={i.quaterId}>{i.quaterName}</option>
                    )
                });
                this.setState({
                    displayQuaterData: displayQuaterData
                })
            },
        });
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
                    displayTemplateData: displayTemplateData
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
    getUserData(selectedProjectId) {

        var url = environment.dynamicUrl + 'dynamic'
        var userData = {
            query: `select u.userid,u.firstName,u.lastName from user_master u left join project_resources p on p.userId = u.userId where p.projectId = ${selectedProjectId}`
        };
        $.ajax({
            url: url,
            type: Type.post,
            data: JSON.stringify(userData),
            headers: {
                "Content-Type": "application/json",
            },
            success: (tempUser) => {
                debugger
                console.log(tempUser)
                this.setState({
                    displayUserData: tempUser,
                    multiSelectDDL: true
                })
            },
        });
    }
    getTemplateApi() {
        debugger;
        var url = environment.dynamicUrl + 'dynamic'
        var tempData = {
            query: "SELECT UM.firstName,Um.lastname, PM.projectName,PM.startDate,PM.endDate,PM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy"
        }
        
        return $.ajax({
            url: url,
            type: Type.post,
            data:(tempData),
            success:((result)=>{
                console.log(result)
            })
        })
    }

    getUserDetails() {
        if (this.state.assignDetailId !== undefined) {
            var res = this.getTemplateApi();
            res.done((response) => {
                if (response !== undefined) {
                    var res = response[0];
                    this.setState({
                        templateName: res.templateName,
                        firstName: res.firstName,
                        lastName: res.lastName,
                        projectName: res.projectName,
                        startDate: res.startDate,
                        endDate: res.endDate
                    })

                }
            });
            res.fail((error) => {
            })
        } else {

        }
    }

    // #region save details for template
    saveTemplateDetailsApi(DataList) {
        alert(1)
        debugger;
        
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${this.state.templateId}`
        return $.ajax({
            url: url,
            type: Type.get,
            data: DataList,
            success: (res) => {
                console.log(res)
            }
        })
    }

    saveTemplateDetails(DataList) {
        var res = this.saveTemplateDetailsApi(DataList);
        res.done((response) => {
            this.setState({
                RedirectToTemplate: true
            })
            toast.success("Template " + Notification.saved, {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error) => {

        })

    }
    
    //#endregion
    //#region save details
    saveAssignTemplate() {
        var res = window.formValidation("#createTemplate");
        if (res) {
            var _this = this;
            var DataList =
            {
                "templateName": this.state.templateName,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "projectName": this.state.projectName,
                "startDate": moment(this.state.startDate).format("YYYY-MM-DD"),
                "endDate": moment(this.state.endDate).format("YYYY-MM-DD"),
            }
            this.saveTemplateDetails(DataList);


        }
        else {

            return false;
        }
    }
    //#endregion
    componentDidMount() {
        this.getQuaterData();
        this.getTemplateData();
        this.getProjectData();
        this.getProjectResourcesData();

    }
    render() {
        debugger;
        var displayUserDataReturn = this.state.displayUserData.map(function (i) {
            return (
                <option key={i.userid} value={i.userid}>{i.firstName + " " + i.lastName}</option>
            )
        });
        if (this.state.RedirectToTemplate) {
            return <Redirect to={{ pathname: "/Template" }} />
        }
        return (
            <div>
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
                                        <select id="multiSelect" name="user" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control" multiple={this.state.multiSelectDDL} >
                                            <option value="">select</option>
                                            {displayUserDataReturn}
                                        </select>
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
                                                    startDate: moment(e).format("YYYY-MM-DD")
                                                })
                                            }}//only when value has changed
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
                                                endDate: moment(e).format("YYYY-MM-DD")
                                            })
                                        }}//only when value has changed
                                        dateFormat="YYYY-MM-dd"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        {this.state.assignDetailId !== undefined ?
                                            <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                this.UpdateTemplateDetails(this.state);
                                            }}>Update</button>
                                            : <button type="button" className="btn btn-success mr-2" onClick={() => { 
                                                this.saveAssignTemplate(this.state)
                                            }}>Save</button>}

                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default addAssignTemplate;