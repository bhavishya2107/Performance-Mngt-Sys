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
    SingleDelete(userId) {
        var res = this.DeleteUserApi(userId);
        res.done(response => {
            debugger;
            if (response.affectedRows > 0) {
                alert("Data deleted successfully");

            }
            // this.$el.DataTable().ajax.reload(null, false)
        });
        res.fail(error => {
            alert("Data is not deleted!");
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
    //#region multiple delete functionality
    DeleteUser() {
        $("#tblUser input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
                var res = this.DeleteUserApi(item);
                res.done(response => {
                    toast.success("Deleted User Successfully !", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                });

                res.fail(error => { });
            });
        } else {
            alert("please select atleast one record!");
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
        $(document).on("click", ".confirmDelete", (e) => {
            var id = e.currentTarget.id;
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
                        this.SingleDelete(id);
                    }
                    else {

                    }
                }
            });
        });
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
                            '<a  class="btn mr-2 btn-edit btn-info btn-sm" href="/Edit/userId=' + row.userId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" + " " +
                            '<a href="#" id="' + row.userId + '" class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);" ">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
                    },
                    "orderable": false
                }
            ],

            initComplete: (settings, json) => {

                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
    }


    render() {
        return (
            <div>
                <h1>User Management</h1>
                {
                    this.props.location.state === "2"
                }

                <div className="text-right mb-3">
                    <Link to={{ pathname: '/AddUser' }} className="btn btn-sm btn-info mr-2" role="submit">Add New User</Link>
                </div>
                <button
                    type="button"
                    className="btn btn-danger mb-5"
                    onClick={() => { this.DeleteUser(); }}>Delete</button>

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