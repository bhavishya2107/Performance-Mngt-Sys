import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment } from './Environment';
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
    // {
    //     this.$el = $(this.el);
    //     this.$el.DataTable({
    //         ajax: {
    //             url: "http://192.168.10.109:3000/api/kpi_master",
    //             type: "GET",
    //             dataSrc: "",
    //             error: function (xhr, status, error) {
    //             },
    //         },
    componentDidMount() {
     
        $(document).on("click", ".confirmDelete", (e) => {
            alert("123")
            var id = e.currentTarget.id;
            bootbox.confirm({
                message: "Delete this record ?",
                buttons: {
                    confirm: {
                        label: 'OK',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.SingleDelete(id);
                    }
                    else {

                    }
                }
            });
        });

     
        this.$el = $(this.el);
        var apiUrl = environment.apiUrl + "kpi_master";
        this.$el.DataTable({
            ajax: {
                url: apiUrl,
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
                            '<a href="#" id="' + row.kpiId + '"class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);"">' +
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
                <h1>KPI</h1>
                {this.props.location.state === "2222"}
                <div className="clearfix text-right mb-2">
                    <Link to={{ pathname: '/AddKpi', }} className="btn btn-lg btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}></Link>

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
