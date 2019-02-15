import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment'
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import bootbox from 'bootbox';
$.DataTable = require('datatables.net-bs4');

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depName: "",
            description: "",
            selectedIds: []
        }
    }


    //#region single delete functionality
    SingleDeleteDept(depId) {
        var res = this.DeleteDepApi(depId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success( "Department" +Notification.deleted);
            }
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {
            toast.error(Notification.deleteError);
        });
    }
    singleDeleteDeptConfirm(id) {

        if (id !== undefined) {
            if (id != 259) {
                bootbox.confirm({
                    message: Notification.deleteConfirm,
                    buttons: {
                        confirm: {
                            label: 'Yes',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'No',
                            className: 'btn-danger'
                        }
                    },
                    callback: (result) => {
                        if (result === true) {
                            this.SingleDeleteDept(id);
                        }
                        else {

                        }
                    }
                });
            } else {
                alert("you cannot delete system department")
            }
        }
    }
    DeleteDepApi(depId) {
        var url = environment.apiUrl + moduleUrls.Department + '/' + `${depId}`
        return $.ajax({
            url: url,
            type: Type.deletetype
        });
    }
    //#endregion
    //#region multiple delete functionality
    multipleDeleteDeptApi(depId) {
        var url = environment.apiUrl + moduleUrls.Department + '/bulk?_ids=' + `${depId}`;
        return $.ajax({
            url: url,
            type: Type.deletetype
        })
    }
    multipleDeleteDeptConfirm() {

        debugger;
        var depId = []
        $("#tblDepartment input:checkbox:checked").each((e, item) => {
            if (item.value != 259) {
                if (item.name !== "checkAll") {
                    depId.push(item.value);
                }
            }
        });
        if (depId.length > 0) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.multiDeleteDept(depId);
                    }
                    else {
                    }
                }
            });
        }
        else {
            toast.info(Notification.deleteInfo)
        }

    }
    multiDeleteDept(depId) {

        var item = depId.join(",")
        var res = this.multipleDeleteDeptApi(item);
        res.done(response => {
            toast.success("Department " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {

        });

    }


    checkAll(e) {
        $("#tblDepartment input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    componentDidMount() {
        var url = environment.apiUrl + moduleUrls.Department + '/?_size=1000' + '/&_sort=-depId';
        this.$el = $(this.el);
        this.$el.DataTable({
            "sorting": [[1, 'asc']],
            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [
                {
                    data: "depId",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="depId" value=' + row.depId + ">"
                        )
                    },
                    orderable: false

                },
                // {
                //     data: null,
                //     targets: 1,
                //     "orderable": false,

                // },
                {
                    data: "depName",
                    targets: 1,

                },
                {
                    data: "description",
                    targets: 2,
                    orderable: false
                },
                {
                    data: "depId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a class="btn mr-2 btn-edit btn-info btn-sm" href="/EditDept/depId=' + row.depId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + "" +
                            '<a href="#" id="' + row.depId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete " href="javascript:void(0);">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
                    },
                    "orderable": false
                }
            ],
            // "createdRow": function (row, data, index) {

            //     $('td', row).eq(1).html(index + 1);
            // },

            initComplete: (settings, json) => {
            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.singleDeleteDeptConfirm(e.currentTarget.id);
                });
            }
            //#endregion

        });
    }
    render() {
        return (
            <div className="">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">{ModuleNames.Department}</h2>
                    <div className="col text-right">
                        <div>
                            <Link to={{ pathname: '/AddDept' }} className="btn btn-primary" ><i className="fa fa-plus" aria-hidden="true"></i></Link>
                        </div>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteDeptConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"

                    id="tblDepartment"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr className="container-fluid">
                            <th width="10">
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => { this.checkAll(e); }} />
                            </th>
                            {/* <th width="50">Sr.No</th> */}
                            <th width="100"> Name</th>
                            <th width="100"> Description</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div >

        )
    }
}
export default Department;