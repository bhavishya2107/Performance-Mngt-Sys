import React, { Component } from 'react';
import { environment, Type } from './Environment';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Myteam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignId:""
        }
    }
    onChangeTlStatus = (e) => {
        this.tlstatusUpdateAPI();
        window.location.reload();
    }

    tlstatusUpdateAPI() {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET status='Submit by Reviewer' 
            where status='Submit by Employee' and assignid=206 `

            // query: `Update template_assignment_master tam SET status='Submit by Employee' 
            // where status='Submit by Reviewer'  `
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

    onChangeHrStatus = (e) => {
        this.hrstatusUpdateAPI();
        window.location.reload();
    }

    hrstatusUpdateAPI() {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET status='Created by HR' 
            where status='Assigned to Employee' and assignid=195 `

            // query: `Update template_assignment_master tam SET status='Created by HR' 
            // where status='Assigned to Employee' `
            
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


    //#region HR Data table
    hrApiDatatable() {
        var HR = {
            "query": `SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,tam.status,tam.assignId,um.firstName,um.lastName,qm.quaterName
    FROM template_assignment_master tam
    JOIN project_master pm ON tam.projectId = pm.projectId
    JOIN user_master um ON um.userId = tam.userId
    JOIN quater_master as qm ON qm.quaterId = TAM.quaterId
    AND TAM.status IN('Assigned to Employee','Submit by Employee','Created by HR','Submit by Reviewer',
    'Reverted to employee by HR','Reverted to reviewer by HR','Approved by HR')`
        }
        const myTeamUrl = environment.dynamicUrl + 'dynamic' + '/?_size=1000'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: myTeamUrl,
                type: Type.post,
                dataSrc: "",
                data: HR
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
                    data: "firstName" + "lastName",
                    targets: 1,
                    render: (data, type, row) => {
                        return (
                            `<div>${(row.firstName + " " + row.lastName)}</div>`
                        )
                    },
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
                    data: "status",
                    targets: 4
                },
                {
                    data: "assignId",
                    targets: 5,
                    "orderable": false,
                    render: function (data, type, row) {
                        return (
                            '<a href="/kraSheetDetails/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#"  class="btn mr-2 btnSubmit btn-info btn-sm" ' + row.assignId + '" ><i  class="fa fa-save" aria-hidden="true""></i></a>'

                        )
                    }
                }
            ],
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnSubmit").on("click", e => {
                    this.onChangeHrStatus(e.currentTarget.id);
                });
            }
        });
    }
    //#endregion

    //#region TPM Data table
    tpmApiDatatable() {
        var TPM = {
            "query": `SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,tam.status,tam.assignId,um.firstName,um.lastName,qm.quaterName
                    FROM template_assignment_master tam
                    JOIN project_master pm ON tam.projectId = pm.projectId
                    JOIN user_master um ON um.userId = tam.userId
                    JOIN quater_master as qm ON qm.quaterId = TAM.quaterId
                     WHERE pm.manageBy = ${localStorage.getItem('userId')}
                    AND TAM.status IN('Submit by Employee','Reverted to reviewer by HR','Approved by HR')`
        }
        // "query": `SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,tam.status,tam.assignId,um.firstName,um.lastName,qm.quaterName
        // FROM template_assignment_master tam
        // JOIN project_master pm ON tam.projectId = pm.projectId
        // JOIN user_master um ON um.userId = tam.userId
        // JOIN quater_master as qm ON qm.quaterId = TAM.quaterId
        //  WHERE pm.manageBy = ${localStorage.getItem('userId')}`

        const myTeamUrl = environment.dynamicUrl + 'dynamic' + '/?_size=1000'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: myTeamUrl,
                type: Type.post,
                dataSrc: "",
                data: TPM
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
                    data: "firstName" + "lastName",
                    targets: 1,
                    render: (data, type, row) => {
                        return (
                            `<div>${(row.firstName + " " + row.lastName)}</div>`
                        )
                    },
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
                    data: "status",
                    targets: 4
                },
                {
                    data: "assignId",
                    targets: 5,
                    "orderable": false,
                    render: function (data, type, row) {
                        return (
                            '<a href="/TLKraSheet/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#"  class="btn mr-2 btnSubmit btn-info btn-sm" ' + row.assignId + '" ><i  class="fa fa-save" aria-hidden="true""></i></a>'

                        )
                    }
                }
            ],
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnSubmit").on("click", e => {
                    this.onChangeTlStatus(e.currentTarget.id);
                });
            }
        });
    }
    //#endregion

    componentWillMount() {
        $(document).ready(function () {
            $(".dataTables_length").css("padding-left", "0px");
        });
    }
    componentDidMount() {

        if (localStorage.getItem('roleName') == "HR") {
            this.hrApiDatatable()
        }
        else {
            this.tpmApiDatatable()
        }
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
                            <th width="100">KRA Sheet</th>
                            <th width="100">Employee Name</th>
                            <th width="100">Start Date</th>
                            <th width="100">End Date</th>
                            <th width="100">Status</th>
                            <th width="50">Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}
export default Myteam;