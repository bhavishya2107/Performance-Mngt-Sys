import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
// import {Redirect} from "react-router-dom";
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class KPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveKpiDetails: "",
            selectedIds: []
        };
    }

    //#region delete Kpi function
    SingleDelete(KpiId) {
        var res = this.DeleteKpiApi(KpiId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Record Deleted Succesfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            alert("error");
        });
    }
    DeleteKpiApi(KpiId) {
        const endpoint = `http://192.168.10.109:3000/api/kpi_master/${KpiId}`;
        return $.ajax({
            url: endpoint,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
//#endregion
   

componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/kpi_master",
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
                    data: "kpiId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditKpi/id=' + row.kpiId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.kpiId + '"class="btnDelete btn mr-2 delete btn-danger btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
    }
    render() {
        return (
//#region table of kpi
            <div >
                
                {this.props.location.state === "2222"}
                <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/AddKpi', }} className="btn btn-sm btn-primary" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add</Link>

                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th width="90">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <ToastContainer />
                    </table>
                </div>
            </div>
            //#endregion
        )
    }
}
export default KPI;
