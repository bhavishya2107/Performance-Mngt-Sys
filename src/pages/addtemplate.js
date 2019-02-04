import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
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
            templateDataTable:[]

        };
    }
    onChangekra(event) {
        debugger;
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
        var templateDataapi={
            "kraName":this.state.selectkra,
            "kpiTitle":this.state.selectkpi
            
        }
        templateData.push(templateDataapi)
       
        this.setState({
            templateDataTable:templateData
        })
      
        this.$el = $(this.el);
        this.$el.DataTable({
            datasrc:templateData,
            data:templateData,
            columns: [
                {
                    data: "kraName",
                    target: 0
                },
                {
                    data: "kpiTitle",
                    target: 1
                },
            ]
 
        })  
    }

    getKPIData(){
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/kpi_master/?_size=1000',
            complete: (temp) => {

                console.log(temp);

                var tempvar = temp.responseJSON;

                var displayDataReturn = tempvar.map((i) => {
                    return (
                            <option value={i.kpiTitle}>{i.kpiTitle}</option>
                    )
                });
                this.setState({
                    displayDatakpi: displayDataReturn
                })

            },

        });
    }
    getKRAData(){
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/kra_master/?_size=1000',
            complete: (temp) => {

                console.log(temp);

                var tempvar = temp.responseJSON;

                var displayDataReturn = tempvar.map((i) => {
                    debugger;
                    return (
                            <option value={i.kraName}>{i.kraName}</option>
                    )
                });
                this.setState({
                    displayDatakra: displayDataReturn
                })

            },

        });
    }
    componentWillMount() {       
       this.getKPIData();
       this.getKRAData();
     
    }
    render() {
       
        // const{templateData}=this.state;
        return (
            <div>
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
                <button onClick={() => this.addtemplate(this.state)} type="button" className="btn btn-primary mr-5"><i className="fa fa-plus"></i> Add</button>
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
            </div>
        )
    }


}
export default Addtemplate;