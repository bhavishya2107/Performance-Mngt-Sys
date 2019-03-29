import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import bootbox from 'bootbox'
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
$.DataTable = require('datatables.net-bs4');


class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            userName: "",
            emailAddress: "",
            mobileNo: "",
            selectedIds: []


        }
    }
    //#region  Delete single element
    singleDeleteUser(userId) {
        var res = this.DeleteUserApi(userId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("User " + Notification.deleted);

            }
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {
            toast.error(Notification.deleteError);
        });
    }
    DeleteUserApi(userId) {
        var url = environment.apiUrl + moduleUrls.User + '/' + `${userId}`
        return $.ajax({
            url: url,
            type: Type.deletetype,
            dataSrc: "",
            error: function (xhr, status, error) {

            },
        });
    }
    singleDeleteUserConfirm(id) {

        if (id !== undefined) {
            if (id !== 2) {
                bootbox.confirm({
                    message: Notification.deleteConfirm,
                    buttons: {
                        confirm: {
                            label: 'ok',
                            className: 'btn-success'
                        },
                        cancel: {
                            label: 'Cancel',
                            className: 'btn-danger'
                        }
                    },
                    callback: (result) => {
                        if (result === true) {
                            this.singleDeleteUser(id);
                        }
                        else {

                        }
                    }
                });
            }
            else{
                alert("you cannot delete system user")
            }
        }
    }
    //#endregion
    //#region multiple delete functionality
    multipleUserDeleteApi(userId) {
        var url = environment.apiUrl + moduleUrls.User + '/bulk?_ids=' + `${userId}`;
        return $.ajax({
            url: url,
            type: Type.deletetype
        })
    }
    multipleDeleteUserConfirm() {
        var userId = []
        $("#tblUser input:checkbox:checked").each((e, item) => {
            if (item.value !== 2) {
                if (item.name !== "checkAll") {
                    userId.push(item.value);
                }
            }
        });
        if (userId.length > 0) {
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
                        this.multiDelete(userId);
                    }
                    else {
                     }
                },
            });
        }
        else {
            toast.error(Notification.deleteError)
        }
    }
    multiDelete(userId) {
        $("#tblUser input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        var item = userId.join(",") //for deleting multiple user
        var res = this.multipleUserDeleteApi(item);
        res.done(response => {
            toast.success("User " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload()
        });

        res.fail(error => {
            toast.error(Notification.deleteError)
        });
    }

    checkall(e) {
        $("#tblUser input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    
    componentDidMount() {
        const url = environment.apiUrl + moduleUrls.User + '/?_size=1000' + '/&_sort=-userId';
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
            columns: [
                {
                    data: "userId",
                    targets: 0, 
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="userId" value="' + row.userId + '">' +
                            '<i></i> ' +
                            '</label>'
                        )
                    },
                    orderable: false
                },           
                {
                    data: "firstName",
                    targets: 1,
                },
                {
                    data: "lastName",
                    targets: 2,
                },
                {
                    data: "userName",
                    targets: 3,
                },
                {
                    data: "emailAddress",
                    targets: 4,
                },
                {
                    data: "mobileNo",
                    targets: 5,
                },
                {
                    data: "userId",
                    targets: 6,
                    render: function (data, type, row) {
                        return (
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="/user-management/edit/userId=' + row.userId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
                            '<a href="#" id="' + row.userId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" href="javascript:void(0);" ">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'
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
                    this.singleDeleteUserConfirm(e.currentTarget.id);
                });
            }
        });
    }
    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> {ModuleNames.User}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/user-management/add' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteUserConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblUser"

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
                            <th width="100">First Name</th>
                            <th width="100">Last Name</th>
                            <th width="100" >User Name</th>
                            <th width="100">Email Address</th>
                            <th width="100">Mobile No</th>
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
export default UserManagement;