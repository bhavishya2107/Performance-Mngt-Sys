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
                    data: "depName",
                    targets: 1,
                    className: "text-center"
                },
                {
                    data: "description",
                    targets: 2,
                    className: "text-center"
                },
                {
                    data: "depId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/edit/' + row.depId + '">' + 'Edit' + "</a>" + "/" +
                            '<a href="/delete/' + row.depId + '">' + 'Delete' + "</a>"
                        )
                    }
                }
            ]
        })
    }
    render() {
        return (

            <div>
                {
                    this.props.location.state === "2"

                }
                <table className="table table-striped table-bordered table-hover"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>depName</th>
                            <th>description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <ToastContainer />
                </table>
                {/* <Link to={{ pathname: '/AddDept' }} className="btn btn-sm btn-success mr-2" >Add Department</Link> */}
            </div >
        )
    }
}
export default Department;