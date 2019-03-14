import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox'
$.DataTable = require('datatables.net-bs4');
var moment = require('moment');

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
            lastname: "",
            selectedIds: [],
            displayProjectData: [],
            userId: "",
            statusId: ""
        }
    }
    clear() {
        this.setState({
            userId: "",
            projectId: "",
            statusId: ""
        })
    }
    searchUser() {


        /*debugger
        alert(this.state.firstName)
        $(document).ready(function () {
            $("#tblTemplateAssigned").on("click", function () {
                var value = $(this).val().toLowerCase();
                $("#firstName ").filter(function () {
                    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
            });
        });*/

        //     var table = $('#tblTemplateAssigned').DataTable();

        //     // #column3_search is a <input type="text"> element
        //     $('#firstName').on('click', function () {
        //         table
        //             .columns('.getUserName')
        //             .search(this.state.firstName)
        //             .draw();
        //     });
    }
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
    //#region single delete for assign_template
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
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
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
    //#region multiple delete functionality
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
    componentDidMount() {
        this.getProjectData()
        this.getUserData()


        const url = environment.dynamicUrl + 'dynamic';
        this.$el = $(this.el);
        this.$el.DataTable({
            // "sorting": [[0, 'asc']],
            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.post,
                data: {
                    query: "SELECT TAM.assignId,q.quaterName,UM.firstName,Um.lastname, PM.projectName,TAM.startDate,TAM.endDate,PM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = TAM.userid JOIN quater_master as q on q.quaterId=TAM.quaterId  ORDER BY TAM.assignId DESC"
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
                            '<input type="checkbox" name="assignId" value=' + row.assignId + ">"
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
                        return (

                            `<label className="getUserName" id="firstName" value=>${row.firstName}` + " " +
                            `<label className="getUserName" id="lastName" value=>${row.lastname}`
                        )
                    }
                },
                {
                    data: "projectName",
                    targets: 4,
                },
                {
                    data: "startDate",
                    targets: 5,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format('DD-MM-YYYY')}</label>` + "- " +
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
                        return (
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="Assign-Template/edit/id=' + row.assignId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
                            '<a href="#" id="' + row.assignId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" href="javascript:void(0);" ">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
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
            }
        });
    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> {ModuleNames.Template}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/assign-template/add' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteTemplateConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>

                </div>

                <div className="col-sm-2">

                    <select required name="userDropDown" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control" >
                        <option value="">Select user</option>
                        {this.state.displayUserData}
                    </select>


                    <select required name="projectDropDown" onChange={(e) => { this.onChangeProject(e) }} value={this.state.projectId} className="form-control" >
                        <option value="">Select Project</option>
                        {this.state.displayProjectData}
                    </select>

                    <select required name="statusDropDown" onChange={(e) => { this.onChangeStatus(e) }} value={this.state.statusId} className="form-control" >
                        <option value="">Select status</option>
                        {this.state.displayStatusData}
                    </select>



                    {/* <input type="text" className="form-control" id="getUserName" onChange={(e) => { this.onChangeSearchUser(e) }}
                        placeholder="search User" value={this.state.firstName} /> */}
                    {/* <input type="text" className="form-control" onChange={(e) => { this.onChangeSearchProject(e) }}
                        placeholder="search project" value={this.state.project} /> */}
                    {/* <input type="text" className="form-control" onChange={(e) => { this.onChangeSearchStatus(e) }}
                        placeholder="search status" value={this.state.status} /> */}

                    <button type="button" className="btn btn-info mr-2" onClick={() => { this.clear(); }}>Clear</button>

                    <button id="searchButton" type="button" className="btn btn-sm btn-success" onClick={() => { this.searchUser() }}>
                        <i className="fa fa-search">Search</i>
                    </button>
                </div>

                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblTemplateAssigned"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th width="10">
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => { this.checkall(e) }} />
                            </th>
                            <th width="100">Quater</th>
                            <th width="100">Template Name</th>
                            <th width="100">Assigned Users</th>
                            <th width="100" >Project</th>
                            <th width="100">Project Date</th>
                            <th width="100">Status</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>


                <ToastContainer />
            </div >

        )
    }
}
export default AssignTemplate;