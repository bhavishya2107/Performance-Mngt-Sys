import {Link} from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
class Projects extends Component {
    constructor(props) {
        super(props);
        this.setState = {
            projectName: "",
            description: "",
            selectedIds: []
        }
    }
    SingleDelete(projectId) {
        var res = this.DeleteKpiApi(projectId);
        res.done(response => {
          if (response === 200) {
            alert("Data deleted");
            window.location.reload("")
          }this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
          alert("error");
        });
      }
      DeleteKpiApi  (projectId) {
        const endpoint = `http://192.168.10.109:3000/api/project_master/${projectId}`; 
        return $.ajax({
          url: endpoint,
          type: "DELETE",
          headers: {
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest",
       }
        });
      }
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/project_master",
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
                              '<a href="/EditProject/id=' + row.projectId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.projectId + '"class="btnDelete btn mr-2 delete btn-danger btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    orderable: false

                }
            ],
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    ;
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    ;
                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
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