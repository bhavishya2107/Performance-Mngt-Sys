import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { environment, moduleUrls, Type } from "../Environment";
const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
var templateData = [];
var templateTblId = [];
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



  savetemplatenameApi() {

    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var _this = this;

      var formData = {
        templateName: this.state.templateName,
      };
      const templateSaveApi = environment.apiUrl + moduleUrls.Template;
      $.ajax({
        url: templateSaveApi,
        type: Type.post,
        data: formData,
        success: function (resultData) {
          var saveTemplateDetailIds = [];
          $(templateTblId).each((e, item) => {
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
            }
          });
        }
      });
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
      kpiTitle: this.state.selectkpi
    };
    var templateDataId = {
      kraId: this.state.kraId,
      kpiId: this.state.kpiId
    }

    templateTblId.push(templateDataId);
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
    var body =
    {
      "templateName": data.templateName.trim(),
    }
    const endpointPOST = environment.apiUrl + moduleUrls.Template + '/' + `${data.id}`
    return $.ajax({
      url: endpointPOST,
      type: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      data: JSON.stringify(body)
    });
  }
  updateTemplateDetailApi(data) {
    var body =
    {
      "templateId": 1,
      "kraId": 1,
      "kpiId": 1
    }
    const endpointPOST = environment.apiUrl + moduleUrls.Templatedetail + '/' + `${data.id}`
    return $.ajax({
      url: endpointPOST,
      type: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      },
      data: JSON.stringify(body)
    });
  }
  UpdateTemplateDetail(data) {
    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var res = this.updateTemplateDetailApi(data);

      res.done((result) => {
        this.setState({
          redirectToList: true,

        })

      });
      res.fail((error) => {
        console.log(error)
      })

    } else {

      return false;
    }
  }

  UpdateTemplateMaster(data) {
    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var res = this.updateTemplateMasterApi(data);

      res.done((result) => {
        this.setState({
          redirectToList: true,

        })

      });
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

          var saveTemplateDetailIds = [];
          $(res).each((e, item) => {
            var templateDetail = {
              kraName: item.kraName,
              kpiTitle: item.kpiTitle
            };
            saveTemplateDetailIds.push(templateDetail);
          });

          this.$el
            .DataTable()
            .clear()
            .rows.add(saveTemplateDetailIds)
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
          data: "kraName",
          target: 0
        },
        {
          data: "kpiTitle",
          target: 1
        }
      ]
    });
    this.getKPIData();
    this.getKRAData();

  }
  render() {
    // const{templateData}=this.state;
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
                    value={this.state.templateName}
                    onChange={event => {
                      this.setState({
                        templateName: event.target.value
                      });
                    }}
                    required
                  />
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
                <th>KRA Name</th>
                <th>KPI Name</th>
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
