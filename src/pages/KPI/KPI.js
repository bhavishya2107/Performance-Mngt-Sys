import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, Type, moduleUrls, Notification } from '../Environment';
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

    //#region delete functionality with single and multiple api
    DeleteKpiApi(KpiId) {
        const endpoint = environment.apiUrl + moduleUrls.Kpi + '/' + `${KpiId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    SingleDeleteConfirm(id) {
        bootbox.confirm({
            message: Notification.deleteConfirm,
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
                toast.success("KPI " + Notification.deleted, {
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
    multiDeleteKpiApi(KpiId) {
        const endpoint = environment.apiUrl + moduleUrls.Kpi + `/bulk?_ids=${KpiId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteKpi(KpiId) {
        var item = KpiId.join(",")
        var res = this.multiDeleteKpiApi(item);
        res.done((response) => {
            toast.success("KPI " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
        });

    }
    multipleDeleteKpiconfirm() {
        var KpiId = []
        $("#tblKpi input:checkbox:checked").each((e, item) => {
            if (item.name != 'checkAll') {
                KpiId.push(item.value);
            }
        });
        if (KpiId.length > 0) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
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
                        this.multiDeleteKpi(KpiId);
                    }
                    else {
                    }
                }
            });
        }
        else {
            toast.info(Notification.selectOneRecord);
        }
    }
    //#endregion

    checkall(e) {
        $("#tblKpi input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#region Datatable 
    componentDidMount() {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi + '/' + '?&_sort=-kpiId'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            "order": [[1, 'asc']],
            ajax: {
                url: endpointGET,
                type: Type.get,
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
                            '<input type="checkbox" name="kpiId" value=' + row.kpiId + ' />'
                        )
                    },
                },
                {
                    data: null,
                    targets: 1,
                    "orderable": false,
                },
                {
                    data: "kpiTitle",
                    targets: 2
                },
                {
                    data: "target",
                    targets: 3,
                    "orderable": false,
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
            "createdRow": function (row, data, index) {

                $('td', row).eq(1).html(index + 1);
            },
            //#endregion
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
                                <th width="5"><input type="checkbox" name="checkAll" onClick={(e) => { this.checkall(e); }}></input></th>
                                <th width="5">Sr.No</th>
                                <th width="100">Name</th>
                                <th>Description</th>
                                <th width="100">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>
                <ToastContainer />
            </div>
            //#endregion
        )
    }
}
export default KPI;
