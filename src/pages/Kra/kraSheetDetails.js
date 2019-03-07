import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
const $ = require('jquery');
var moment = require('moment');
$.DataTable = require('datatables.net-bs4');

class KraSheet extends Component {
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
      kraNameRow: "",
      kpiRow: "",
      targetRow: "",
      weightageRow: ""


    }
  }

  getTemplateid = () => {

    var toGetTemplateId = environment.dynamicUrl + 'dynamic';
    var changePWquery = {
      query: `SELECT tm.templateId FROM template_assignment_master t LEFT JOIN template_master tm ON t.templateId = tm.templateId WHERE t.assignId = ${this.state.assignId}`
    }
    return $.ajax({
      url: toGetTemplateId,
      type: Type.post,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(changePWquery),
      success: (response) => {
        console.log(response)
      }

    });
  }

  getUserDetailsApi = () => {
    var endpoint = environment.dynamicUrl + 'dynamic';
    var kraSheet = {
      query: `SELECT k.kraname,TAM.assignId, PM.projectName,PM.startDate,PM.endDate,q.quaterName,UM.firstname,UM.lastname,d.departmentname FROM template_master as TM JOIN template_assignment_master as TAM ON TAM.templateId = TM.templateId JOIN project_master as PM ON PM.projectId = TAM.projectId JOIN user_master as UM ON UM.userId = PM.manageBy JOIN quater_master as q ON q.quaterId = TAM.quaterId JOIN department_master d ON d.departmentid = UM.departmentid JOIN template_detail as td ON td.templateid = TAM.templateid JOIN kra_master k ON k.kraid = td.kraid  where assignId=${this.state.assignId}`
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


  commentAndratingSave = () => {

    var kraData = new Array();
    $('#tblkraSheet tbody tr').each((index, item) => {
      debugger;
      var kraSheetdata =
      {
        "kraId": parseInt($(item).find('.kraNameRow').attr('value')),
        "kpiId": parseInt($(item).find('.kpiRow').attr('value')),
        "selfComment": $(item).find('.commentSaved').val(),
        "selfRating": $(item).find('.selfrate').val(),
        "selfRatingBy": localStorage.getItem('userId'),
        "templateAssignId": parseInt($(item).find('.selfrate').attr('tempId')),
      }
      kraData.push(kraSheetdata)
    })
    console.log(kraData)


    const endpointPOST = environment.apiUrl + moduleUrls.TAD  + '/'
    $.ajax({
      url: endpointPOST,
      type: Type.post,
      data: kraData,
    });
  }



  componentDidMount() {
    debugger;
    // if (this.state.userId ) {
    var res = this.getUserDetailsApi();
    res.done(response => {
      console.log(response)
      this.setState({

        firstName: response[0].firstname,
        lastName: response[0].lastname,
        projectName: response[0].projectName,
        departmentName: response[0].departmentname,
        kraName: response[0].kraname,
        startDate: response[0].startDate,
        endDate: response[0].endDate,
        quaterName: response[0].quatername


      });
    });
    res.fail(error => { });
    // }
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
            query: `SELECT km.kraId,km.kraName,kpi.kpiId, kpi.kpiTitle , kpi.weightage,kpi.target FROM template_detail td LEFT JOIN kra_master km ON km.kraId = td.kraId LEFT JOIN kpi_master kpi ON kpi.kpiId = td.kpiId WHERE td.templateId = ${temp[0].templateId}`
          },
          // success:(res)=>{
          //   console.log(res)
          // }



        },
        columns: [

          {
            data: "kraName",
            targets: 0,
            render: (data, type, row) => {
              debugger;
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
                `<input   class="selfrate" type="number" name="selfRating" min="0" max="10" width="100px" tempId=${temp[0].templateId} value=${this.state.selfRating} />`
              )
            },

          },
          {
            data: "comments",
            targets: 5,
            render: (data, type, row) => {
              return (
                `<textarea class="commentSaved" rows="4" cols="75" name="kpiId"  tempId=${temp[0].templateId} value=${this.state.comments}/>`
              )
            },
          },
        ],

        drawCallback: (settings) => {
          // this.setState({

          // })
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
    return (

      <div className="container-fluid " >
        <h5 style={{ textAlign: "center", marginTop: "10px" }}>KRA-{this.state.quaterName}-{this.state.kraName}-{moment(this.state.startDate).format("DD-MM-YYYY")} TO {moment(this.state.endDate).format("DD-MM-YYYY")}_{this.state.projectName}_{this.state.firstName} </h5>
        <div className="clearfix  align-items-center row page-title">

          <div className="col text-right" />
        </div>

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
        <br />
        {/* <h5><p style={{ textAlign: "center" }}> KRA {this.state.kraName}</p></h5> */}
        <div className="clearfix d-flex align-items-center row page-title">
          {/* <h2 className="col">{ModuleNames.Role}</h2> */}
          {/* <div className="col text-right">
                <Link to={{ pathname: '/addRole', state: {} }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
            </div> */}
          {/* <button type="button"
                className="btn btn-danger btn-multi-delete"
                onClick={() => {
                    this.multiRoleDeleteConfirm();
                }}><i className="fa fa-trash" aria-hidden="true"></i></button> */}


          {/* //dataTable rendering */}

          <table className="table table-striped table-bordered table-hover customDataTable"
            id="tblkraSheet"
            ref={el => (this.el = el)}>
            <thead>
              <tr>
                <th>KRA Name</th>
                <th width="300px">KPI Title</th>
                <th width="300px">Target</th>
                <th width="150px">Weightage</th>
                <th width="150px">Self Rating</th>
                <th width="500px">Comments</th>

              </tr>
            </thead>
            <tbody></tbody>
          </table>

        </div>
        <button type="button" style={{ float: "right" }} className="btn btn-success" onClick={() => { this.commentAndratingSave() }}>Save</button>&nbsp;
            </div>
      //dataTable

    )
  }
}

export default KraSheet;