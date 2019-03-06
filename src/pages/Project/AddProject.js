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
            startDate: new Date(),
            endDate: new Date(),
            complexityId: "",
            complexityName: "",
            userId: "",
            manageBy: "",
            resources: {},
            ResourceOptions: [],
            selectedOption: null,
            redirectToList: false
        };
        // this.handleChange = this.handleChange.bind(this);
        this.handleChange = (displaySelectedOption) => {
            this.setState({ selectedOption: displaySelectedOption });
           // console.log(`Option selected:`, displaySelectedOption);
        }
    }


    resetForm() {
        window.location.reload();
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
                    //alert("")
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
        //console.log(endpointGET)
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    //#endregion


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


    sendProjectMail() {
        /* START - GET TL NAME AND EMAIL */
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.manageBy}`
        return $.ajax({
            url: url,
            type: Type.get,
            success: (res) => {
                // response.done((result) => {
                var emailBody =
                    `<html>
                    <body>
                    <p>Hello `+ res[0].firstName + ' ' + res[0].lastName + `, </p>
                    <p>New Project Assigned to you. Below are the details of project:</p>`;

                emailBody += `
                       project name is <b>` + this.state.projectName + `</b><br>
                       Date:<b>` + moment(this.state.startDate).format("YYYY-MM-DD") + ' ' + `to` + ' ' + moment(this.state.endDate).format("YYYY-MM-DD") + ` </b><br>
                       Resources:<b>` + this.state.selectedOption + `</b><br>
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
                // })
                // response.fail((e) => {
                //     console.log(e)
                // })


            }
        })
    }

    //#region save data(api)


    saveProjectResourceAPI(tempData) {
        var ResourcesData = JSON.stringify(tempData);
        //console.log(resourcesApi)

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
          //  this.sendProjectMail();
            this.setState({ redirectToList: true });
            toast.success("Project " + Notification.saved, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
        res.fail((error) => {

        })
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
          //  console.log(this.state.selectedOption)
            this.saveProjectResource(response.insertId, this.state.selectedOption);
        })
        res.fail((error) => {

        })
    }


    saveDetailsProject() {
        // alert(1)
        var isvalidate = window.formValidation("#projectform");
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
        // const resourcesApi = environment.apiUrl + moduleUrls.ProjectResources + '?_where=(projectId,eq,' + this.state.projectId + ')' ;
        //console.log(resourcesApi)
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


    updateProjectResource(projectId, userData) {
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
            toast.success("Project " + Notification.saved, {
                position: toast.POSITION.TOP_RIGHT
            });
        })
        res.fail((error) => {

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


    updateProjectDetails(updateData) {
        // var updateData = JSON.stringify(updateData);
        var res = this.updateProjectDetailsAPI(updateData);
        res.done((response) => {
            this.updateProjectResource(this.state.projectId, this.state.selectedOption);
        })
        res.fail((error) => {
        })

        // this.updateProjectAPI(updateData);
    }


    updateDetailsAPI(updateData) {
        var isvalidate = window.formValidation("#projectform");
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
                    this.updateProjectDetails(TempData);
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
    //#endregion

    //#region  onchange for resources Data

    onChangeResources(event) {
        this.setState({
            resources: event.target.value
        })
    }


    getResourcesData() {
    
        var output = [];
        const endpointGET = environment.apiUrl + moduleUrls.User + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {

                var temp = temp.responseJSON;
                //   var displayDataReturn = temp.map((i) => {
                    $(temp).each((e, item) => {
                        var singleObjId = {
                            value: item.userId,
                            label: item.userName
                        };
                        options.push(singleObjId);
                    }
                        // output.push('<option value="'+ key +'">'+ value +'</option>')

                        // <option key={i.userId} value={i.userId}>{i.userName}</option>
                    )
                    this.setState({
                        ResourceOptions:options
                    })

                   
                // });
                //         console.log(options)
                // this.setState({
                //     displayResources: displayDataReturn
                // })
            },
        });
    }
    //#endregion

    //#region onchange for Managed By  Data from user page


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
                        <option key={i.userId} value={i.userId}>{i.firstName} {i.lastName}</option>
                    )
                });
                this.setState({
                    displayManageBy: displayDataReturn
                })
            },
        });
    }
    //#endregion



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
                            var found_names = $.grep(this.state.ResourceOptions, function(v) {
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
           
        } else {
        }
    }


    render() {
        //   const { selectedOption } = this.state;

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
                                        <label className="required" htmlFor="startDate">Start Date</label><br></br>
                                        <DatePicker className="form-control" name="startDate"
                                            selected={this.state.startDate}
                                            onChange={(e) => {
                                                this.setState({
                                                    startDate: moment(e).format("")
                                                })
                                            }}//only when value has changed

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

                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <label >Complexity</label>
                                    <select required name="complexitydropdown" className="form-control" htmlFor="complexityId" onChange={(e) => { this.onChangeComplexityMaster(e) }} value={this.state.complexityId}  >
                                        <option defaultValue="">select</option>
                                        {this.state.displayComplexityId}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label>Project Status</label>
                                    <select required name="projectStatusdropdown" className="form-control" value={this.state.status}  >
                                        <option defaultValue="">select</option>
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
                                            <option defaultValue="">select</option>
                                            {this.state.displayManageBy}
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <label>Resources</label>
                                    <Select isMulti name="resources" id="mySelect"
                                        onChange={(event) => {
                                            this.setState({
                                                resources: event.target.value
                                            })
                                        }}
                                        value={this.state.selectedOption}
                                        onChange={this.handleChange}
                                        options={this.state.ResourceOptions}
                                    />
                                    {/* <select multiple id className="chosen-select" required name="resourcesdropdown" className="form-control"
                                        onChange={(e) => { this.onChangeResources(e) }}>
                                    <option value="">select</option>                                      
                                        {this.state.displayResources}
                                    </select> */}
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
                                                this.saveDetailsProject(this.state);
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
