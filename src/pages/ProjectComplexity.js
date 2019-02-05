import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class ProjectComplexity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
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
                
                
            },
            columns: [
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
                                '<a href="/edit/' + row.id + '"class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                                '&nbsp' +
                                '<a href="/edit/' + row.Id + '">' +
                                '<i class="fa fa-trash" aria-hidden="true"></i>' +

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
    {/* {
        this.props.location.state=="" && 
        <div className="alert alert-success" role="alert">
        <strong>Well done!</strong> You successfully read this important alert message.
        </div>
        } */}
           
        <div>
            <Link to={{ pathname: '/AddProjectComplexity', }} className="btn btn-sm btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add</Link>

        </div>
        <div className="page-header">
            <table className="table table-striped table-bordered table-hover"
                id="tblKPI"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>

                        <th>Project Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <ToastContainer />
            </table>

        </div>
    </div>
)

}
}
export default ProjectComplexity;
