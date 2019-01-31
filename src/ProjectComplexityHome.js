import React, { Component } from 'react';
import { Link } from "react-router-dom";
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class ProjectComplexityHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            projectTypeId: "",
            projectTypeName:"",
            description: "",
            Redirect:false,
        };
    }
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/project_type_master",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "projectTypeId",
                    className: "text-center",
                    targets: 0
                },
                {
                    data: "projectTypeName",
                    className: "text-center",
                    targets: 1
                },
                {
                    data: "description",
                    className: "text-center",
                    targets: 2
                },
                {
                    data: "",
                    className: "text-center",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/' + row.id + '">' +
                            'Edit' +
                            "</a>" + " / " +
                            '<a href="/' + row.id+ '">' +
                            'Delete' +
                            "</a>"
                        )
                    }
                }
            ]
        });
    }

    render() {
        return (

    <div>
    {
        this.props.location.state=="" && 
        <div className="alert alert-success" role="alert">
        <strong>Well done!</strong> You successfully read this important alert message.
        </div>
        }
           
        <div>
            <Link to={{ pathname: '/AddProjectComplexity', }} className="btn btn-sm btn-success" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add</Link>

        </div>
        <div className="page-header">
            <table className="table table-striped table-bordered table-hover"
                id="tblKPI"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>Project Id</th>
                        <th>Project Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
            </table>

        </div>
    </div>
)

}
}
export default ProjectComplexityHome;
