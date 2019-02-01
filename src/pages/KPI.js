import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
// import {Redirect} from "react-router-dom";
const $ = require('jquery');
$.DataTable = require('datatables.net');

class KPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            KpiId: "",
            Target:"",
            kpiTitle: "",
            KpiDataDetails:"",
            Redirect:false,
        };
    }
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
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
                    className: "text-center",
                    targets: 0
                },
                {
                    data: "target",
                    className: "text-center",
                    targets: 1
                },
                               {
                    data: "",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/edit/' + row.kpiId + '"class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="/edit/' + row.kpiId + '">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"+ 
                            "orderable:false"
                            )
                    },
                },
            ]
        });
    }
    render() {
                return (

            <div>
            {
                this.props.location.state=="" && 
                <div className="alert alert-success" role="alert">
                <strong>Well done!</strong> You successfully read this important alert message.
                </div>
                }
                <div>
                    <Link to={{ pathname: '/AddKpi', }} className="btn btn-sm btn-success" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add KPI</Link>
                </div>
                <div className="page-header">
                <div>
                    <table className="table table-striped table-bordered table-hover"
                        id="tblKPI"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <ToastContainer />
                    </table>
</div>
                </div>
            </div>
        )

    }
}
export default KPI;
