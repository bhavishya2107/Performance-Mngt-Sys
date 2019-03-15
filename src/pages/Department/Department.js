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
            departmentName: "",
            description: "",
            selectedIds: []
        }
    }


    //#region single delete functionality
    SingleDeleteDept(departmentId) {
        var res = this.DeleteDepApi(departmentId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Department " + Notification.deleted);
            }
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {
            toast.error(Notification.deleteError);
        });
    }
    singleDeleteDeptConfirm(id) {

        if (id !== undefined) {
            if (id !== 259) {
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
    DeleteDepApi(departmentId) {
        var delDepartment = environment.apiUrl + moduleUrls.Department + '/' + `${departmentId}`
        return $.ajax({
            url: delDepartment,
            type: Type.deletetype
        });
    }
    //#endregion
    //#region multiple delete functionality
    multipleDeleteDeptApi(departmentId) {
        var multiDelDept = environment.apiUrl + moduleUrls.Department + '/bulk?_ids=' + `${departmentId}`;
        return $.ajax({
            url: multiDelDept,
            type: Type.deletetype
        })
    }
    multipleDeleteDeptConfirm() {
        var departmentId = []
        $("#tblDepartment input:checkbox:checked").each((e, item) => {
            if (item.value !== 259) {
                if (item.name !== "checkAll") {
                    departmentId.push(item.value);
                }
            }
        });
        if (departmentId.length > 0) {
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
                        this.multiDeleteDept(departmentId);
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
    multiDeleteDept(departmentId) {

        var item = departmentId.join(",")
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
        var url = environment.apiUrl + moduleUrls.Department + '/?_size=1000' + '/&_sort=-departmentId';
        this.$el = $(this.el);
        this.$el.DataTable({
            "sorting": [[0, 'asc']],
            "autoWidth": false,
            ajax: {
                url: url,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columnDefs: [
                { width: '5%', targets: 0 },
                { width: '20%', targets: 1 },
                { width: '65%', targets: 2 },
                { width: '10%', targets: 3 },

            ],
            columns: [
                {
                    data: "depId",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="departmentId" value="' + row.departmentId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    orderable: false

                },


                {
                    data: "departmentName",
                    targets: 1,

                },
                {
                    data: "description",
                    targets: 2,
                    orderable: false
                },
                {
                    data: "action",
                    className: "text-center",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a class="btn mr-2 btn-edit btn-info btn-sm" href="/department/edit/id=' + row.departmentId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + "" +
                            '<a href="#" id="' + row.departmentId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete " href="javascript:void(0);">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
                    },
                    "orderable": false
                }
            ],

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
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        name="checkAll"
                                        onClick={e => { this.checkall(e) }} />
                                    <i></i>
                                </label>
                            </th>
                            <th width="100"> Name</th>
                            <th width="100"> Description</th>
                            <th width="100">Action</th>
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