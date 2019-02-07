import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment } from '../Environment';
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
    SingleDeleteKpi(KpiId) {
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
    multipleDeleteKPI() {
        $("#tblKpi input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
             //#region multiple delete bootbox from chechbox
        $(document).on("click", ".confirmDelete", (e) => {
            var id = e.currentTarget.id;
            bootbox.confirm({
                message: "Are you sure you want to delete this record ?",
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
                        this.DeleteKpiApi(id);
                    }
                    else {
                    }
                }
            });
        });
        // #endregion
        //     this.state.selectedIds.map(item => {
        //         var res = this.DeleteKpiApi(item);
        //         res.done(response => {
        //             toast.success("Record Deleted Succesfully!", {
        //                 position: toast.POSITION.TOP_RIGHT
        //             });
        //             this.$el.DataTable().ajax.reload();
        //         });
        //         res.fail(error => { });
        //     });
            
        } else {
        }
    }
    checkall(e) {
        $("#tblKpi input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    SingleDeleteKpiConfirm(id){
        bootbox.confirm({
            message: "Are you sure you want to delete this record ?",
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
                    this.SingleDeleteKpi(id);
                }
                else {
                }
            }
        });
    }
    componentDidMount() {
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
                    data: "kpiId",
                    "orderable": false,
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<input type="checkbox" name="kpiId" value=' + row.kpiId + '" />'
                        )
                    },
                },
                {
                    data: "kpiTitle",
                    targets: 1
                },
                {
                    data: "target",
                    targets: 2
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
           
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteKpiConfirm(e.currentTarget.id);
                });
            },
            
            // drawCallback: (settings) => {
            //     $(".btnDelete").on("click", e => {
            //         this.multipleDeleteKPI(e.currentTarget.id);
            //     });
            // }
        });
    }
    render() {
        return (
            //#region table of kpi
            <div >

                <h1>KPI</h1>
                {this.props.location.state === "2222"}
                <button type="button" className="btn mr-2 delete btn-danger fa fa-trash" style={{ float: "left" }} onClick={() => { this.multipleDeleteKPI(); }}></button>
                <div className="clearfix text-right mb-2">
                    <Link to={{ pathname: '/kpi/add', }} className="btn btn-lg btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}></Link>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th width="20"><input type="checkbox" onClick={(e) => { this.checkall(e); }}></input></th>
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
