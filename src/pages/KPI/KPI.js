import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
import { environment, Type, Notification, moduleUrls, ModuleNames } from '../Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class KPI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveKpiDetails: "",
        };
    }

    //#region delete functionality with single and multiple api
    DeleteKpiApi(kpiId) {
        const endpoint = environment.apiUrl + moduleUrls.Kpi + '/' + `${kpiId}`;
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
            if (error.status === 400) {
                toast.error("Some of KPI will not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("KPI" + Notification.notdeleted)
            }
        });
    }
    multiDeleteKpiApi(kpiId) {
        const endpoint = environment.apiUrl + moduleUrls.Kpi + `/bulk?_ids=${kpiId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteKpi(kpiId) {
        var item = kpiId.join(",")
        var res = this.multiDeleteKpiApi(item);
        res.done((response) => {
            toast.success("KPI " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of KPI will not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("KPI" + Notification.notdeleted)
            }
        });
    }

    multipleDeleteKpiconfirm() {
        var kpiId = []
        $("#tblKpi input:checkbox:checked").each((e, item) => {
            if (item.name != 'checkAll') {
                kpiId.push(item.value);
            }
        });
        if (kpiId.length > 0) {
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
                        this.multiDeleteKpi(kpiId);
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

    componentDidMount() {
        //#region Datatable 
        const endpointGET = environment.dynamicUrl + 'dynamic'
        this.setState({
            title: ModuleNames.kpi
        })
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: endpointGET,
                type: "POST",
                dataSrc: "",
                data: {
                    query: "select Kpi_Master.kpiId, Kpi_Master.kpiTitle,Kpi_Master.target, Kpi_Master.weightage, scale_set_master.scalesetName FROM Kpi_Master left join scale_set_master On Kpi_master.scalesetid = scale_set_master.scalesetId order by kpiId desc"
                },
            },
            columns: [
                {
                    data: "kpiId",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="assignId" value="' + row.kpiId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    "orderable": false,
                },
                {
                    data: "kpiTitle",
                    targets: 1
                },
                {
                    data: "weightage",
                    targets: 2
                },
                {
                    data: "target",
                    targets: 3
                },
                {
                    data: "scalesetName",
                    targets: 4
                },
                {
                    data: "kpiId",
                    targets: 5,
                    className: "text-center",
                    render: function (data, type, row) {
                        return (
                            '<a href="/kpi/edit/id=' + row.kpiId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
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
                    <h2 className="col">{this.state.title}</h2>
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
                                <th width="10">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            name="checkAll"
                                            onClick={e => { this.checkall(e) }} />
                                        <i></i>
                                    </label>
                                </th>
                                <th  width="100" >Name</th>
                                <th  width="100" >Weightage</th>
                                <th  width="100">Target</th>
                                <th width="100" >Scale Set</th>
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
