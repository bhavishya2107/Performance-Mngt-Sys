import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, moduleUrls, Type, Notification, ModuleNames } from './Environment';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: props.match.params.userId,
            status: "",
            assignId: "",
        }
    }

    onChangeStatus = (assignId) => {
        this.tpmStatusUpdateAPI(assignId);
        this.hrstatusUpdateAPI(assignId);
        this.developerStatusUpdateAPI(assignId);
         window.location.reload();
       
    }

    hrstatusUpdateAPI(assignId) {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET status='Submit by Employee'
              where status='Assigned to Employee'and assignId=${assignId}`
        }
        return $.ajax({
            url: statusUpdate,
            type: Type.post,
            data: JSON.stringify(statusUpdateQuery),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    tpmStatusUpdateAPI(assignId) {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET status='Approved by HR'
              where status In('Draft by Reviewer','Submit by Employee','Reverted to reviewer by HR')and assignId=${assignId}`
        }
        return $.ajax({
            url: statusUpdate,
            type: Type.post,
            data: JSON.stringify(statusUpdateQuery),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }

    developerStatusUpdateAPI(assignId) {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET TAM.status='Submit by Employee'
              where status In('Assigned to Employee','Draft by Employee','Reverted to employee by HR ')and assignId=${assignId}`

        }
        return $.ajax({
            url: statusUpdate,
            type: Type.post,
            data: JSON.stringify(statusUpdateQuery),
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
    componentWillMount() {

        if (localStorage.getItem('roleName') == "HR") {
            this.hrstatusUpdateAPI()
        }
        else if (localStorage.getItem('roleName') == "TPM") {
            this.tpmStatusUpdateAPI()
        }
        else {
            this.developerStatusUpdateAPI()
        }
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
                    "query": `SELECT TAM.assignId, TAM.status, PM.projectName,PM.startDate,PM.endDate,PMM.quaterName 
                    FROM template_master as TM 
                    JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId
                    JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy 
                    JOIN quater_master as PMM ON PMM.quaterId = TAM.quaterId 
                    where TAM.userId='${localStorage.getItem('userId')}' 
                    AND TAM.status IN('Assigned to Employee','Draft by Employee','Submit by Employee',
                    'Reverted to employee by HR')` }
            },
            columns: [ 
                {
                    data: "quaterName" + "projectName",
                    targets: 0,
                    render: (data, type, row) => {

                        this.setState({
                            assignId: row.assignId
                        })
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
                    targets: 3,
                    render: (data, type, row) => {
                        return (
                            `<label id="status" class="statusRow" value="${row.status}">${row.status}</label>`
                        )
                    },
                },

                {
                    data: "assignId",
                    targets: 4,
                    "orderable": false,
                    render: function (data, type, row) {

                        return (
                            '<a href="/kraSheetDetails/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.assignId + '"class="btn btnSubmit btn-info btn-sm";"">' +
                            '<i class="fa fa-retweet" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                }
            ],
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnSubmit").on("click", e => {
                    this.onChangeStatus(e.currentTarget.id);
                });
                $(document).ready(function () {
                    $(".dataTables_length").css("padding-left", "0px");
                });
            }

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
                            <th width="100">Start Date</th>
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