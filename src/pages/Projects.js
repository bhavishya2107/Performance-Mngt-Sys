import React, { Component } from 'react';
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
                url: "http://192.168.10.109:3000/api/project_master/?_size=1000",
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
                {/* <Link to={{ pathname: '/AddProjects' }} className="btn btn-sm btn-success mr-2" >Add Project</Link> */}

            </div >
        )
    }
}
export default Projects;