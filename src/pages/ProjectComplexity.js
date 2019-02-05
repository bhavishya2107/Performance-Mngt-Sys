import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net');

class ProjectComplexity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saveProjectComplexityDetails:"",
            selectedIds: []
        };
    }
       SingleDelete(projectId) {
        var res = this.DeleteKpiApi(projectId);
        res.done(response => {
            if (response === 200) {
                alert("Data deleted");
                window.location.reload("")
            } this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            alert("error");
        });
    }
    DeleteKpiApi(projectId) {
        const endpoint = `http://192.168.10.109:3000/api/project_type_master/${projectId}`;
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
                url: "http://192.168.10.109:3000/api/project_type_master",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "projectTypeName",
                    targets: 0
                },
                {
                    data: "description",
                    targets: 1
                },

                {
                    data: "projectTypeId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditProjectComplexity/id=' + row.projectTypeId + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.projectTypeId + '"class="btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                }
            ],
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
                    debugger;
                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {
                    debugger;
                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
    }

    render() {
        return (

            <div>
                {this.props.location.state === "2222"}
                <div>
                    <Link to={{ pathname: '/AddProjectComplexity', }} className="btn btn-sm btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add KPI</Link>
                </div>
                <div className="page-header">
                    <table className="table table-striped table-bordered table-hover customDataTable"
                        id="tblKpi"
                        ref={el => (this.el = el)}>
                        <thead>
                            <tr>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                        <ToastContainer />
                    </table>

                </div>
            </div>
        )

    }
}
//     render() {

//         return (

//     <div>
//     {/* {
//         this.props.location.state=="" && 
//         <div className="alert alert-success" role="alert">
//         <strong>Well done!</strong> You successfully read this important alert message.
//         </div>
//         } */}
           
//         <div>
//             <Link to={{ pathname: '/AddProjectComplexity', }} className="btn btn-sm btn-primary fa fa-plus" role="submit" style={{ textDecoration: "none", float: "Right" }}>Add</Link>

//         </div>
//         <div className="page-header">
//             <table className="table table-striped table-bordered table-hover"
//                 id="tblKPI"
//                 ref={el => (this.el = el)}>
//                 <thead>
//                     <tr>

//                         <th>Project Name</th>
//                         <th>Description</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <ToastContainer />
//             </table>

//         </div>
//     </div>
// )

// }
// }
export default ProjectComplexity;
