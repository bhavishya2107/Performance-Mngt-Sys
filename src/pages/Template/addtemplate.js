import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { environment, moduleUrls, Type, Notification, ModuleNames } from "../Environment";
import { ToastContainer, toast } from 'react-toastify';
const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
var templateData = [];
var oldTemplateValues = [];
var currentDetailData = [];
var saveTempDetail = [];
var tempDeleteRecordsFromDatatable = [];
class Addtemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDatakra: "",
      displayDatakpi: "",
      selectkra: {},
      selectkpi: {},
      templateDataTable: [],
      templateName: "",
      id: props.match.params.id,
      redirectToList: false,
      templateId: "",
      kpiId: "",
      kraId: "",
      tempDetailId: [],
      kraName: {},
      kpiName: {},
      isUpdated: false,
      templateDetailId: "",
      isSelect: false,
      isSelectBoth: false
    };
    templateData = [];
    currentDetailData = [];
    saveTempDetail = [];
    oldTemplateValues = [];
    tempDeleteRecordsFromDatatable = [];
  }
  isTemplateNameExistsApi() {
    const templateNameexistsUrl = environment.apiUrl + moduleUrls.Template + '?_where=(templateName,eq,' + this.state.templateName.trim() + ')';
    return $.ajax({
      url: templateNameexistsUrl,
      type: Type.get,
      data: ''
    });
  }
  isTemplateNameExistsUpdateApi() {
    const templateNameexistsUrl = environment.apiUrl + moduleUrls.Template + '?_where=(templateName,eq,' + this.state.templateName.trim() + ')' + '~and(templateId,ne,' + this.state.id + ')';
    return $.ajax({
      url: templateNameexistsUrl,
      type: Type.get,
      data: ''
    });
  }
  singleDeletefromDatatableApi() {
    const singleDataUrl = environment.apiUrl + moduleUrls.Templatedetail
    return $.ajax({
      url: singleDataUrl,
      type: Type.get,
      data: ''
    });
  }

  onblurRowExists() {
    if (this.state.id != undefined) {
      var res = this.isTemplateNameExistsUpdateApi();
      res.done((response) => {

        if (response.length > 0) {
          $(".recordexists").show()
        } else {
        }
      }
      )
    }
    else {
      var res = this.isTemplateNameExistsApi();
      res.done((response) => {
        if (response.length > 0) {
          $(".recordexists").show()
        } else {

        }
      })
    }
  }
  savetemplatenameApi() {
    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var res = this.isTemplateNameExistsApi()
      res.done((response) => {
        if (response.length > 0) {
          $(".recordexists").show()
        } else {
          var _this = this;
          var formData = {
            templateName: this.state.templateName.trim(),
            "createdBy": localStorage.getItem('userId')
          };
          const templateSaveApi = environment.apiUrl + moduleUrls.Template;
          return $.ajax({
            url: templateSaveApi,
            type: Type.post,
            data: formData,
            success: function (resultData) {
              if (_this.state.isUpdated == true) {
                var saveTemplateDetailIds = [];
                $(templateData).each((e, item) => {
                  var singleObjId = {
                    templateId: resultData.insertId,
                    kraId: item.kraId,
                    kpiId: item.kpiId
                  };
                  saveTemplateDetailIds.push(singleObjId);
                });
                const templatedetailData = JSON.stringify(saveTemplateDetailIds);
                const templateSaveApi = environment.apiUrl + moduleUrls.Templatedetail + '/bulk';
                return $.ajax({
                  url: templateSaveApi,
                  type: Type.post,
                  data: templatedetailData,

                  headers: {
                    "content-type": "application/json",
                    "x-requested-with": "XMLHttpRequest"
                  },
                  success: function (resultData) {
                    _this.setState({ redirectToList: true })
                    toast.success("Template " + Notification.saved, {
                      position: toast.POSITION.TOP_RIGHT
                    });
                  }
                });
              } else {
                _this.setState({ redirectToList: true })
                toast.success("Template " + Notification.saved, {
                  position: toast.POSITION.TOP_RIGHT
                });
              }
            }
          });
        }
      })
    } else {
      return false;
    }
  }

  onChangekra(event) {
    $(".recordRequiredTbl").hide()
    this.setState({
      selectkra:
      {
        id: event.target.value,
        Name: event.target.options[event.target.selectedIndex].text

      },
      kraId: event.target.value,
      isSelect: true,

    });


  }
  onChangekpi(event) {
    $(".recordRequiredTbl").hide()
    this.setState({
      selectkpi:
      {
        id: event.target.value,
        Name: event.target.options[event.target.selectedIndex].text

      },
      kpiId: event.target.value,
      kpiName: event.target.options[event.target.selectedIndex].text,
      isSelect: true,
    });
  }

  addtemplate() {
    this.state.isUpdated = true;
    if (this.state.isSelect === true) {
      var tempData = templateData.filter((i) => {
        return (i.kpiTitle.id ? i.kpiTitle.id == this.state.kpiId : false) && (i.kraName.id ? i.kraName.id == this.state.kraId : false)
      });

      if (tempData.length > 0) {
        $(".recordExistsTbl").show()
        }
      else {
        if (this.state.kpiId && this.state.kraId) {
          this.state.isUpdated = true;
          var templateDataapi = {
            kraName: this.state.selectkra,
            kpiTitle: this.state.selectkpi,
            kraId: this.state.kraId,
            kpiId: this.state.kpiId,
            templateDetailId: this.state.templateDetailId
          };

          templateData.push(templateDataapi);

          this.$el
            .DataTable()
            .clear()
            .rows.add(templateData)
            .draw();

           $('#optionReset').prop('selectedIndex',0);
           $('#optionreset').prop('selectedIndex',0);
            
        //  this.setState({
        //    isSelect:false
        //  })
        }
        else {
          $(".recordRequiredTbl").show()
        }
      }
    }
    else {
      $(".recordRequiredTbl").show()
    }
  }

  getKPIData() {
    const kpiApi = environment.apiUrl + moduleUrls.Kpi + "/?_size=1000";
    return $.ajax({
      type: Type.get,
      url: kpiApi,
      complete: temp => {
        var tempvar = temp.responseJSON;
        var displayDataReturn = tempvar.map(i => {
          return (
            <option key={i.kpiId} value={i.kpiId}>
              {i.kpiTitle}
            </option>
          );
        });
        this.setState({
          displayDatakpi: displayDataReturn
        });
      }
    });
  }
  getKRAData() {
    const kraApi = environment.apiUrl + moduleUrls.Kra + "/?_size=1000";
    return $.ajax({
      type: Type.get,
      url: kraApi,
      complete: temp => {
        var tempvar = temp.responseJSON;
        var displayDataReturn = tempvar.map(i => {
          return (
            <option key={i.kraId} value={i.kraId}>
              {i.kraName}
            </option>
          );
        });
        this.setState({
          displayDatakra: displayDataReturn
        });
      }
    });
  }

  resetform() {
    window.location.reload();
  }
  getTemplateMasterId() {
    const endpointGET = environment.apiUrl + moduleUrls.Template + '/' + `${this.state.id}`
    return $.ajax({
      url: endpointGET,
      type: Type.get,

    })
  }
  getTemplateDetailsId() {
    const endpointGET = environment.dynamicUrl + 'dynamic' 
    return $.ajax({
      url: endpointGET,
      type: Type.post,
      data: {
        "query": "SELECT * from template_detail as TD JOIN kpi_master as KM ON TD.kpiId = KM.kpiId JOIN kra_master as TM ON TD.kraId = TM.kraId where td.templateId =" + `${this.state.id}`
      },
    })
  }

  tempgetTemplateDetailsId() {
    const tempgetTemplateDetailsIdUrl = environment.dynamicUrl + 'dynamic'
    return $.ajax({
      url: tempgetTemplateDetailsIdUrl,
      type: Type.post,
      data: {
        "query": "SELECT * from template_detail as TD JOIN kpi_master as KM ON TD.kpiId = KM.kpiId JOIN kra_master as TM ON TD.kraId = TM.kraId where td.templateId =" + `${this.state.id}`
      },
    })
  }
  updateTemplateMasterApi(data) {
    var body =
    {
      "templateName": data.templateName,
      "modifiedBy": localStorage.getItem('userId')
    }
    const endpointPOST = environment.apiUrl + moduleUrls.Template + '/' + `${data.id}`
    return $.ajax({
      url: endpointPOST,
      type: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      data: JSON.stringify(body),
    });
  }
  UpdateTemplateMaster(data) {
    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var res = this.isTemplateNameExistsUpdateApi();
      res.done((response) => {
        if (response.length > 0) {
          $(".recordexists").show()
        } else {
          var res = this.updateTemplateMasterApi(data);
          res.done((result) => {
            var resTemplateDetail = this.tempgetTemplateDetailsId(this.state.id);
            resTemplateDetail.done((resultDetail) => {
              //Data from db
              $(resultDetail).each((e, item) => {
                var templateDetail = {
                  templateId: item.templateId,
                  kraId: item.kraId,
                  kpiId: item.kpiId,
                  templateDetailId: item.templateDetailId,
                };
                //Already exist daata into Temp_detail
                currentDetailData.push(templateDetail);
              });
              var _DeletedRecords = [];
              currentDetailData.forEach(function (i) {
                tempDeleteRecordsFromDatatable.forEach(function (j) {
                  if (j.kraNameid == i.kraId && j.kpiTitleid == i.kpiId) {
                    _DeletedRecords.push(i.templateDetailId)
                  }
                });
              });
              $(templateData).each((e, item) => {
                if (item.templateDetailId < 1 || item.templateDetailId == "") {
                  var singleObjId = {
                    templateId: this.state.id,
                    kraId: item.kraName.id,
                    kpiId: item.kpiTitle.id
                  };
                  saveTempDetail.push(singleObjId);
                }
              });
              if (_DeletedRecords.length > 0) {
                this.deleteTemplateDetail(_DeletedRecords.join()).done(() => {
                  this.saveUpdatedValues(saveTempDetail);
                })
              }
              else {
                this.saveUpdatedValues(saveTempDetail);
              }
            });
          });
        }
      })
      res.fail((error) => {
        console.log(error)
      })

    } else {
      return false;
    }
  }
  saveUpdatedValues(saveTempDetail) {
    if (saveTempDetail.length > 0) {
      this.updateTemplateDetails(saveTempDetail).done((result) => {
        this.setState({
          redirectToList: true,
        });
        toast.success("Template " + Notification.updated, {
          position: toast.POSITION.TOP_RIGHT
        });
      }).fail((e) => {
        console.log(e)
      });
    }
    else {
      this.setState({
        redirectToList: true,
      });
      toast.success("Template " + Notification.updated, {
        position: toast.POSITION.TOP_RIGHT
      });
    }
  }
  updateTemplateDetails(saveTempDetail) {
    const templatedetailData = JSON.stringify(saveTempDetail);
    const templateSaveApi = environment.apiUrl + moduleUrls.Templatedetail + '/bulk';

    return $.ajax({
      url: templateSaveApi,
      type: Type.post,
      data: templatedetailData,

      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },

    });
  }
  deleteTemplateDetail(templateDetailId) {
    const multiDeleteAPIUrl = environment.apiUrl + moduleUrls.Templatedetail + '/bulk?_ids=' + `${templateDetailId}`;
    return $.ajax({
      url: multiDeleteAPIUrl,
      type: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest",
      }
    });
  }
  componentDidMount() {
    if (this.state.id !== undefined) {
      var resTemplate = this.getTemplateMasterId();
      resTemplate.done((response) => {
        this.setState({
          templateName: response[0].templateName,
        })
        var res = this.getTemplateDetailsId(this.state.id);
        res.done((res) => {
          var templateDetail;
          $(res).each((e, item) => {
            templateDetail = {

              kraName: {
                Name: item.kraName,
                id: item.kraId
              },
              kpiTitle: {
                Name: item.kpiTitle,
                id: item.kpiId
              },
              templateId: item.templateId,
              templateDetailId: item.templateDetailId,

              isDeleted: 0
            };
            var singleObjId = {
              templateId: item.templateId,
              kraId: item.kraId,
              kpiId: item.kpiId,
              templateDetailId: item.templateDetailId,
            };
            templateData.push(templateDetail);
            oldTemplateValues.push(singleObjId);
          });

          this.$el
            .DataTable()
            .clear()
            .rows.add(templateData)
            .draw();
        })
      });
      resTemplate.fail((error) => {

      })
    } else {

    }
    this.$el = $(this.el);
    this.$el.DataTable({
      datasrc: templateData,
      data: templateData,
      columns: [
        {
          data: "kraName.Name",
          target: 0
        },
        {
          data: "kpiTitle.Name",
          target: 1
        },
        {
          data: "templateId",
          "orderable": false,
          targets: 2,
          render: function (data, type, row) {
            return (
              '<a href="#" id="' + row.kraId + '" data-kraId="' + row.kraName.id + '" data-kpiId="' + row.kpiTitle.id + '" class="btn btn-danger btnDelete btn-sm">Delete</a>'
            )
          }
        },

      ],
      "paging": false,
      "ordering": false,
      "info": false,
      "searching": false,
      drawCallback: (settings) => {
        $(".btnDelete").on("click", e => {
          var tempKraID = e.target.getAttribute('data-kraId');
          var tempKpiID = e.target.getAttribute('data-kpiId');
          this.deleteDataTableRow(parseInt(tempKraID), parseInt(tempKpiID));
        });

      }
    });
    this.getKPIData();
    this.getKRAData();
  }
  deleteDataTableRow(kraNameid, kpiTitleid) {
    var tempDeleteRecordArray = {
      kraNameid: kraNameid,
      kpiTitleid: kpiTitleid
    }
    tempDeleteRecordsFromDatatable.push(tempDeleteRecordArray);

    templateData = templateData.filter((i) => {
      return !(i.kpiTitle.id == kpiTitleid && i.kraName.id == kraNameid)
    })
    this.$el
      .DataTable()
      .clear()
      .rows.add(templateData)
      .draw();

  }
  render() {
    if (this.state.redirectToList === true) {
      return <Redirect to={{ pathname: "/templateList" }} />;
    }

    return (
      <div>
        <div className="clearfix">
          <div className="clearfix d-flex align-items-center row page-title">
            <h2 className="col">
              {this.state.id !== undefined ? <span>Edit  Template</span> : <span>Add Template</span>}
            </h2>
          </div>
          <div className="row">
            <div className="col-md-6">
              <form id="formtemplate">
                <div className="form-group">
                  <label className="required">Template Name</label>
                  <input
                    id="templateid"
                    className="form-control"
                    required
                    name="templateName"
                    onBlur={() => { this.onblurRowExists() }}
                    maxLength="50"
                    value={this.state.templateName}
                    onChange={event => {
                      $(".recordexists").hide()
                      this.setState({
                        templateName: event.target.value
                      });
                    }}

                  />
                  <label className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div>
          <br />
          <br />

          <div className="row">
            <div className="col-md-4">
              <select id="optionReset" name="optionKra"
                onChange={e => {
                  this.onChangekra(e);
                }}
                className="form-control"
              >
                <option disabled selected>Select KRA</option>
                {this.state.displayDatakra}
              </select>
            </div>
            <div className="col-md-4">
              <select id="optionreset" name="optionKpi"
                onChange={e => {
                  this.onChangekpi(e);
                }}
                className="form-control"
              >
                <option disabled selected>Select KPI</option>
                {this.state.displayDatakpi}
              </select>
            </div>
            <div className="col-md-4">
              <button id="btnTemplateDetail"
                onChange={
                  $(".recordExistsTbl").hide()
                }
                onClick={() => this.addtemplate(this.state)}
                type="button"
                className="btn btn-primary"
              >
                <i className="fa fa-plus" />
              </button>
              <span></span>
              &nbsp; &nbsp;
              <label className="recordExistsTbl" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
              <label className="recordRequiredTbl" style={{ "display": "none", "color": "#dc3545", "marginRight": "" }}>Select both fields.</label>
            </div></div>
          <br />
          <br />
          <table
            className="table table-striped table-bordered table-hover"
            ref={el => (this.el = el)}
            id="tblKraKpi"
          >
            <thead>
              <tr>
                <th width="200">KRA Name</th>
                <th width="200">KPI Name</th>
                <th width="50">Action</th>
              </tr>
            </thead>
            <tbody />
          </table>
          {this.state.id !== undefined ?
            <button type="button" className="btn btn-success mr-2" onClick={() => {
              this.UpdateTemplateMaster(this.state);
            }}>Update</button>

            : <button type="button" className="btn btn-success mr-2" onClick={() => {
              this.savetemplatenameApi(this.state);
            }}>Save</button>}
          <button
            type="button"
            className="btn btn-info mr-2"
            onClick={() => {
              this.resetform();
            }}
          >
            Reset
            </button>

          <Link to="/templatelist" className="btn btn-danger ">
            Cancel
            </Link>
        </div>
        <ToastContainer />
      </div>
    );
  }
}
export default Addtemplate;
