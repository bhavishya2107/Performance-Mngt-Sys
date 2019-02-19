import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');


class Projects extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            selectedIds: []
        }
    }

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
            if (item.name != 'checkAll') {
                ProjectId.push(item.value);
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
    //#endregion

    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/project_master",
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "projectId",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<input type="checkbox" name="projectId" value=' + row.projectId + ' />'
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

                },
                {
                    data: "endDate",
                    targets: 3,

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
                            '<a href="/projects/editprojects/id=' + row.projectId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
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
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    ;
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    ;
                    this.SingleDelete(e.currentTarget.id);
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
    render() {
        return (
            <div >
            <div className="clearfix d-flex align-items-center row page-title">
                <h2 className="col"></h2>
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
                        <tr>
                            <th width="5"><input type="checkbox" name="checkAll" onClick={(e) => { this.checkall(e); }}></input></th>
                           
                            <th width="100">Project Name</th>
                            <th width="80">Start Date</th>
                            <th width="80">End Date</th>
                            <th width="100">Complexity</th>
                            <th width="20">Action</th>
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