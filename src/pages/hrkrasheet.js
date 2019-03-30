import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../pages/Environment';
const $ = require('jquery');
var moment = require('moment');
$.DataTable = require('datatables.net-bs4');

class Hrkrasheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            kraName: "",
            projectName: "",
            startDate: "",
            endDate: "",
            departmentName: "",
            comments: "",
            selfRating: "",
            quaterName: "",
            assignId: props.match.params.assignId,
            templateid: "",
            table: "",
            redirectToMyteam: false,
            hrcomment: ""
        }
    }

    //template Id to load dataTable details
    getTemplateid = () => {
        var toGetTemplateId = environment.dynamicUrl + 'dynamic';
        var getTemp = {
            query: `SELECT tm.templateId  FROM template_assignment_master t LEFT JOIN template_master tm ON t.templateId = tm.templateId WHERE t.assignId = ${this.state.assignId}`
        }
        return $.ajax({
            url: toGetTemplateId,
            type: Type.post,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(getTemp),
            success: (response) => {
            }
        });
    }

    //getting form details 
    getUserDetailsApi = () => {
        var endpoint = environment.dynamicUrl + 'dynamic';
        var kraSheet = {
            query: `
          SELECT 
            k.kraname,
            TAM.assignId, 
            PM.projectName,
            PM.startDate,
            PM.endDate,
            q.quaterName,
            UM.firstname,
            UM.lastname,
            d.departmentname 
          FROM 
            template_assignment_master as TAM           
            JOIN template_master as TM ON TAM.templateId = TM.templateId 
            JOIN project_master as PM ON PM.projectId = TAM.projectId 
            JOIN user_master as UM ON UM.userId = TAM.userId 
            JOIN quater_master as q ON q.quaterId = TAM.quaterId 
            JOIN department_master d ON d.departmentid = UM.departmentid 
            JOIN template_detail as td ON td.templateid = TAM.templateid 
            JOIN kra_master k ON k.kraid = td.kraid  
          where 
            TAM.assignId=${this.state.assignId}`
        }
        return $.ajax({
            url: endpoint,
            type: Type.post,
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(kraSheet),
        });
    }

    getTemplate_assignment_masterAPI() {
        var getapi = environment.dynamicUrl + 'dynamic';
        var getquery = {
            query: `select * from template_assignment_master where assignId =${this.state.assignId}`
        }
        return $.ajax({
            url: getapi,
            type: Type.post,
            data: JSON.stringify(getquery),
            headers: {
                "Content-Type": "application/json",
            },
            success: function (resultData) {
            }
        })
    }
    componentDidMount() {
        this.getTemplate_assignment_masterAPI()
            .done((response) => {
                this.setState({
                    hrcomment: response[0].hrComment
                })

            })
        var res = this.getUserDetailsApi();
        res.done(response => {
            this.setState({
                firstName: response[0].firstname,
                lastName: response[0].lastname,
                projectName: response[0].projectName,
                departmentName: response[0].departmentname,
                kraName: response[0].kraname,
                startDate: response[0].startDate,
                endDate: response[0].endDate,
                quaterName: response[0].quaterName
            });
        });
        res.fail(error => { });

        //*******DataTable************//
        const endpointGET = environment.dynamicUrl + 'dynamic'
        var getTempId = this.getTemplateid();
        getTempId.done((temp) => {
            this.$el = $(this.el);
            this.state.table = this.$el.DataTable({
                "autoWidth": false,
                "searching": false,
                "lengthChange": false,
                "paging": false,
                "bInfo": false,
                ajax: {
                    url: endpointGET,
                    type: "POST",
                    dataSrc: "",
                    data: {
                        query:
                            ` 
                        SELECT tad.assignDetailId,tad.templateAssignId, td.kraId, td.kpiId, kra.kraName, kpi.kpiTitle,kpi.weightage,kpi.target, tad.selfRating,tad.reviewerComment,tad.selfComment,tad.reviewerRating,tad.reviwerRatingBy
                        FROM template_assignment_master tam
                        LEFT JOIN template_detail td ON tam.templateId = td.templateId
                        LEFT JOIN kra_master kra ON kra.kraId = td.kraId
                        LEFT JOIN kpi_master kpi ON kpi.kpiId = td.kpiId
                        LEFT JOIN template_assignment_detail tad ON tad.kpiId = td.kpiId AND tad.kraId = td.kraId
                        WHERE  tam.assignId =  ${this.state.assignId}`
                    },
                },
                columns: [
                    {
                        data: "kraName",
                        targets: 0,
                        render: (data, type, row) => {
                            return (
                                `<label class="kraNameRow" value="${row.kraId}">` + row.kraName + `</label>`
                            )
                        }
                    },
                    {
                        data: "kpiTitle",
                        targets: 1,
                        render: (data, type, row) => {
                            return (
                                `<label class="kpiRow" value="${row.kpiId}">` + row.kpiTitle + `</label>`
                            )
                        }
                    },
                    {
                        data: "weightage",
                        targets: 2,
                        render: (data, type, row) => {
                            return (
                                `<label class="weightageRow" value="${row.weightage}">` + row.weightage + `</label>`
                            )
                        }
                    },
                    {
                        data: "target",
                        targets: 3,
                        render: (data, type, row) => {
                            return (
                                `<label class="targetRow" value="${row.target}">` + row.target + `</label>`
                            )
                        }
                    },
                    {
                        data: "selfRating",
                        targets: 4,
                        render: (data, type, row) => {
                            return (
                                `<label class="selfRating" value="${row.selfRating}">` + row.selfRating + `</label>`
                            )
                        },
                    },
                    {
                        data: "selfComment",
                        targets: 4,
                        render: (data, type, row) => {
                            return (
                                `<label class="selfComment" value="${row.selfComment}">` + row.selfComment + `</label>`
                            )
                        },
                    },
                    {
                        data: "reviewerRating",
                        targets: 4,
                        render: (data, type, row) => {
                            return (
                                `<label class="TLrating" value="${row.reviewerRating}">` + row.reviewerRating + `</label>`
                            )
                        },
                    },
                    {
                        data: "reviewerComment",
                        targets: 5,
                        render: (data, type, row) => {
                            return (
                                `<label class="commentSaved" value="${row.reviewerComment}">` + row.reviewerComment + `</label>`
                            )
                        },
                    },
                ],
                drawCallback: (settings) => {
                    window.smallTable();
                    $(".commentSaved").on("change", e => {
                        this.state.comments = e.target.value
                    });
                    $(".selfrate").on("change", e => {
                        this.state.selfRating = e.target.value
                    });
                }
            });
        })
    }

    //Save hr comment Api

    saveAndEditHrComment(data) {
        var formData = {
            "hrComment": data.hrcomment,
        }
        const saveHrcomment = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + data.assignId
        return $.ajax({
            url: saveHrcomment,
            type: Type.patch,
            data: JSON.stringify(formData),
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            },
        })
    }

    //onclick function for approved

    onClickApproved(data) {
        var _this = this
        this.saveAndEditHrComment(data)
            .done(() => {
                var statusUpdate = environment.dynamicUrl + 'dynamic';
                var statusUpdateQuery = {
                    query: `Update template_assignment_master tam SET status='Approved by HR'
              where  assignId=${data.assignId}`
                }
                return $.ajax({
                    url: statusUpdate,
                    type: Type.post,
                    data: JSON.stringify(statusUpdateQuery),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    success: function () {
                        _this.setState({ redirectToMyteam: true });
                        toast.success("Comment " + Notification.saved, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                });
            })
    }

    //onclick function for RevertedToReviewer

    onClickRevertedToReviewer(data) {
        var _this = this
        this.saveAndEditHrComment(data)
            .done(() => {
                var statusUpdate = environment.dynamicUrl + 'dynamic';
                var statusUpdateQuery = {
                    query: `Update template_assignment_master tam SET status='Reverted to reviewer by HR'
              where  assignId=${data.assignId}`
                }
                return $.ajax({
                    url: statusUpdate,
                    type: Type.post,
                    data: JSON.stringify(statusUpdateQuery),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    success: function () {
                        _this.setState({ redirectToMyteam: true });
                        toast.success("Comment " + Notification.saved, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                });
            })

    }

    //onclick function for RevertedToEmployee

    onClickRevertedToEmployee(data) {
        var _this = this
        this.saveAndEditHrComment(data)
            .done(() => {
                var statusUpdate = environment.dynamicUrl + 'dynamic';
                var statusUpdateQuery = {
                    query: `Update template_assignment_master tam SET status='Reverted to employee by HR'
              where  assignId=${data.assignId}`
                }
                return $.ajax({
                    url: statusUpdate,
                    type: Type.post,
                    data: JSON.stringify(statusUpdateQuery),
                    headers: {
                        "Content-Type": "application/json",
                    },
                    success: function () {
                        _this.setState({ redirectToMyteam: true });
                        toast.success("Comment " + Notification.saved, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    }
                });
            })

    }

    render() {
        if (this.state.redirectToMyteam === true) {
            return <Redirect to={{ pathname: "/myteam" }} />;
        }
        return (
            <div className="container-fluid " >
                <h5 style={{ textAlign: "center", marginTop: "10px" }}>KRA-{this.state.quaterName}-{this.state.kraName}-{moment(this.state.startDate).format("DD-MM-YYYY")} TO {moment(this.state.endDate).format("DD-MM-YYYY")}_{this.state.projectName}_{this.state.firstName} </h5>
                <div className="clearfix  align-items-center row page-title">
                    <div className="col text-right" />
                </div>
                <div className="mb-3 clearfix">
                    <form action="" style={{ margin: "auto", border: "black 1px solid" }}>
                        <div className="col-md-12 order-md-first">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="Name">
                                            <b>Name</b>
                                        </label>
                                        <div>
                                            <input
                                                id="userName"
                                                type="text"
                                                className="form-control"
                                                readOnly
                                                value={this.state.firstName + ' ' + this.state.lastName}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="kraName">
                                            <b>KRA Name</b>
                                        </label>
                                        <div>
                                            <input
                                                id="kraName"
                                                type="text"
                                                className="form-control "
                                                readOnly
                                                value={this.state.kraName}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="projectName">
                                            <b>Project Name</b>
                                        </label>
                                        <div>
                                            <input
                                                id="projectName"
                                                type="text"
                                                className="form-control "
                                                readOnly
                                                value={this.state.projectName}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="userEmail">
                                            <b> Start Date</b>
                                        </label>
                                        <div>
                                            <input
                                                id="userEmail"
                                                type="email"
                                                className="form-control"
                                                readOnly
                                                value={moment(this.state.startDate).format("DD-MM-YYYY")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="userAddress">
                                            <b> End Date</b>
                                        </label>
                                        <div>
                                            <input
                                                id="userAddress"
                                                type="text"
                                                className="form-control"
                                                readOnly
                                                value={moment(this.state.endDate).format("DD-MM-YYYY")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" htmlFor="userImage">
                                            <b> Department Name</b>
                                        </label>
                                        <div>
                                            <input
                                                id="userLastName"
                                                type="text"
                                                className="form-control "
                                                readOnly
                                                value={this.state.departmentName}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="clearfix">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblkraSheet"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th width="100px">KRA Name</th>
                                <th width="100px">KPI Title</th>
                                <th width="50px">Weightage</th>
                                <th >Target</th>
                                <th width="50px">Employee Rating</th>
                                <th width="100px">Employee Comment</th>
                                <th>Reviewer Rating</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <div>
                    <label style={{ "padding": "auto" }}><b>HR Comment:</b></label>
                </div>
                <div >
                    <textarea className="form-control" style={{ "border": "1px solid" }} rows="8" cols="180" value={this.state.hrcomment}
                        onChange={(event) => {
                            this.setState({
                                hrcomment: event.target.value,
                            })
                        }}></textarea>
                </div>
                &nbsp;
                <div className="form-group">
                    <button className="btn btn-success mr-2" type="button" onClick={() => {
                        this.onClickApproved(this.state);
                    }}>Approved</button>
                     <button className="btn btn-success mr-2" type="button" onClick={() => {
                        this.onClickRevertedToReviewer(this.state);
                    }}>Reverted to reviewer</button>
                    <button className="btn btn-success mr-2" type="button" onClick={() => {
                        this.onClickRevertedToEmployee(this.state);
                    }}>Reverted to employee</button>

                    <Link to="/myteam" className="btn btn-danger ">Cancel</Link>

                </div>
            </div>
        )
    }
}
export default Hrkrasheet;