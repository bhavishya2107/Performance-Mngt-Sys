import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { environment, Type, Notification, moduleUrls, ModuleNames } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Scalesetlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],
            title: ""
        }
    }

    //#region Delete Scale set functions

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
                    this.SingleDelete(id);
                }
                else {

                }
            }
        });

    }
    SingleDelete(scaleSetId) {
        var res = this.DeletescalesetApi(scaleSetId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Scaleset " + Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Scale Set were not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Scaleset" + Notification.notdeleted)
            }
        });
    }
    DeletescalesetApi(scaleSetId) {

        const singleDeleteAPIUrl = environment.apiUrl + moduleUrls.ScaleSet + '/' + `${scaleSetId}`;
        return $.ajax({
            url: singleDeleteAPIUrl,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    multiDeletescalesetApi(scaleSetId) {

        const multiDeleteAPIUrl = environment.apiUrl + moduleUrls.ScaleSet + '/bulk?_ids=' + `${scaleSetId}`;
        return $.ajax({
            url: multiDeleteAPIUrl,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    //#endregion
    multiDelete(scaleSetId) {

        var item = scaleSetId.join(",")
        var res = this.multiDeletescalesetApi(item);
        res.done((response) => {

            toast.success("Scaleset " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Scale Set were not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Scaleset" + Notification.notdeleted)
            }
        });

    }
    multipleDeleteScalesetconfirm() {
        debugger;
        var scaleSetId = []
        $("#tblscaleset  input:checkbox:checked ").each((e, item) => {
            if (item.name != 'checkAll') {

                scaleSetId.push(item.value);
            }
        });
        if (scaleSetId.length > 0) {

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
                        this.multiDelete(scaleSetId);
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

    checkall(e) {
        $("#tblscaleset  input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    componentDidMount() {
        //#region Data table realted Block
        const scalesetGET = environment.apiUrl + moduleUrls.ScaleSet + '/?_size=1000' + '&_sort=-scaleSetId'
        
        this.setState({
            title: ModuleNames.ScaleSet
        })
        this.$el = $(this.el);

        this.$el.DataTable({
            "autoWidth": false,
          //  "order": [[1, 'asc']],

            ajax: {
                url: scalesetGET,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },

            },
            columns: [
                {
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input className="chkDelete" type="checkbox" name="scalesetId" value=' + row.scaleSetId + ">"
                        );
                    }
                },
                // {
                //     data: null,
                //     targets: 1,
                //     "orderable": false,
                // },
                {
                    data: "scaleSetName",
                    targets: 1
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 2

                },

                {
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/scale-set/edit/id=' + row.scaleSetId + '"class=" btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.scaleSetId + '"class="btn btn-danger btnDelete btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],
            // "createdRow": function (row, data, index) {

            //     $('td', row).eq(1).html(index + 1);
            // },
            // "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            //     $("td:eq(1)", nRow).html(iDisplayIndex + 1);
            //     return nRow;
            // },
            initComplete: (settings, json) => {

                // $(".btnDeletescaleset").on("click", e => {

                //     this.SingleDelete(e.currentTarget.id);
                // });
            },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {

                    this.SingleDeleteConfirm(e.currentTarget.id);

                });
                // $(".confirmbtnmulti").on("click", e => {

                //     this.multipleDeleteScalesetconfirm(e.id);

                // });
            }
        });
        //#endregion


    }

    render() {
        return (
            <div className="">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">{this.state.title}</h2>
                    <div className="col text-right">
                        <Link to="/scale-set/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.multipleDeleteScalesetconfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblscaleset"
                    ref={el => (this.el = el)}>
                    <thead>

                        <tr>
                            <th width="20">
                                <input

                                    type="checkbox"

                                    name="checkAll"
                                    onClick={e => {
                                        this.checkall(e);
                                    }}
                                />
                            </th>
                            {/* <th width="5">Sr.No</th> */}
                            <th width="100">Name</th>
                            <th>Description</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div>
        )
    }
}

export default Scalesetlist;


