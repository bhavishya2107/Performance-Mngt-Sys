import React, { Component } from 'react';
import { Link } from "react-router-dom";
// import {Redirect} from "react-router-dom";
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class KPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            KpiId: "",
            Target: "",
            kpiTitle: "",
            KpiDataDetails: "",
            Redirect: false,
        };
    }
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: "http://192.168.10.109:3000/api/kpi_master/?_size=100",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "kpiTitle",
                    
                    targets: 0
                },
                {
                    data: "target",
                    
                    targets: 1
                },
                {
                    data: "",
                    
                    targets: 2,
                    render: function (data, type, row) {
                        return (
                            '<a href="/' + row.KpiId + '">' +
                            'Edit' +
                            "</a>" + " / " +
                            '<a href="/' + row.KpiId + '">' +
                            'Delete' +
                            "</a>"
                        )
                    },
                    "orderable": false
                }
            ]
            ,
            "drawCallback": function (settings) {
                window.smallTable();
            }
        });

    }
    render() {
        return (

            <div>
                {
                    this.props.location.state == "" &&
                    <div className="alert alert-success" role="alert">
                        <strong>Well done!</strong> You successfully read this important alert message.
                </div>
                }
                <div>
                    <Link to={{ pathname: '/AddKpi', }} className="btn btn-sm btn-success" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add KPI</Link>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKPI"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th width="90">Actions</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>

                </div>
            </div>
        )

    }
}
export default KPI;
