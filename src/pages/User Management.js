import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
import bootbox from 'bootbox'
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
            debugger;
            if (response.affectedRows > 0) {
                toast.success("User Deleted successfully");

            }
        });
        res.fail(error => {
            toast.error("Data is not deleted!");
        });
    }
    DeleteUserApi(userId) {
        return $.ajax({
            url: "http://192.168.10.109:3000/api/user_master/" + userId,
            type: "DELETE",
            dataSrc: "",
            error: function (xhr, status, error) {

            },
        });
    }
    singleDeleteUserConfirm(id) {

        if (id !== undefined) {
            bootbox.confirm({
                message: "Delete this record ?",
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
                        this.singleDeleteUser(id);
                    }
                    else {

                    }
                }
            });
        }
    }

    //#region multiple delete functionality
    multipleDeleteUserConfirm() {

        // if (id !== undefined) {
        bootbox.confirm({
            message: "Delete this record ?",
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
                    this.DeleteUser();
                }
            }
        });
    }

    DeleteUser() {
        $("#tblUser input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {

            this.state.selectedIds.map(item => {
                var res = this.DeleteUserApi(item);

                res.done(response => {

                });
                this.$el.DataTable().ajax.reload()
                res.fail(error => {

                });
            });
        }
         else {
            toast.info("please select atleast one record!")
        }
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
    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            "order": [[1, 'asc']],
            "autoWidth": false,
            ajax: {
                url: "http://192.168.10.109:3000/api/user_master/",
                type: "get",
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
                            '<input type="checkbox" name="userId" value=' + row.userId + ">"
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
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="/EditUser/userId=' + row.userId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
                            '<a href="#" id="' + row.userId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete" href="javascript:void(0);" ">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

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
                    this.singleDeleteUserConfirm(e.currentTarget.id);
                });
                // $(".btnDeleteAll").on("click", e => {
                //     this.multipleDeleteUserConfirm(e.currentTarget.id);
                // });
            }
        });
    }


    render() {
        return (
            <div>
                 <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">User Management</h2>
                    <div className="col text-right">
                        <Link  to={{ pathname: '/AddUser' }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete"  onClick={() => { this.multipleDeleteUserConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tblUser"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => { this.checkall(e) }} />
                            </th>

                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>Mobile No</th>
                            <th width="90">Action</th>
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