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
    multipleDeleteKPI() {
        $("#tblKpi input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
            bootbox.confirm({
                message: "Delete this record ?",
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
                        this.state.selectedIds.map(item => {
                            var res = this.DeleteKpiApi(item);
                            res.done(response => {                               
                                toast.success("Data deleted successfully.")
                                this.$el.DataTable().ajax.reload();
                            }); 
                        });
                    }                   
                }
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
    SingleDeleteKpi(projectId) {
        var res = this.DeleteKpiApi(projectId);
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
    componentDidMount() {
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
                        this.SingleDeleteKpi(id);
                    }
                    else {
                    }
                }
            });
        });
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
                            '<a href="#" id="' + row.kpiId + '"class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);"">' +
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
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteKpi(e.currentTarget.id);
                });
            },
            
            
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
