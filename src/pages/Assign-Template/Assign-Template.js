import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox'
$.DataTable = require('datatables.net-bs4');
var moment = require('moment');
var _datatableControl;
class AssignTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            templateName: "",
            assignedUser: "",
            project: "",
            projectId: "",
            projectDate: "",
            status: "",
            assignId: "",
            firstName: "",
            lastName: "",
            selectedIds: [],
            displayProjectData: [],
            userId: "",
            statusId: "",
            status: "",
            quaterName: "",
            first: ""
        }
    }
    //#region events
    onChangeProject(event) {
        this.setState({
            projectId: event.target.value
        });
    }
    onChangeUser(event) {
        this.setState({
            userId: event.target.value,
        })
    }
    onChangeStatus(e) {
        this.setState({
            status: e.currentTarget.value
        })
    }

    //#endregion
    //#region methods
    clear() {
        this.setState({
            userId: "",
            projectId: "",
            status: ""
        })
    }

    searchUser() {
          const url = environment.dynamicUrl + 'dynamic';

        var dynamicQuery = "SELECT TAM.assignId,q.quaterName,UM.firstName,Um.lastName, PM.projectName,TAM.startDate,TAM.endDate,TAM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = TAM.userid JOIN quater_master as q on q.quaterId=TAM.quaterId where 1=1";
        
        if(this.state.userId != ''){
            dynamicQuery += " and TAM.userId = " + this.state.userId;
        }

        if(this.state.projectId != ''){
            dynamicQuery += " and TAM.projectId = " + this.state.projectId;
        }

        if(this.state.status != ''){
            dynamicQuery += " and TAM.status = " + this.state.status;
        }

        dynamicQuery += " ORDER BY TAM.assignId DESC";


        $("#tblTemplateAssigned").dataTable().fnDestroy();
        $("#tblTemplateAssigned").dataTable({

            ajax: {
                url: url,
                type: Type.post,
                data: {
                    "query": dynamicQuery
                },
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "assignId",
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="assignId" value="' + row.assignId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    orderable: false
                },
                {
                    data: "quaterName",
                    targets: 1,
                },
                {
                    data: "templateName",
                    targets: 2,
                },
                {
                    data: "firstName",
                    targets: 3,
                    render: (data, type, row) => {
                        this.setState({
                            first: row.firstName
                        })
                        return (

                            `<label className="getUserName" id="firstName" value=>${row.firstName}` + " " +
                            `<label className="getUserName" id="lastName" value=>${row.lastName}`
                        )
                    }
                },
                {
                    data: "projectName",
                    targets: 4,

                },
                {
                    data: "startDate" + "endDate",
                    targets: 5,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format('DD-MM-YYYY')}</label>` + " - " +
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "status",
                    targets: 6,
                },
                {
                    data: "assignId",
                    targets: 7,
                    render: function (data, type, row) {
                        if ({ status: "Created by HR" }) {
                            return (
                                '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="Assign-Template/edit/id=' + row.assignId + '"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
                                '<a href="#" id="' + row.assignId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" ><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                                '<a href="#"  class="btn mr-2 btnMail btn-info btn-sm" ' + row.assignId + '" ><i  class="fa fa-envelope" aria-hidden="true""></i></a>'
                            );
                        }
                        else {
                            return (
                                '<a href="#" id="' + row.assignId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" ><i class="fa fa-trash" aria-hidden="true"></i></a>'
                            );
                        }
                    },
                    "orderable": false,
                    "bDestroy": true
                }
            ],
            initComplete: (settings, json) => {
            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.singleDeleteTemplateConfirm(e.currentTarget.id);
                });
                $(".btnMail").on("click", e => {
                    this.sendAssignTemplateMail(e.currentTarget.id);
                });
            }
        });
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
    getUserData() {
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.userId}` 
        this.getDropDownValues(url).done(
            (tempUser) => {
                var displayUserDataReturn = tempUser.map(function (i) {
                    return (
                        <option key={i.userId} value={i.userId}>{i.userName}</option>
                    )
                });
                this.setState({
                    displayUserData: displayUserDataReturn
                })
            })
    }

    getDropDownValues(url) {
        return $.ajax({
            url: url,
            type: Type.get
        })
    }
    //#endregion
    //#region single Delete & multi Delete Assign-Template confirm
    singleDeleteTemplateConfirm(id) {
        if (id !== undefined) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
                buttons: {
                    confirm: {
                        label: 'ok',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.singleDeleteTemplate(id);
                    }
                    else {

                    }
                }
            });
        }
    }
    multipleDeleteTemplateConfirm() {
        var assignId = []
        $("#tblTemplateAssigned input:checkbox:checked").each((e, item) => {
            if (item.value !== 2) {
                if (item.name !== "checkAll") {
                    assignId.push(item.value);
                }
            }
        });
        if (assignId.length > 0) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
                buttons: {
                    confirm: {
                        label: 'ok',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.multiDeleteTemplate(assignId);
                    }
                    else {
                    }
                },
            });
        }
        else {
            toast.info(Notification.deleteInfo)
        }
    }
    //#endregion
    //#region  Single and multiple delete functionality
    singleDeleteTemplate(assignId) {
        var res = this.DeleteTemplateApi(assignId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Template " + Notification.deleted);
            }
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {
            toast.error(Notification.deleteError);
        });
    }
    multiDeleteTemplate(assignId) {
        $("#tblTemplateAssigned input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        var item = assignId.join(",") //for deleting multiple user
        var res = this.multipleTemplateDeleteApi(item);
        res.done(response => {
            toast.success("Template " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload()
        });

        res.fail(error => {

        });
    }
    checkall(e) {
        $("#tblTemplateAssigned input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    //#region   Ajax call
    DeleteTemplateApi(assignId) {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${assignId}`
        return $.ajax({
            url: url,
            type: Type.deletetype,
            dataSrc: "",
            error: function (xhr, status, error) {

            },
        });
    }
    multipleTemplateDeleteApi(assignId) {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/bulk?_ids=' + `${assignId}`;
        return $.ajax({
            url: url,
            type: Type.deletetype
        })
    }
    //#endregion
    //#region mail
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
    sendAssignTemplateMail() {
        const url = environment.dynamicUrl + 'dynamic';
        return $.ajax({
            url: url,
            type: Type.post,
            data: {
                query: "SELECT TAM.assignId,q.quaterName,UM.firstName,Um.lastName, PM.projectName,TAM.startDate,TAM.endDate,TAM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = TAM.userid JOIN quater_master as q on q.quaterId=TAM.quaterId  where TAM.projectId=TAM.projectid and TAM.userid=TAM.userId and TAM.status=TAM.status ORDER BY TAM.assignId DESC"
            },
            success: (res) => {
                var emailBody =
                    `<html>
                    <body>
                    <p>Hello `+ res[0].firstName.charAt(0).toUpperCase() + res[0].firstName.slice(1) + ' ' + res[0].lastName.charAt(0).toUpperCase() + res[0].lastName.slice(1) + `,  </p>`;
                emailBody += `
                KRA sheet assigned to you for project ` + `"` + res[0].projectName + `"` + ` ,
                you have worked on ` + res[0].quaterName + `  
                ` + `
                from` + " " + moment(res[0].startDate).format("DD-MM-YYYY") + ' ' + `to` + ' ' + moment(res[0].endDate).format("DD-MM-YYYY") + `
                    </p>Please fill your sheets as soon as possible.        
                    <p>Thanks,</p>
                    <p>PSSPL ADMIN</p>
                </body>
                </html>`;
                var body =
                {
                    emailSubject: "KRA sheet for" + ' ' + res[0].quaterName + '-' + `PMS`,
                    emailBody: emailBody,
                    toemailadress: "janmeshnayak1997@gmail.com"
                }
                // Prashant.Khanderia@prakashinfotech.com
                this.sendMailAPI(body);
                toast.success("" + Notification.EmailSent);
            }
        })
    }
    //#endregion
    componentDidMount() {
        this.getProjectData()
        this.getUserData()
        const url = environment.dynamicUrl + 'dynamic';
        
        var dynamicQuery = "SELECT TAM.assignId,q.quaterName,UM.firstName,Um.lastName, PM.projectName,TAM.startDate,TAM.endDate,TAM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = TAM.userid JOIN quater_master as q on q.quaterId=TAM.quaterId ORDER BY TAM.assignId DESC";

        this.$el = $(this.el);
        _datatableControl = this.$el.DataTable({

            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.post,
                data: {
                    "query": dynamicQuery
                },
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "assignId",
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="assignId" value="' + row.assignId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    orderable: false
                },
                {
                    data: "quaterName",
                    targets: 1,
                },
                {
                    data: "templateName",
                    targets: 2,
                },
                {
                    data: "firstName",
                    targets: 3,
                    render: (data, type, row) => {
                        this.setState({
                            first: row.firstName
                        })
                        return (
                            `<label className="getUserName" id="firstName" value=>${row.firstName}` + " " +
                            `<label className="getUserName" id="lastName" value=>${row.lastName}`
                        )
                    }
                },
                {
                    data: "projectName",
                    targets: 4,

                },
                {
                    data: "startDate" + "endDate",
                    targets: 5,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format('DD-MM-YYYY')}</label>` + " - " +
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "status",
                    targets: 6,
                },
                {
                    data: "assignId",
                    targets: 7,
                    render: function (data, type, row) {
                        if ({ status: "Created by HR" }) {
                            return (
                                '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="Assign-Template/edit/id=' + row.assignId + '"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
                                '<a href="#" id="' + row.assignId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" ><i class="fa fa-trash" aria-hidden="true"></i></a>' +
                                '<a href="#"  class="btn mr-2 btnMail btn-info btn-sm" ' + row.assignId + '" ><i  class="fa fa-envelope" aria-hidden="true""></i></a>'
                            );
                        }
                        else {
                            return (
                                '<a href="#" id="' + row.assignId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" ><i class="fa fa-trash" aria-hidden="true"></i></a>'
                            );
                        }
                    },
                    "orderable": false
                }
            ],
            initComplete: (settings, json) => {
            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.singleDeleteTemplateConfirm(e.currentTarget.id);
                });
                $(".btnMail").on("click", e => {
                    this.sendAssignTemplateMail(e.currentTarget.id);
                });
            }
        });
    }
    render() {
        return (
            <div>
                <div className="mb-1 row mt-3 page-title">
                    <h2 className="col"> {ModuleNames.Template}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/assign-template/add' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                </div>

                <div className="clearfix mt-3 mb-2 row filter-delete">

                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="userDropDown" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control" >
                            <option value="">Select user</option>
                            {this.state.displayUserData}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="projectDropDown" onChange={(e) => { this.onChangeProject(e) }} value={this.state.projectId} className="form-control" >
                            <option value="">Select Project</option>
                            {this.state.displayProjectData}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="projectStatusdropdown" className="form-control" value={this.state.status}
                            onChange={(e) => { this.onChangeStatus(e) }} value={this.state.status}  >
                            <option value="">Select Status </option>
                            <option value="1"> Created by Hr</option>
                            <option value="2">Assigned Employee</option>
                            <option value="3"> Draft by Employee</option>
                            <option value="4">Submit by Employee</option>
                            <option value="5">Draft by Reviewer</option>
                            <option value="6">Submit by Reviewer</option>
                            <option value="7">Reverted to employee by HR</option>
                            <option value="8">Reverted to reviewer by HR</option>
                            <option value="9">Approved by HR</option>
                            {this.state.displayProjectStatus}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-2">
                        <button type="button" className="btn btn-info mr-2" onClick={() => { this.clear(); }}><i className="fa fa-times"></i></button>
                        <button id="searchButton" type="button" className="btn btn-success" onClick={() => { this.searchUser() }}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>

                    <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteTemplateConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>

                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblTemplateAssigned"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th width="10">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="checkAll"
                                        onClick={e => { this.checkall(e) }} />
                                    <i></i>
                                </label>
                            </th>
                            <th width="100">Quater</th>
                            <th width="100">Template Name</th>
                            <th width="100">Assigned Users</th>
                            <th width="100" >Project</th>
                            <th width="100">Worked Date</th>
                            <th width="100">Status</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div>
        )
    }
}
export default AssignTemplate;