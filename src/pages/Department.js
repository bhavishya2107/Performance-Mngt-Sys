import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
$.DataTable = require('datatables.net-bs4');

class Department extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            depName: "",
            description: ""
        }
    }


    // deleted single element
    SingleDelete(depId) {
        var res = this.DeleteDepApi(depId);
        res.done(response => {
            if (response.affectedRows > 0) {
                alert("Data deleted successfully");
                this.$el.DataTable().ajax.reload(null, false)
            }
        });
        res.fail(error => {
            alert("Data is not deleted!");
        });
    }
    DeleteDepApi(depId) {
        console.log("http://192.168.10.109:3000/api/department_master/" + depId);
        return $.ajax({
            url: "http://192.168.10.109:3000/api/department_master/" + depId,
            type: "DELETE"
        });
    }
    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: "http://192.168.10.109:3000/api/department_master",
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [

                {
                    data: "depName",
                    targets: 1,

                },
                {
                    data: "description",
                    targets: 2,

                },
                {
                    data: "depId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            // '<a href="/' + row.depId + '"class="mr-3">' +
                            // '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '<a href="/Edit/depId=' + row.depId + '">' + "Edit" + "</a>" + " " +
                            '<a href="#" id="' + row.depId + '" class="btnDelete">' + "Delete" + '</a>'
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
    render() {
        return (

            <div>
                {
                    this.props.location.state === "2"

                }
                <div className="text-right mb-3">
                    <Link to={{ pathname: '/AddDept' }} className="btn btn-sm btn-success mr-2" >Add Department</Link>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>depName</th>
                            <th>description</th>
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