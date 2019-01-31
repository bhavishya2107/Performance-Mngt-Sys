import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
$.DataTable = require('datatables.net-bs4');

class Department extends Component {

    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/department_master/?_size=1000",
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [
                {
                    data: "depId",
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<a href="/edit/' + row.id + '">' + 'Edit' + "</a>" + "/"
                        )
                    }
                },
                {
                    data: "depName",
                    targets: 1,
                    className: "text-center"
                },
                {
                    data: "description",
                    targets: 2,
                    className: "text-center"
                },
                // {
                //     data:"depId",
                //     targets:3,
                //     render: function (data, type, row){
                //         return(
                //             '<a href="/edit/' + row.id + '">' + 'Edit' + "</a>" + "/" +
                //             '<a href="/delete/' + row.id + '">' + 'Delete' + "</a>"
                //         )
                //     }
                // }
            ]
        })
    }
    render() {
        return (
            <div>
                <table className="table table-striped table-bordered table-hover"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>depName</th>
                            <th>description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
                <Link to={{ pathname: '/AddDept' }} >Add Department</Link>
            </div>
        )
    }
}
export default Department;