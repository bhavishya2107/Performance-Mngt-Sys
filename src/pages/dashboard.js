import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, Type } from './Environment';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Dashboard extends Component {
    componentWillMount() {
        $(document).ready(function () {
            $(".dataTables_length").css("padding-left", "0px");
        });
    }
    componentDidMount() {
        const myKRAUrl = environment.dynamicUrl + 'dynamic' + '/?_size=1000'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: myKRAUrl,
                type: Type.post,
                dataSrc: "",
                data: {
                    "query": `SELECT TAM.assignId, PM.projectName,PM.startDate,PM.endDate,PM.status,PMM.quaterName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy JOIN quater_master as PMM ON PMM.quaterId = TAM.quaterId  where TAM.userId='${localStorage.getItem('userId')}'`
                },

            },
            columns: [
                {
                    data: "quaterName" + "projectName",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            `<div>${(row.quaterName + " " + "-" + " " + row.projectName)}</div>`
                        )
                    },
                },
                {
                    data: "startDate",
                    targets: 1,
                    render: (data, type, row) => {
                        return (
                            `<label id="startDate" value=>${moment(row.startDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "endDate",
                    targets: 2,
                    render: (data, type, row) => {
                        return (
                            `<label id="endDate" value=>${moment(row.endDate).format("DD-MM-YYYY")}</label>`
                        )
                    },
                },
                {
                    data: "status",
                    targets: 3
                },

                {
                    data: "assignId",
                    targets: 4,
                    "orderable": false,
                    render: function (data, type, row) {
                        return (
                            '<a href="/kraSheetDetails/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                } 
            ]
        });
    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">My KRA</h2>
                </div>

                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblTemplate"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th width="100">KRA Sheet</th>
                            <th width="100">Start Data</th>
                            <th width="100">End Date</th>
                            <th width="100">Status</th>
                            <th width="50">Action</th>
                        </tr>
                    </thead>
                </table>
                <ToastContainer />
            </div>
        )
    }
}
export default Dashboard;