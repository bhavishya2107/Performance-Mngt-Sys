import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { environment, moduleUrls, Type } from "../Environment";
const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
var templateData = [];
class Addtemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayDatakra: "",
      displayDatakpi: "",
      selectkra: "",
      selectkpi: "",
      templateDataTable: [],
      templateName: "",
      id: props.match.params.id,
      redirectToList: false
    };
  }
  savetemplatenameApi() {
    var isvalidate = window.formValidation("#formtemplate");
    if (isvalidate) {
      var _this = this;

      var formData = {
        templateName: this.state.templateName
      };
      const templateSaveApi = environment.apiUrl + moduleUrls.Template;
      $.ajax({
        url: templateSaveApi,
        type: Type.post,
        data: formData,
        // dataType:"text",
        success: function(resultData) {
          alert("Save Complete");
          _this.setState({ redirectToList: true });
      
          
        }
      });
    } else {
      return false;
    }
    const saveTemplateUrl =
      environment.apiUrl + moduleUrls.Templatedetail + "/";

    $.ajax({
      url: saveTemplateUrl,
      type: Type.post,
      data: "",
      success: function(resultData) {
        console.log(resultData);
      }
    });
  }

  getjobtitleDetilsApi() {
    const designationApi =
      environment.apiUrl + moduleUrls.Designation + "/" + `${this.state.id}`;

    return $.ajax({
      url: designationApi,
      type: Type.get
    });
  }

  onChangekra(event) {
    this.setState({
      selectkra: event.target.value
    });
  }
  onChangekpi(event) {
    this.setState({
      selectkpi: event.target.value
    });
  }

  addtemplate() {
    var templateDataapi = {
      kraName: this.state.selectkra,
      kpiTitle: this.state.selectkpi
    };
    this.state.templateDataTable.push(templateDataapi);
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
            <option key={i.value} value={i.kpiTitle}>
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
            <option key={i.value} value={i.kraName}>
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

  componentDidMount() {
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
          <div className="dropdown">
            <label className="mr-2">Kra:</label>
            <select
              onChange={e => {
                this.onChangekra(e);
              }}
              className="btn btn-info dropdown-toggle md mr-3"
            >
              <option>select</option>
              {this.state.displayDatakra}
            </select>
            <label className="mr-2">Kpi:</label>
            <select
              onChange={e => {
                this.onChangekpi(e);
              }}
              className="btn btn-info dropdown-toggle md mr-3"
            >
              <option>select</option>
              {this.state.displayDatakpi}
            </select>
          </div>
          <br />
          <button id="btnTemplateDetail"
            onClick={() => this.addtemplate(this.state)}
            type="button"
            className="btn btn-success mr-5"
          >
            <i className="fa fa-plus" /> Add
          </button>
          <br />
          <table
            className="table table-striped table-bordered table-hover"
            ref={el => (this.el = el)}
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
