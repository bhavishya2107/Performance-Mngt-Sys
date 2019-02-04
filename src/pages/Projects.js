import {Link} from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
$.DataTable = require('datatables.net-bs4');

class Projects extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            projectName: "",
            description: ""
        }
    }

    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/project_master/",
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {

                },
            },

            columns: [

                {
                    data: "projectName",
                    targets: 1,
                    className: "text-center"
                },
                {
                    data: "description",
                    targets: 2,
                    className: "text-center"
                },
                {
                    data: "projectId",
                    targets: 3,
                    className: "text-center",
                    render: function (data, type, row) {
                        return (
                            '<a href="/edit/' + row.projectId + '">' + 'Edit' + "</a>" + "/" +
                            '<a href="/delete/' + row.projectId + '">' + 'Delete' + "</a>"

                        )
                    }
                }
            ]
        })
    }

    render() {
        return (
            <div>
                 <div className="text-right mb-3">
                 <Link to={{ pathname: '/AddProject', }} className="btn btn-sm btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add Project</Link>
                </div>
                <table className="table table-striped table-bordered table-hover"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th>depName</th>
                            <th>description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <ToastContainer/>
                </table>
                    
            </div >
        )
    }
}
export default Projects;