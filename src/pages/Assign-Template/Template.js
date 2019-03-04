import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
$.DataTable = require('datatables.net-bs4');


class Template extends Component {

    constructor(props) {
        super(props);

        this.state = {
            templateName: "",
            assignedUser: "",
            project: "",
            projectDate: "",
            status: "",
        }
    }
    componentDidMount() {
        const url = environment.dynamicUrl + 'dynamic' ;
        
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.post,
                dataSrc: {
                    "query" : "SELECT UM.firstName,Um.lastname, PM.projectName,PM.startDate,PM.endDate,PM.status, TM.templateName FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy"
                    },
                error: function (xhr, status, error) {

                },

            },
            // "firstName": "pratik",
            // "lastname": "chotay",
            // "projectName": "feb2019",
            // "startDate": "2019-02-24T18:30:00.000Z",
            // "endDate": "2019-03-01T18:30:00.000Z",
            // "status": "Not Started",
            // "templateName": "qwerty"

            columns: [
                {
                    data: "templateName",
                    targets: 0,

                },
                {
                    data: "firstName",
                    targets: 1,
                },
                {
                    data: "projectName",
                    targets: 2,
                },
                {
                    data: "projectDate",
                    targets: 3,
                },

                {
                    data: "status",
                    targets: 4,
                },
                {
                    data: "assignDetailId",
                    targets: 5,
                    render: function (data, type, row) {
                        return (
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="/EditTemplate/assignDetailId=' + row.assignDetailId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
                            '<a href="#" id="' + row.Id + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" href="javascript:void(0);" ">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
                    },
                    "orderable": false
                }
            ],

            initComplete: (settings, json) => {

            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                // $(".btnDelete").on("click", e => {
                //     this.singleDeleteUserConfirm(e.currentTarget.id);
                // });

            }
        });
    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> {ModuleNames.Template}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/addAssignTemplate' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblUser"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th width="100">Template Name</th>
                            <th width="100">Assigned Users</th>
                            <th width="100" >Project</th>
                            <th width="100">Project Date</th>
                            <th width="100">Status</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div >

        )
    }
}
export default Template;