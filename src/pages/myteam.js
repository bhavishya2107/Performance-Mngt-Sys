import React, { Component } from 'react';
import { environment, Type, moduleUrls } from './Environment';
import { ToastContainer } from 'react-toastify';
var moment = require('moment');
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Myteam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            assignId: "",
            projectId: "",
            userId: "",
            quaterId: "",
            status:"",
            firstName:"",
            lastName:""
        }
    }

    //#region events 
    onChangeTlStatus = (assignId) => {
        this.tlstatusUpdateAPI(assignId);
        window.location.reload();
    }

    onChangeProject(event) {
        this.setState({
            projectId: event.target.value
        });
    }

    onChangeStatusDdl(e) {
        this.setState({
            status: e.currentTarget.value
        })
    }

    onChangeUser(event) {
        this.setState({
            userId: event.target.value,
        })
    }


    onChangeQuarter(event) {
        this.setState({
            quaterId: event.target.value,
        })
    }

    clear() {
        window.location.reload();
    }

    searchUser() {
        $(document).ready(function () {
            $(".dataTables_length").css("padding-left", "0px");
        });

        const myTeamUrl = environment.dynamicUrl + 'dynamic';

        var dynamicQuery = "SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,tam.status,tam.assignId,um.firstName,um.lastName,qm.quaterName FROM template_assignment_master tam JOIN project_master pm ON tam.projectId = pm.projectId JOIN user_master um ON um.userId = tam.userId JOIN quater_master as qm ON qm.quaterId = tam.quaterId  where 1=1";

        if (this.state.userId !== '') {
            dynamicQuery += " and tam.userId = " + this.state.userId;
        }

        if (this.state.projectId !== '') {
            dynamicQuery += " and tam.projectId = " + this.state.projectId;
        }

        if (this.state.status !== '') {
            dynamicQuery += " and tam.status = " + this.state.status;
        }

        if (this.state.quaterId !== '') {
            dynamicQuery += " and tam.quaterId = " + this.state.quaterId;
        }


        dynamicQuery += " ORDER BY TAM.assignId DESC";

        $("#tblTemplate").dataTable().fnDestroy();
        $.fn.dataTable.ext.errMode = 'throw';
        $("#tblTemplate").dataTable({
            ajax: {
                url: myTeamUrl,
                type: Type.post,
                dataSrc: "",
                data: {
                    "query": dynamicQuery
                },
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
                        if (localStorage.getItem('roleName') == "HR") {
                            return (
                                '<a href="/hrkrasheet/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                                '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                                "</a>"
                            )
                        } else {
                            return (
                                '<a href="/TLkrasheet/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                                '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                                "</a>" +
                                '<a href="#" id="' + row.assignId + '"class="btn btnSubmit btn-info btn-sm";"">' +
                                '<i class="fa fa-retweet" aria-hidden="true"></i>' +
                                "</a>"
                            )
                        }
                    },
                    "orderable": false,
                    "bDestroy": true
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
    tlstatusUpdateAPI(assignId) {
        var statusUpdate = environment.dynamicUrl + 'dynamic';
        var statusUpdateQuery = {
            query: `Update template_assignment_master tam SET TAM.status='Submit by Reviewer'
            where status In('Submit by Employee','Draft by Reviewer','Reverted to reviewer by HR','Approved by HR')and assignId=${assignId}`
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

    ApiDatatable() {
        var TPM =
            "SELECT um.userId, pm.projectName,pm.startDate,pm.endDate,tam.status,tam.assignId,um.firstName,um.lastName,qm.quaterName FROM template_assignment_master tam JOIN project_master pm ON tam.projectId = pm.projectId JOIN user_master um ON um.userId = tam.userId JOIN quater_master as qm ON qm.quaterId = TAM.quaterId ";
        // if (localStorage.getItem('roleName') == "HR") {
        //     TPM += `and TAM.status IN('Created by HR','Submit by Reviewer','Draft by Employee',
        //   'Approved by HR','Assigned to Employee',	) `
        // }
        if (localStorage.getItem('roleName') == "TPM") {
            TPM +=
                `and pm.manageBy = ${localStorage.getItem('userId')}
                    AND TAM.status IN('Submit by Employee','Draft by Reviewer','Draft by Reviewer',
                    'Approved by HR','Reverted to reviewer by HR')`
        }
        const myTeamUrl = environment.dynamicUrl + 'dynamic' + '/?_size=1000'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: myTeamUrl,
                type: Type.post,
                dataSrc: "",
                data: {
                    "query": TPM
                },
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
                        if (localStorage.getItem('roleName') == "HR") {
                            return (
                                '<a href="/hrkrasheet/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                                '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                                "</a>"
                            )
                        } else {
                            return (
                                '<a href="/TLkrasheet/id=' + row.assignId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                                '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                                "</a>" +
                                '<a href="#" id="' + row.assignId + '"class="btn btnSubmit btn-info btn-sm";"">' +
                                '<i class="fa fa-retweet" aria-hidden="true"></i>' +
                                "</a>"
                            )
                        }
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
    //#region methods 
    getDropDownValues(url) {
        return $.ajax({
            url: url,
            type: Type.get
        })
    }
    getProjectData() {
        var url = environment.apiUrl + moduleUrls.Project + '/' + `${this.state.projectId}`
        this.getDropDownValues(url).done(
            (tempProject) => {
                var displayProjectDataReturn = tempProject.map(function (i) {
                    return (
                        <option key={i.projectId} value={i.projectId}>{i.projectName}</option>
                    )
                });
                this.setState({
                    displayProjectData: displayProjectDataReturn
                })
            })
    }
    getQuaterData() {
        var url = environment.apiUrl + moduleUrls.Quater + '/' + `${this.state.quaterId}`
        this.getDropDownValues(url).done(
            (tempQuater) => {
                var displayQuaterDataReturn = tempQuater.map(function (i) {
                    return (
                        <option key={i.quaterId} value={i.quaterId}>{i.quaterName}</option>
                    )
                });
                this.setState({
                    displayQuaterData: displayQuaterDataReturn
                })
            })
    }

    getUserData() {
        var url = environment.apiUrl + moduleUrls.User + '/?_size=1000' + `${this.state.userId}`
        this.getDropDownValues(url).done(
            (tempUser) => {
                var displayUserDataReturn = tempUser.map(function (i) {
                    return (
                        <option key={i.userId} value={i.userId}>{i.firstName.charAt(0).toUpperCase() + i.firstName.slice(1) } {i.lastName.charAt(0).toUpperCase() + i.lastName.slice(1) } </option>
                    )
                });
                this.setState({
                    displayUserData: displayUserDataReturn
                })
            })
    }
    //#endregion
    componentWillMount() {
        $(document).ready(function () {
            $(".dataTables_length").css("padding-left", "0px");
        });

    }
    componentDidMount() {
        this.ApiDatatable()
        this.getProjectData();
        this.getUserData();
        this.getQuaterData();

    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">My Team</h2>
                </div>

                <div className="clearfix mt-3 mb-2 row filter-delete">

                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="quaterDropDown" onChange={(e) => { this.onChangeQuarter(e) }} value={this.state.quaterId} className="form-control" >
                            <option value="">Select Quarter</option>
                            {this.state.displayQuaterData}
                        </select>
                    </div>


                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="projectDropDown" onChange={(e) => { this.onChangeProject(e) }} value={this.state.projectId} className="form-control" >
                            <option value="">Select Project</option>
                            {this.state.displayProjectData}
                        </select>
                    </div>
                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="userDropDown" onChange={(e) => { this.onChangeUser(e) }} value={this.state.userId} className="form-control" >
                            <option value="">Select User</option>
                            {this.state.displayUserData}
                        </select>
                    </div>


                    <div className="col-md-3 col-sm-6 mb-2">
                        <select required name="projectStatusdropdown" className="form-control" value={this.state.status}
                            onChange={(e) => { this.onChangeStatusDdl(e) }} value={this.state.status}  >
                            <option value="">Select Status </option>
                            <option value="1"> Created by Hr</option>
                            <option value="2">Assigned to Employee</option>
                            <option value="3"> Draft by Employee</option>
                            <option value="4">Submit by Employee</option>
                            <option value="5">Draft by Reviewer</option>
                            <option value="6">Submit by Reviewer</option>
                            <option value="7">Reverted to employee by HR</option>
                            <option value="8">Reverted to reviewer by HR</option>
                            <option value="9">Approved by HR</option>
                            {this.state.displayProjectStatus}
                        </select>
                    </div>

                    <div className="col-md-3 col-sm-6 mb-2">
                        <button type="button" className="btn btn-info mr-2" onClick={() => { this.clear(); }}><i className="fa fa-times"></i></button>
                        <button id="searchButton" type="button" className="btn btn-success" onClick={() => { this.searchUser() }}>
                            <i className="fa fa-search"></i>
                        </button>
                    </div>
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
                <ToastContainer />
            </div>
        )
    }
}
export default Myteam;