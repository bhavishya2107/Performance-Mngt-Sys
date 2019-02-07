import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { environment } from '../Environment';
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
    //#region Delete Kpi function
    SingleDeleteProjectComplexity(projectId) {
        var res = this.DeleteKpiApi(projectId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Record Deleted Succesfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {

        });
    }
    DeleteKpiApi(projectId) {
        const endpoint = `http://180.211.103.189:3000/api/project_type_master/${projectId}`;
        return $.ajax({
            url: endpoint,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    checkall(e) {
        $("#tblProjectComplexity input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }

    //#endregion

    //#region datatable 
    componentDidMount() {
        $(document).on("click", ".confirmDelete", (e) => {
            var id = e.currentTarget.id;
            bootbox.confirm({
                message: "Delete this record ?",
                buttons: {
                    confirm: {
                        label: 'OK',
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
        });


        this.$el = $(this.el);
        var apiUrl = environment.apiUrl + "project_type_master";
        this.$el.DataTable({
            ajax: {
                url: apiUrl,
                type: "GET",
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
                            '<input type="checkbox" name="kpiId" value=' + row.projectTypeId + '" />'
                        )
                    },
                },
                {
                    data: "projectTypeName",
                    targets: 1
                },
                {
                    data: "description",
                    targets: 2,
                    orderable: false
                },
                {
                    data: "projectTypeId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/project-complexity/edit/id=' + row.projectTypeId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '</a>' +
                            '<a href="#" id="' + row.projectTypeId + '"class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            '</a>'
                        )
                    },
                    orderable: false
                }
            ],
            //#endregion 

            //#region detete function id
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteProjectComplexity(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteProjectComplexity(e.currentTarget.id);
                });
            }
        });
    }
    //#endregion
    render() {
        return (
            //#region ProjectComplexity table(listed items)
            <div>
                <h1>Project Complexity</h1>
                {this.props.location.state === "2222"}
                <button type="button" className="btn mr-2 delete btn-danger fa fa-trash" style={{ float: "left" }} onClick={() => { this.multipleDeleteKPI(); }}></button>
                    <Link to={{ pathname:'/project-complexity/add', }} className="btn btn-lg btn-primary fa fa-plus" style={{float: "Right" }}></Link>
                <div className="clearfix text-right mb-2">
             
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblProjectComplexity"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th width="20"><input type="checkbox" onClick={(e) => { this.checkall(e); }}></input></th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th width="90">Action</th>

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
