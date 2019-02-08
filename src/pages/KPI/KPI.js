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
    SingleDeleteConfirm(id) {
        bootbox.confirm({
            message: "Are you sure you want to delete this record ?",
            buttons: {
                confirm: {
                    label: 'Ok',
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
    SingleDeleteKpi(kpiId) {
        var res = this.DeleteKpiApi(kpiId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Record Deleted Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            toast.error("Record Not Deleted", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }
    multipleDeleteKpiconfirm(id) {
        bootbox.confirm({
            message: "Are you sure you want to delete this record ?",
            buttons: {
                confirm: {
                    label: 'Ok',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'Cancel',
                    className: 'btn-danger'
                }
            },
            callback: (result) => {
                if (result === true) {
                    this.multipleDeleteKpi(id);
                }
            }
        });
    }
    multipleDeleteKpi() {
        $("#tblKpi input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        var res = '';
        if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
                res = this.DeleteKpiApi(item);
            });
            res.done(response => {
                toast.success("KPI Deleted Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.$el.DataTable().ajax.reload();
            });
            res.fail(error => {

            });

        }
        else {
            toast.info("please select atleast one record!");
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
  
    componentDidMount() {
      
        const endpointGET = environment.apiUrl + 'kpi_master/'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: endpointGET,
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
                    data:null,
                     targets: 1,
                     "orderable": false, 
                 },
                {
                    data: "kpiTitle",
                    targets: 2
                },
                {
                    data: "target",
                    targets: 3
                },
                {
                    data: "kpiId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/KPI/editkpi/id=' + row.kpiId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.kpiId + '"class="btn btn-danger btnDelete btn-sm";"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],
            "fnRowCallback" : function(nRow, aData, iDisplayIndex){
                $("td:eq(1)", nRow).html(iDisplayIndex +1);
               return nRow;
            },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {

                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }
        });
    }           
    render() {
        return (
            //#region table of kpi
            <div >
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">KPI</h2>
                    <div className="col text-right">
                        <Link to="/kpi/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.multipleDeleteKpiconfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
          <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th width="20"><input type="checkbox" onClick={(e) => { this.checkall(e); }}></input></th>
                                <th width="50">Sr.No</th>
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
