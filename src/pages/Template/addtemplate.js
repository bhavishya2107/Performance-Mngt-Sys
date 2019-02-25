import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { environment, moduleUrls, Type, Notification, ModuleNames } from "../Environment";
import { ToastContainer, toast } from 'react-toastify';
const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
var templateData = [];
var templateTblId = [];
var templateDataapi = []
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
      kpiName: {}
    };
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
          };
          const templateSaveApi = environment.apiUrl + moduleUrls.Template;
          $.ajax({
            url: templateSaveApi,
            type: Type.post,
            data: formData,
            success: function (resultData) {
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

              $.ajax({
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
            }
          });
        }
      })

    } else {
      return false;
    }

  }

  onChangekra(event) {

    this.setState({
      selectkra:
      {
        ID: event.target.value,
        Name: event.target.options[event.target.selectedIndex].text

      },
      kraId: event.target.value,


    });

  }
  onChangekpi(event) {

    this.setState({
      selectkpi:
      {
        ID: event.target.value,
        Name: event.target.options[event.target.selectedIndex].text

      },
      kpiId: event.target.value,
      kpiName: event.target.options[event.target.selectedIndex].text
    });
  }

  addtemplate() {

    var templateDataapi = {
      kraName: this.state.selectkra,
      kpiTitle: this.state.selectkpi,
      kraId: this.state.kraId,
      kpiId: this.state.kpiId
    };
    // var templateDataId = {

    // }

    //templateTblId.push(templateDataId);
    templateData.push(templateDataapi);
    this.$el
      .DataTable()
      .clear()
      .rows.add(templateData)
      .draw();
  }

  getKPIData() {
    const kpiApi = environment.apiUrl + moduleUrls.Kpi + "/?_size=1000";
    $.ajax({
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
    $.ajax({
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
    //const endpointGET = environment.apiUrl + moduleUrls.Templatedetail 
    return $.ajax({
      url: "http://192.168.10.110:3000/dynamic",
      type: Type.post,
      data: {
        "query": "SELECT * from template_detail as TD JOIN kpi_master as KM ON TD.kpiId = KM.kpiId JOIN kra_master as TM ON TD.kraId = TM.kraId where td.templateId =" + `${this.state.id}`
      },
    })
  }
  updateTemplateMasterApi(data) {
    debugger
    var body =
    {
      "templateName": data.templateName,
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
  updateDetails(saveTemplateDetailIds) {
    const templatedetailData = JSON.stringify(saveTemplateDetailIds);
    console.log(templatedetailData)
    const templateSaveApi = environment.apiUrl + moduleUrls.Templatedetail + '/bulk';

    $.ajax({
      url: templateSaveApi,
      type: Type.post,
      data: templatedetailData,

      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      success: () => {
        this.setState({

          redirectToList: true,

        });
        toast.success("Template " + Notification.updated, {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    });
  }
  deleteDetails() {
   
    var deleteTempDetailIds = ''
    $(templateData).each((e, item) => {
      
      if (item.templateDetailId != undefined) {
        if (deleteTempDetailIds == '') {
          deleteTempDetailIds = item.templateDetailId
        } else {
          deleteTempDetailIds = deleteTempDetailIds + ',' + item.templateDetailId
        }
      }

    });
    var res= this.deleteTemplateDetail(deleteTempDetailIds) 
    res.done((result)=>{

    })
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
            var saveTemplateDetailIds = [];
            $(templateData).each((e, item) => {
              var singleObjId = {
                templateId: result.insertId,
                kraId: item.kraId,
                kpiId: item.kpiId,
                templateDetailId: item.templateDetailId,
              };
              saveTemplateDetailIds.push(singleObjId);
              console.log(saveTemplateDetailIds)
            });
            // bulk dlt temp d id
           this.deleteDetails();
            this.updateDetails(saveTemplateDetailIds);
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



  componentDidMount() {
    if (this.state.id !== undefined) {
      var resTemplate = this.getTemplateMasterId();
      resTemplate.done((response) => {
        this.setState({
          templateName: response[0].templateName,

        })
        var res = this.getTemplateDetailsId(this.state.id);
        res.done((res) => {

          $(res).each((e, item) => {
            var templateDetail = {

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

            templateData.push(templateDetail);

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
        // {
        //   data: "kraName.id",
        //   target: 0
        // },
        // {
        //   data: "kpiTitle.id",
        //   target: 1
        // },

        {
          data: "kraName.Name",
          target: 0
        },
        {
          data: "kpiTitle.Name",
          target: 1
        },
        {
          data: "kraId",
          "orderable": false,
          targets: 2,
          render: function (data, type, row) {
            return (
              '<a href="#" id="' + row.kraId + '"class="btn btn-danger btnDelete btn-sm">' +
              '<i class="fa fa-trash" aria-hidden="true"></i>' +
              "</a>"
            )
          }
        },
      ],
      drawCallback: (settings) => {

        $(".btnDelete").on("click", e => {

        });
      }
    });
    this.getKPIData();
    this.getKRAData();

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
                    onBlur={() => { this.onblurRowExists() }}
                    maxLength="50"
                    value={this.state.templateName}
                    onChange={event => {
                      $(".recordexists").hide()
                      this.setState({
                        templateName: event.target.value
                      });
                    }}
                    required
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

              <select
                onChange={e => {
                  this.onChangekra(e);
                }}
                className="form-control"
              >
                <option>select Kra</option>
                {this.state.displayDatakra}
              </select>
            </div>

            <div className="col-md-4">

              <select
                onChange={e => {
                  this.onChangekpi(e);
                }}
                className="form-control"
              >
                <option>select Kpi</option>
                {this.state.displayDatakpi}
              </select>
            </div>
            <div className="col-md-4">
              <button id="btnTemplateDetail"
                onClick={() => this.addtemplate(this.state)}
                type="button"
                className="btn btn-primary"
              >
                <i className="fa fa-plus" />
              </button>
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
                {/* <th>kraid</th>
                <th>kpiid</th> */}
                <th>KRA Name</th>
                <th>KPI Name</th>
                <th>Action</th>
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

      </div>
    );
  }
}
export default Addtemplate;
