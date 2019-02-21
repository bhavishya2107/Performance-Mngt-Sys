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
      tempDetailId: []
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
      kraId: event.target.value
    });
  }
  onChangekpi(event) {
    debugger
    this.setState({
      selectkpi:
      {
        ID: event.target.value,
        Name: event.target.options[event.target.selectedIndex].text

      },
      kpiId: event.target.value
    });
  }

  addtemplate() {
    debugger;
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
  // data(){
  //   var temp = templateTblId.map((i) => {
  //     return (
  //         <>
  //            <li>{i.Id}</li> 
  //             </>

  //     )
  // });
  // this.setState({
  //     tempDetailId: temp
  // })
  // }
  componentDidMount() {
    this.$el = $(this.el); debugger;

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
            <h2 className="col">Add Template</h2>
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
          <div className="form-group">
            <button
              onClick={() => this.savetemplatenameApi()}
              type="button"
              className="btn btn-success mr-2"
            >
              SAVE
            </button>
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
      </div>
    );
  }
}
export default Addtemplate;
