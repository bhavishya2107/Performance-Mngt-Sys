import React, { Component } from 'react';
import { environment, Type } from './Environment';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Myteam extends Component {
    //#region HR Data table
    hrApiDatatable() {
        var HR = {
            "query": `SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,pm.status,tam.assignId,um.firstName,um.lastName,qm.quaterName
    FROM template_assignment_master tam
    JOIN project_master pm ON tam.projectId = pm.projectId
    JOIN user_master um ON um.userId = tam.userId
    JOIN quater_master as qm ON qm.quaterId = TAM.quaterId`
        }
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
                data: HR
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
                            "</a>"
                        )
                    }
                }
            ]
        });
    }
    //#endregion

    //#region TPM Data table
    tpmApiDatatable() {
        var TPM = {
            "query": `SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,pm.status,tam.assignId,um.firstName,um.lastName,qm.quaterName
                    FROM template_assignment_master tam
                    JOIN project_master pm ON tam.projectId = pm.projectId
                    JOIN user_master um ON um.userId = tam.userId
                    JOIN quater_master as qm ON qm.quaterId = TAM.quaterId
                    WHERE pm.manageBy = ${localStorage.getItem('userId')}`
        }
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
                            "</a>"
                        )
                    }
                }
            ]
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
                            <th width="100">Start Data</th>
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