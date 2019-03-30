import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../pages/Environment';
const $ = require('jquery');
var moment = require('moment');
$.DataTable = require('datatables.net-bs4');

class TLKraSheet extends Component {
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
            reviewerComment:"",
            selfRating: "",
            quaterName: "",
            assignId: props.match.params.assignId,
            templateid: "",
            table: "",
            redirectToMyteam: false
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

     //add Employee Comment
  saveReviewerComment(data) {
            var employeeComment =
            {
                "reviewerComment": data.reviewerComment,
            };
            const apiTAMsaveEmpComment = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${this.state.assignId}`
            $.ajax({
                url: apiTAMsaveEmpComment,
                type: Type.patch,
                data: JSON.stringify(employeeComment),
                headers: {
                  "content-type": "application/json",
                  "x-requested-with": "XMLHttpRequest",
              },
                success: function (resultData) {

                }
            });
  }

   //get reviewerComment for update 
   apiForGetReviewerComment() {
          const apiForGetrevComment = environment.apiUrl + moduleUrls.Template_assignment_master + '/' + `${this.state.assignId}`
          return $.ajax({
              url: apiForGetrevComment,
              type: Type.get,
              success:(res)=>{
                console.log(res)
              }
          })
      }

    //getting form details 
    getUserDetailsApi = () => {
        var endpoint = environment.dynamicUrl + 'dynamic';
        var kraSheet = {
            query: `
            SELECT k.kraname,k.kraName,TAM.assignId,PM.projectName,PM.startDate,PM.endDate,q.quaterName,UM.firstname,UM.firstName,UM.lastname,UM.lastName,d.departmentname,d.departmentName
            FROM 
            template_assignment_master as TAM JOIN template_master as TM ON TAM.templateId = TM.templateId 
            JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = TAM.userId 
            JOIN quater_master as q ON q.quaterId = TAM.quaterId JOIN department_master d ON d.departmentid = UM.departmentid 
            JOIN template_detail as td ON td.templateid = TAM.templateid 
            JOIN kra_master k ON k.kraid = td.kraid 
            where TAM.assignId=${this.state.assignId}`
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

    //update and set comment
    updateApi(data) {
        var _this = this;
        var kraSheetdata =
        {
            "kraId": data.kraId,
            "kpiId": data.kpiId,
            "reviewerComment": data.reviewerComment,
            "reviewerRating": data.reviewerRating,
            "reviwerRatingBy": data.reviwerRatingBy,
            "templateAssignId": data.templateAssignId,
        }


        return $.ajax({
            url: environment.apiUrl + moduleUrls.TAD + '/' + `${data.assignDetailId}`,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            async: false,
            data: JSON.stringify(kraSheetdata),
            success: function (resultData) {
                _this.setState({ redirectToMyteam: true })
               
            }
        })
    }

    //comment,self-rating save if kpiID,KraId,assignId exist
    commentAndratingUpdate() {
        this.saveReviewerComment(this.state);
        var kraData = new Array();
        var kraDataSaveRecords = new Array();
        var kraDataUpdateRecords = new Array();
        $('#tblkraSheet tbody tr').each((index, item) => {
            if ($(item).find('.commentSaved').val() !== null) {
                if (isNaN(parseInt($(item).find('.commentSaved').attr('data-assigndetailId')))) {
                    var kraSheetdata =
                    {
                        "kraId": parseInt($(item).find('.kraNameRow').attr('value')),
                        "kpiId": parseInt($(item).find('.kpiRow').attr('value')),
                        "reviewerComment": $(item).find('.commentSaved').val(),
                        "reviewerRating": $(item).find('.TLrating').val(),
                        "reviwerRatingBy": parseInt(localStorage.getItem('userId')),
                        "templateAssignId": this.state.assignId
                    }
                    kraDataSaveRecords.push(kraSheetdata)
                }
                else {
                    var kraSheetdata =
                    {
                        "kraId": parseInt($(item).find('.kraNameRow').attr('value')),
                        "kpiId": parseInt($(item).find('.kpiRow').attr('value')),
                        "reviewerComment": $(item).find('.commentSaved').val(),
                        "reviewerRating": $(item).find('.TLrating').val(),
                        "reviwerRatingBy": parseInt(localStorage.getItem('userId')),
                        "templateAssignId": this.state.assignId,
                        "assignDetailId": parseInt($(item).find('.commentSaved').attr('data-assigndetailId'))
                    }
                    kraDataUpdateRecords.push(kraSheetdata)
                }
            }
        });

        if (kraDataSaveRecords.length > 0) {//SAVE Logic
           
            var _this = this;
            const endpointPOST = environment.apiUrl + moduleUrls.TAD + '/bulk'
            $.ajax({
                url: endpointPOST,
                type: Type.post,
                data: JSON.stringify(kraDataSaveRecords),
                headers: {
                    "Content-Type": "application/json",
                    "x-requested-with": "XMLHttpRequest"
                },
                success: function (resultData) {
              
                    _this.setState({ redirectToMyteam: true })
                    toast.success("Comment " + Notification.saved, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            });
        }
        if (kraDataUpdateRecords.length > 0) {//Update
        
            kraDataUpdateRecords.forEach(item => {
                this.updateApi(item);

            });
       toast.success("Comment " + Notification.saved, {
                    position: toast.POSITION.TOP_RIGHT
                });
        }
    }
    componentDidMount() {
        var employeeComment=this.apiForGetReviewerComment()
        employeeComment.done((res)=>{
          this.setState({
            reviewerComment:res[0].reviewerComment
          })
        })
        employeeComment.fail((error)=>{
          
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
                                `<input   class="TLrating" type="number" name="reviewerRating" min="0" max="5" width="100px"  value="${row.reviewerRating}" />`
                            )
                        },
                    },
                    {
                        data: "reviewerComment",
                        targets: 5,
                        render: (data, type, row) => {
                            if (row.reviewerComment != "null" && row.reviewerComment != null) {
                                return (
                                    `<textarea type="text" name="reviewerComment" class="commentSaved" rows="4" cols="75" data-assigndetailId="${row.assignDetailId}" placeholder="Enter your comment" value="${row.reviewerComment}">${row.reviewerComment}</textarea>`
                                )
                            } else {
                                return (
                                    `<textarea type="text" name="reviewerComment" class="commentSaved" rows="4" cols="75" data-assigndetailId="${row.assignDetailId}" placeholder="Enter your comment" value="${row.reviewerComment}"></textarea>`
                                )
                            }

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
                &nbsp;
                <div>
        <label><b>Reviewer Comment:</b></label>
        </div>
        <div >
        <textarea className="form-control" style={{"border":"1px solid"}} rows="8" cols="180" value={this.state.reviewerComment}
           onChange={(event) => {
            this.setState({
                reviewerComment: event.target.value
            })
        }}
        ></textarea>
        </div>
        &nbsp;
                <div className="form-group">
                <button className="btn btn-success" type="button" onClick={() => {
                    this.commentAndratingUpdate();
                }}>Save</button>
                </div>
            </div>
        )
    }
}
export default TLKraSheet;