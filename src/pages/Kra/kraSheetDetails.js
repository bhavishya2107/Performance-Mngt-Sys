import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
const $ = require('jquery');
var moment = require('moment');
$.DataTable = require('datatables.net-bs4');
var filterData = []
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
      templateAssignId: "",
      kraId: "",
      kpiId: "",
    }
    filterData = []
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

  //delete saved comment and selfrate on edit record
  deleteData() {
    return $.ajax({
      url: environment.dynamicUrl + 'dynamic',
      type: Type.post,
      data: {
        "query": "delete from template_assignment_detail where templateAssignId  = " + `${this.state.assignId}`
      },
    })
  }

  //fetch details from api 
  getdetailsFromTAD() {
    return $.ajax({
      url: environment.dynamicUrl + 'dynamic',
      type: Type.post,
      data: {
        "query": "select * from template_assignment_detail where templateAssignId  = " + `${this.state.assignId}`
      }
    })


  }

  //update and set comment
  updateApi(data) {
    debugger;
    var kraData = []
    var kraSheetdata =
    {
      "kraId": data.kraId,
      "kpiId": data.kpiId,
      "selfComment": data.comments,
      "selfRating": data.selfRating,
      "selfRatingBy": data.selfRatingBy,
      "templateAssignId": data.templateAssignId,
      "assignDetailId": data.assignDetailId
    }
    kraData.push(kraSheetdata)

    return $.ajax({
      url: environment.apiUrl + moduleUrls.TAD + '/' + `${data.assignDetailId}`,
      type: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
    },
      async: false,
      data:JSON.stringify(kraData)

    })

  }
  //comment,self-rating save if kpiID,KraId,assignId exist
  commentAndratingUpdate() {
    this.commentAndratingSave();
    var kraData = new Array();
    $('#tblkraSheet tbody tr').each((index, item) => {
      if ($(item).find('.commentSaved').val() !== null) {

        var kraSheetdata =
        {
          "kraId": parseInt($(item).find('.kraNameRow').attr('value')),
          "kpiId": parseInt($(item).find('.kpiRow').attr('value')),
          "selfComment": $(item).find('.commentSaved').val(),
          "selfRating": $(item).find('.selfrate').val(),
          "selfRatingBy": parseInt(localStorage.getItem('userId')),
          "templateAssignId": this.state.assignId,
          "assignDetailId": parseInt($(item).find('.commentSaved').attr('data-assigndetailId'))
        }
        kraData.push(kraSheetdata)
      }
    })
    kraData.forEach(item => {
      if (item.assignDetailId === null) {
        //save
        const endpointPOST = environment.apiUrl + moduleUrls.TAD + '/bulk'
        return $.ajax({
          url: endpointPOST,
          type: Type.post,
          data: JSON.stringify(kraData),
          headers: {
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest"
          },
          success: function (resultData) {
          }
        });
      }
      else {
        //update
        var temp = this.getdetailsFromTAD()
        temp.done((data) => {
          data.forEach(item => {
            this.updateApi(item.assignDetailId)
              // .done((res) => {
               
              // })
          });
        })
      }
    });

  }

  //comment and rating save 
  commentAndratingSave = () => {
    var kraData = new Array();
    $('#tblkraSheet tbody tr').each((index, item) => {

      var kraSheetdata =
      {
        "kraId": parseInt($(item).find('.kraNameRow').attr('value')),
        "kpiId": parseInt($(item).find('.kpiRow').attr('value')),
        "selfComment": $(item).find('.commentSaved').val(),
        "selfRating": $(item).find('.selfrate').val(),
        "selfRatingBy": parseInt(localStorage.getItem('userId')),
        "templateAssignId": this.state.assignId,
        "assignDetailId": parseInt($(item).find('.commentSaved').attr('data-assigndetailId'))
      }
      kraData.push(kraSheetdata)
    })
    const endpointPOST = environment.apiUrl + moduleUrls.TAD + '/bulk'
    return $.ajax({
      url: endpointPOST,
      type: Type.post,
      data: JSON.stringify(kraData),
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      success: function (resultData) {
      }
    });

  }


  componentDidMount() {
    var result = this.getdetailsFromTAD();
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
        quaterName: response[0].quatername
      });
    });
    res.fail(error => { });

    //**********DataTable************//
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
              SELECT tad.assignDetailId,tad.templateAssignId, td.kraId, td.kpiId, kra.kraName, kpi.kpiTitle,kpi.weightage,kpi.target, tad.selfRating, tad.selfComment
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

              this.setState({
                templateAssignId: row.templateAssignId,
                kraId: row.kraId,
                kpiId: row.kpiId
              })

              var singleObjId = {
                templateAssignId: row.templateAssignId,
                kraId: row.kraId,
                kpiId: row.kpiId
              };
              filterData.push(singleObjId)
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
                `<input   class="selfrate" type="number" name="selfRating" min="0" max="5" width="100px"  value="${row.selfRating}" />`
              )
            },
          },
          {
            data: "selfComment",
            targets: 5,
            render: (data, type, row) => {
              return (
                `<textarea type="text" name="comment" class="commentSaved" rows="4" cols="75"  placeholder="Enter your comment" data-assigndetailId="${row.assignDetailId}" value="${row.selfComment}">${row.selfComment}</textarea>`
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
        <div className="clearfix d-flex align-items-center row page-title">
          <table className="table table-striped table-bordered table-hover customDataTable"
            id="tblkraSheet"
            ref={el => (this.el = el)}>
            <thead>
              <tr>
                <th width="100px">KRA Name</th>
                <th width="100px">KPI Title</th>
                <th width="50px">Weightage</th>
                <th>Target</th>
                <th>Self Rating</th>
                <th>Comments</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>

        <button className="btn btn-success " type="button" onClick={() => {
          this.commentAndratingUpdate();
        }}>Save</button>


      </div>
      //dataTable
    )
  }
}
export default KraSheet;