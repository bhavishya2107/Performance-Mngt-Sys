import { ToastContainer, toast } from 'react-toastify';

import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
$.DataTable = require('datatables.net-bs4');


class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.setState = {
            firstName: "",
            lastName: "",
            emailAddress: "",
           
        }
    }
   //Delete single element
    SingleDelete(userId) {
        var res = this.DeleteUserApi(userId);
        res.done(response => {
            debugger;
            if (response.affectedRows > 0) {
                alert("Data deleted successfully");
                this.$el.DataTable().ajax.reload(null, false)
            }
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

    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
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
                    data: "firstName",
                    targets: 1,

                },
                {
                    data: "lastName",
                    targets: 2,
                },
                {
                    data: "emailAddress",
                    targets: 3,
                },
                {
                    data: "userId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Edit/userId=' + row.userId + '">' + "Edit" + "</a>" + " " +
                            '<a href="#" id="' + row.userId + '" class="btnDelete">' + "Delete" + '</a>'
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

            "drawCallback":  (settings) =>  {
                window.smallTable();
                $(".btnDelete").on("click", e => {                 
                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
    }

    //bind the dropdown list
    render() {
        return (
            //to add the data to the table 
            <div>
                {
                    this.props.location.state === "2"
                }
                <div className="text-right mb-3">
                    <Link to={{ pathname: '/AddUser' }} className="btn btn-sm btn-success mr-2" role="submit">Add User</Link>

                </div>

                <table className="table table-striped table-bordered table-hover customDataTable"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email Address</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                </table>
                <ToastContainer />
            </div>
        )
    }
}
export default UserManagement;