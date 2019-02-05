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
    saveKpiDetails() {
        alert("hi")
    }
    SingleDelete(kpiId) {
        var res = this.DeleteKpiApi(kpiId);
        res.done(response => {
            if (response === 200) {
                alert("Data deleted");
                window.location.reload("")
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
    // DeleteAlbum() {
    //     $("#tblKpi input:checkbox:checked").each((e, item) => {
    //         this.state.selectedIds.push(item.value);
    //     });
    //     if (this.state.selectedIds.length > 0) {
    //         this.state.selectedIds.map(item => {
    //             var res = this.DeleteKpiApi(item);
    //             res.done(response => {
    //                 alert("data deleted Successfully.");
    //             });
    //             res.fail(error => { });
    //         });
    //     } else {
    //         alert("please select atleast one record!");
    //     }
    // }
    // checkall(e) {
    //     $("#tblKpi input:checkbox").each((index, item) => {
    //         if ($(e.currentTarget).is(":checked") === true) {
    //             $(item).prop("checked", true);
    //         } else {
    //             $(item).prop("checked", false);
    //         }
    //     });
    // }
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
                    data: "KpiId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditKpi/kpiid=' + row.KpiId + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" kpiid="' + row.KpiId + '"class="btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },

                    "orderable": false
                }
            ],

            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    debugger;
                    this.SingleDelete(e.currentTarget.kpiId);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    debugger;
                    this.SingleDelete(e.currentTarget.kpiId);
                });
            }
        });
    }
    render() {
        return (

            <div>
                {this.props.location.state === "2222"}
                <div>
                    <Link to={{ pathname: '/AddKpi', }} className="btn btn-sm btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add KPI</Link>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <ToastContainer />
                    </table>

                </div>
            </div>
        )

    }
}
export default KPI;
