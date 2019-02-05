import React, { Component } from 'react';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
var templateData = []
class Addtemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RedirectToSample: false,
            displayDatakra: "",
            displayDatakpi: "",
            selectkra: "",
            selectkpi: "",
            templateDataTable: [],
            templateName: "",
            id:""

        };
    }
    savetemplatenameApi() {
        var _this = this;

        var formData = {
            "templateName": this.state.templateName,


        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/template_master",
            type: "POST",
            data: formData,
            // dataType:"text",           
            success: function (resultData) {
                alert("Save Complete");
                // _this.setState({ redirectToList: true });
                // toast.success("Success Notification !", {
                //     position: toast.POSITION.TOP_RIGHT
                // });

            }
        });
    }


    onChangekra(event) {
        this.setState({
            selectkra: event.target.value

        })
    }
    onChangekpi(event) {
        this.setState({
            selectkpi: event.target.value

        })
    }

    addtemplate() {
        debugger;
        var templateDataapi = {
            "kraName": this.state.selectkra,
            "kpiTitle": this.state.selectkpi
        }
        templateData.push(templateDataapi);
        this.$el.DataTable().clear().rows.add(templateData).draw();
    }

    getKPIData() {
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/kpi_master/?_size=1000',
            complete: (temp) => {
                var tempvar = temp.responseJSON;
                var displayDataReturn = tempvar.map((i) => {
                    return (
                        <option key={i.value} value={i.kpiTitle}>{i.kpiTitle}</option>
                    )
                });
                this.setState({
                    displayDatakpi: displayDataReturn
                })
            },

        });
    }
    getKRAData() {
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/kra_master/?_size=1000',
            complete: (temp) => {
                var tempvar = temp.responseJSON;
                var displayDataReturn = tempvar.map((i) => {
                    return (
                        <option key={i.value} value={i.kraName}>{i.kraName}</option>
                    )
                });
                this.setState({
                    displayDatakra: displayDataReturn
                })

            },

        });
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

        })
        this.getKPIData();
        this.getKRAData();

    }
    render() {
        // const{templateData}=this.state;
        return (
            <div>
                {/* {this.state.id !== undefined ? <div>edit</div> :
              <div>Add</div>} */}
<div>Edit
                <div className="dropdown">
                        <label className="mr-2">Kra:</label>
                        <select onChange={(e) => { this.onChangekra(e) }} className="btn btn-info dropdown-toggle md mr-3">
                            <option>select</option>
                            {this.state.displayDatakra}
                        </select>
                        <label className="mr-2">Kpi:</label>
                        <select onChange={(e) => { this.onChangekpi(e) }} className="btn btn-info dropdown-toggle md mr-3">
                            <option>select</option>
                            {this.state.displayDatakpi}
                        </select>
                    </div>
                    <br />
                    <button onClick={() => this.addtemplate(this.state)} type="button" className="btn btn-success mr-5"><i className="fa fa-plus"></i> Add</button>
                    <br />
                    <table className="table table-striped table-bordered table-hover"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>KRA Name</th>
                                <th>KPI Name</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                    <button onClick={() => this.savetemplateApi()} type="button" className="btn btn-primary">SAVE</button>
                </div>
                <div>
<h1>Add</h1>
<form id="formtemplate" className="col-6">
    <div className="form-group">
        <label>Template Name</label>
        <input className="form-control" value={this.state.templateName}
            onChange={(event) => {
                this.setState({
                    templateName: event.target.value
                })
            }} />
    </div>
    <button onClick={() => this.savetemplatenameApi()} type="button" className="btn btn-primary">SAVE</button>

</form>

</div>
            </div>
        )
    }


}
export default Addtemplate;


