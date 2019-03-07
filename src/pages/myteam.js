import React, { Component } from 'react';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Myteam extends Component {

    componentDidMount() {
        debugger;
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: "http://192.168.10.110:3000/dynamic",
                type: "POST",
                dataSrc: "",
                data: {
                    "query": `SELECT UM.firstName,UM.lastName,UM.reportingManagerId,TAM.assignId, PM.projectName,PM.startDate,PM.endDate,PM.status,PMM.quaterName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy JOIN quater_master as PMM ON PMM.quaterId = TAM.quaterId where UM.reportingManagerId='${localStorage.getItem('userId')}'`
                },
            },

            columns: [
                {
                    data: "firstName",
                    targets: 0,

                },
                {
                    data: "lastName",
                    targets: 1,

                },
                {
                    data: "quaterName",
                    targets: 2,

                },
                {
                    data: "projectName",
                    targets: 3
                },
                {
                    data: "startDate",
                    targets: 4,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "endDate",
                    targets: 5,
                    render: (data, type, row) => {
                        return (
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "status",
                    targets: 6
                },

                {
                    data: "assignId",
                    targets: 7,
                    "orderable": false,
                    render: function (data, type, row) {
                        ;
                        return (
                            '<a href="/kraSheetDetails/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>"

                        )
                    }
                }
            ],
            initComplete: (settings, json) => {

            },
            drawCallback: (settings) => {

            }
        });

    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">My Team</h2>


                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblTemplate"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th width="100">Project</th>
                            <th>Start Data</th>
                            <th width="100">End Date</th>
                            <th>Status</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                </table>

            </div>
        )
    }
}
export default Myteam;