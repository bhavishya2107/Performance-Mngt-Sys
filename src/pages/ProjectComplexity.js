import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { environment } from './Environment';
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
    SingleDelete(projectId) {
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
                        this.SingleDelete(id);
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
                    data: "projectTypeName",
                    targets: 0
                },
                {
                    data: "description",
                    targets: 1,
                    orderable: false
                },
                {
                    data: "projectTypeId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditProjectComplexity/id=' + row.projectTypeId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.projectTypeId + '"class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],
            //#endregion 

            //#region detete function id
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
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
                  <div className="clearfix text-right mb-2">
                    <Link to={{ pathname: '/AddProjectComplexity', }} className="btn btn-lg btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}></Link>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th width="90">Action</th>

                            </tr>
                        </thead>
                        <tbody></tbody>
                        <ToastContainer />
                    </table>
                </div>
            </div>
            //#endregion
        )
    }
}
export default ProjectComplexity;
