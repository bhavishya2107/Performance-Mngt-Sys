import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { environment, Type, Notification, moduleUrls, ModuleNames } from '../Environment'
import bootbox from 'bootbox';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class ComplexityMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveComplexityMasterDetails: "",
            selectedIds: []
        };
    }

    //#region Delete functionality with single and multiple both
    DeleteComplexityMasterApi(complexityId) {
        const endpoint = environment.apiUrl + moduleUrls.ComplexityMaster + '/' + `${complexityId}`;
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
                    this.SingleDeleteComplexityMaster(id);
                }
                else {
                }
            }
        });
    }

    SingleDeleteComplexityMaster(complexityId) {
        var res = this.DeleteComplexityMasterApi(complexityId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Complexity " + Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Complexity will not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Complexity" + Notification.notdeleted)
            }
        });
    }

    multiDeleteComplexityMasterApi(complexityId) {
        const endpoint = environment.apiUrl + moduleUrls.ComplexityMaster + `/bulk?_ids=${complexityId}`;
        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteComplexityMaster(complexityId) {
        var item = complexityId.join(",")
        var res = this.multiDeleteComplexityMasterApi(item);
        res.done((response) => {
            toast.success("Complexity " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Complexity will not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Complexity" + Notification.notdeleted)
            }
        });
    }

    multipleDeleteComplexityMasterConfirm() {
        var complexityId = []
        $("#tblComplexityMaster input:checkbox:checked").each((e, item) => {
            if (item.name != 'checkAll') {
                complexityId.push(item.value);
            }
        });
        if (complexityId.length > 0) {
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
                        this.multiDeleteComplexityMaster(complexityId);
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
        $("#tblComplexityMaster input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }

    componentDidMount() {
        //#region datatable 
        const endpointGET = environment.apiUrl + moduleUrls.ComplexityMaster + '/' + '?&_sort=-complexityId'
        this.setState({
            title: ModuleNames.ComplexityMaster
        })
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            "order": [[0, 'asc']],
            ajax: {
                url: endpointGET,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "complexityId",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="assignId" value="' + row.complexityId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    "orderable": false,
                },
                {
                    data: "complexityName",
                    targets: 1

                },
                {
                    data: "description",
                    targets: 2,
                    "orderable": false,
                },
                {
                    data: "complexityId",
                    targets: 3,
                    className: "text-center",
                    render: function (data, type, row) {
                        return (
                            '<a href="/complexity-master/edit/id=' + row.complexityId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.complexityId + '"class="btn btn-danger btnDelete btn-sm";"">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false
                }
            ],

            //#endregion 

            //#region detete function id
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }
        });
    }
    //#endregion
    render() {
        return (
            //#region ComplexityMaster table(listed items)
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">{this.state.title}</h2>
                    <div className="col text-right">
                        <Link to="/complexity-master/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.multipleDeleteComplexityMasterConfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblComplexityMaster"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr className="container-fluid">
                                <th width="10">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            name="checkAll"
                                            onClick={e => { this.checkall(e) }} />
                                        <i></i>
                                    </label>
                                </th>
                                <th width="120" >Name</th>
                                <th>Description</th>
                                <th width="100">Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>

                    </table>
                    <ToastContainer />
                </div>
            </div>
            //#endregion
        )
    }
}
export default ComplexityMaster;
