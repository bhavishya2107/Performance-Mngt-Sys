import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { environment, Type, moduleUrls, Notification } from '../Environment';
import bootbox from 'bootbox';

import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class ProjectComplexity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveProjectComplexityDetails: "",
            selectedIds: []
        };
    }

    //#region Delete functionality with single and multiple both
    DeleteProjectComplexityApi(projectId) {
        const endpoint = environment.apiUrl + moduleUrls.ProjectComplexity + '/' + `${projectId}`;
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
                    this.SingleDeleteProjectComplexity(id);
                }
                else {

                }
            }
        });

    }
    SingleDeleteProjectComplexity(projectTypeId) {
        var res = this.DeleteProjectComplexityApi(projectTypeId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Project Complexity " + Notification.deleted, {
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
    multiDeleteProjectComplexityApi(projectTypeId) {
        const endpoint = environment.apiUrl + moduleUrls.ProjectComplexity + `/bulk?_ids=${projectTypeId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteProjectComplexity(projectTypeId) {
        var item = projectTypeId.join(",")
        var res = this.multiDeleteProjectComplexityApi(item);
        res.done((response) => {
            toast.success("Project Complexity " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
        });

    }
    multipleDeleteProjectComplexityConfirm() {
        var projectTypeId = []
        $("#tblProjectComplexity input:checkbox:checked").each((e, item) => {
            if (item.name != 'checkAll') {
                projectTypeId.push(item.value);
            }
        });
        if (projectTypeId.length > 0) {
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
                        this.multiDeleteProjectComplexity(projectTypeId);
                    }
                    else {
                    }
                }
            });
        }
        else {
            toast.info("please select atleast one record!");
        }
    }
    //#endregion

    checkall(e) {
        $("#tblProjectComplexity input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }

    componentDidMount() {
        //#region datatable 
        const endpointGET = environment.apiUrl + moduleUrls.ProjectComplexity + '/' + '?&_sort=-projectTypeId'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            // aaSorting: [[2, 'asc']],
            ajax: {
                url: endpointGET,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "projectTypeId",
                    "orderable": false,
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<input type="checkbox" name="kpiId" value=' + row.projectTypeId + ' />'
                        )
                    },
                },
                {
                    data: null,
                    targets: 1,
                    "orderable": false,
                },
                {
                    data: "projectTypeName",
                    targets: 2
                    
                },
                {
                    data: "description",
                    targets: 3,
                    "orderable": false,
                },
                {
                    data: "projectTypeId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/project-complexity/edit/id=' + row.projectTypeId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.projectTypeId + '"class="btn btn-danger btnDelete btn-sm";"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $("td:eq(1)", nRow).html(iDisplayIndex + 1);
                return nRow;
            },
            //#endregion 

            //#region detete function id
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            },
        });
    }
    //#endregion
    render() {
        return (
            //#region ProjectComplexity table(listed items)
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">Project Complexity</h2>
                    <div className="col text-right">
                        <Link to="/project-complexity/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.multipleDeleteProjectComplexityConfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblProjectComplexity"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th width="5"><input type="checkbox" name="checkAll" onClick={(e) => { this.checkall(e); }}></input></th>
                                <th width="5">Sr.No</th>
                                <th width="100">Project Name</th>
                                <th>Description</th>
                                <th width="100">Action</th>

                            </tr>
                        </thead>
                        <tbody></tbody>

                    </table>
                    <ToastContainer />
                </div>
            </div>
            //#endregion
        )
    }
}
export default ProjectComplexity;
