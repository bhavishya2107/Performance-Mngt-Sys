import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox'
$.DataTable = require('datatables.net-bs4');
var moment = require('moment');

class Template extends Component {

    constructor(props) {
        super(props);
        this.state = {
            templateName: "",
            assignedUser: "",
            project: "",
            projectDate: "",
            status: "",
            assignId: ""

        }
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
    //#region single Delete template confirm

    singleDeleteTemplateConfirm(id) {
        if (id !== undefined) {
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
                        this.singleDeleteTemplate(id);
                    }
                    else {

                    }
                }
            });
        }
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
    //#endregion
    //#region multiple delete functionality
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
    multipleTemplateDeleteApi(assignId) {
        var url = environment.apiUrl + moduleUrls.Template_assignment_master + '/bulk?_ids=' + `${assignId}`;
        return $.ajax({
            url: url,
            type: Type.deletetype
        })
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
    componentDidMount() {
        const url = environment.dynamicUrl + 'dynamic';
        this.$el = $(this.el);
        this.$el.DataTable({
            "sorting": [[0, 'asc']],
            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.post,
                data: {
                    query: "SELECT TAM.assignId,UM.firstName,Um.lastname, PM.projectName,PM.startDate,PM.endDate,PM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy"
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
                    data: "templateName",
                    targets: 1,
                },
                {
                    data: "firstName",
                    targets: 2,
                    
                },
                {
                    data: "projectName",
                    targets: 3,
                },
                {
                    data: "startDate",
                    targets: 4,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format("DD-MM-YYYY")}</label>` + "- " +
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "status",
                    targets: 5,
                },
                {
                    data: "assignId",
                    targets: 6,
                    render: function (data, type, row) {
                        return (
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="/EditTemplate/assignId=' + row.assignId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
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
                        <Link to={{ pathname: '/addAssignTemplate' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteTemplateConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>

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
export default Template;