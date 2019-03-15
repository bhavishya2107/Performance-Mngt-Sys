import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

var moment = require('moment');

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],

        }
    }
//#region single and multiple delete with confirmation

    DeleteProjectApi(projectId) {
        const endpoint = environment.apiUrl + moduleUrls.Project + '/' + `${projectId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    SingleDeleteConfirm(id) {
        if (id !== undefined) {
            if (id != 98) {
                debugger;
                bootbox.confirm({
                    message: Notification.deleteConfirm,
                    buttons: {
                        confirm: {
                            label: 'Ok',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'Cancel',
                            className: 'btn-danger'
                        }
                    },
                    callback: (result) => {
                        if (result === true) {
                            this.SingleDeleteProject(id);
                        }
                        else {
                        }
                    }
                });
            }
            else {
                toast.error("Some of Project will not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    }

    SingleDeleteProject(kpiId) {
        var res = this.DeleteProjectApi(kpiId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Project " + Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            toast.error("Record Not Deleted", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }
    multiDeleteProjectApi(projectId) {
        const endpoint = environment.apiUrl + moduleUrls.Project + `/bulk?_ids=${projectId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteProject(projectId) {
        var item = projectId.join(",")
        var res = this.multiDeleteProjectApi(item);
        res.done((response) => {
            toast.success("Project " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
        });

    }
    multipleDeleteProjectconfirm() {
        var ProjectId = []
        $("#tblprojectform input:checkbox:checked").each((e, item) => {
            if (item.value != 98) {
                if (item.name != 'checkAll') {
                    ProjectId.push(item.value);
                }
            }
        });
        if (ProjectId.length > 0) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
                buttons: {
                    confirm: {
                        label: 'Ok',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.multiDeleteProject(ProjectId);
                    }
                    else {
                    }
                }
            });
        }
        else {
            toast.info(Notification.selectOneRecord);
        }
    }
  

    deleteProjectResource(resourceId) {
        const endpoint = environment.apiUrl + moduleUrls.ProjectResources + `/bulk?_ids=${resourceId}`;
        return $.ajax({ 
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });

    }
  //#endregion

    componentDidMount() {
        const endpointGET = environment.dynamicUrl + 'dynamic'

        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: endpointGET,
                type: "POST",
                dataSrc: "",
                data: {
                    query: "select project_master.projectId, project_master.projectName,project_master.startDate, project_master.endDate, project_master.complexityId, complexity_master.complexityName FROM project_master left join complexity_master On project_master.complexityId = complexity_master.complexityId order by projectId desc"
                },
            },
          //#region datatable
            columns: [
                {
                    data: "projectId",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="assignId" value="' + row.projectId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    "orderable": false,
                },
                {
                    data: "projectName",
                    targets: 1,
                },
                {
                    data: "startDate",
                    targets: 2,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "endDate",
                    targets: 3,
                    render: (data, type, row) => {
                        return (
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "complexityName",
                    targets: 4,
                },
                {
                    data: "projectId",
                    targets: 5,
                    render: function (data, type, row) {
                        return (
                            '<a href="/project/edit/id=' + row.projectId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.projectId + '"class="btn btn-danger btnDelete btn-sm";"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],
            // initComplete: (settings, json) => {
            //     $(".btnDelete").on("click", e => {
            //         ;
            //         this.SingleDelete(e.currentTarget.id);
            //     });
            // },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }
        });
    }
    checkall(e) {
        $("#tblprojectform input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    render() {
        return (
            <div >
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">Projects</h2>
                    <div className="col text-right">
                        <Link to="/projects/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.multipleDeleteProjectconfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblprojectform"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr className="container-fluid">
                            <th width="10">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="checkAll"
                                        onClick={e => { this.checkall(e) }} />
                                    <i></i>
                                </label>

                            </th>
                                <th width="100">Name</th>
                                <th width="100">Start Date</th>
                                <th width="100">End Date</th>
                                <th width="100">Complexity</th>
                                <th width="100">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <ToastContainer />
            </div>
        )
    }
}
export default Projects;