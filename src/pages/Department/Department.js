import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import bootbox from 'bootbox';
$.DataTable = require('datatables.net-bs4');

class Department extends Component {
    constructor(props) {
        super(props);
        this.state = {
            depName: "",
            description: "",
            selectedIds: []
        }
    }


    //#region single delete functionality
    SingleDeleteDept(depId) {
        var res = this.DeleteDepApi(depId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Data deleted successfully");
            }
            this.$el.DataTable().ajax.reload()
        });
        res.fail(error => {
            toast.error("Data is not deleted!");
        });
    }
    singleDeleteDeptConfirm(id) {

        if (id !== undefined) {
            bootbox.confirm({
                message: "Delete this record ?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.SingleDeleteDept(id);
                    }
                    else {

                    }
                }
            });
        }
    }
    DeleteDepApi(depId) {
        // var url=environment.apiUrl+"depart"
        return $.ajax({
            url: "http://192.168.10.109:3000/api/department_master/" + depId,
            type: "DELETE"
        });
    }
    //#endregion
    //#region multiple delete functionality
    multipleDeleteDeptConfirm() {

        // if (id !== undefined) {
        bootbox.confirm({
            message: "Delete this record ?",
            buttons: {
                confirm: {
                    label: 'Yes',
                    className: 'btn-success'
                },
                cancel: {
                    label: 'No',
                    className: 'btn-danger'
                }
            },
            callback: (result) => {
                if (result === true) {
                    this.DeleteDept();
                }
            }
        });
    }

    DeleteDept() {

        $("#tblDepartment input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
                var res = this.DeleteDepApi(item);
                res.done(response => {
                      toast.success("Department Deleted Successfully !", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                });
                this.$el.DataTable().ajax.reload()
                res.fail(error => {

                });
            });
        } else {
            toast.info("please select atleast one record!")
        }
    }


    checkall(e) {
        $("#tblDepartment input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            "order": [[1, 'asc']],
            aaSorting: [[1, 'asc']],
           
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
                    data: "depId",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="depId" value=' + row.depId + ">"
                        )
                    },

                },
                {
                    data: null,
                    targets: 1,
                    "orderable": false,

                },
                {
                    data: "depName",
                    targets: 2,

                },
                {
                    data: "description",
                    targets: 3,
                    orderable: false
                },
                {
                    data: "depId",
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a class="btn mr-2 btn-edit btn-info btn-sm" href="/EditDept/depId=' + row.depId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</a>" +"" +
                            '<a href="#" id="' + row.depId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete " href="javascript:void(0);">' + '<i class="fa fa-trash" aria-hidden="true">' + '</a>'

                        )
                    },
                    "orderable": false
                }
            ],
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $("td:eq(1)", nRow).html(iDisplayIndex + 1);
                return nRow;
            },

            initComplete: (settings, json) => {
            },
            //#region drawcallback function
            "drawCallback": (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.singleDeleteDeptConfirm(e.currentTarget.id);
                });
            }
            //#endregion

        });
    }
    render() {
        return (
            <div className="">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">Department</h2>
                    <div className="col text-right">
                        <div className="text-right mb-3">
                            <Link to={{ pathname: '/AddDept' }} className="btn btn-sm btn-info mr-2" ><i class="fa fa-plus" aria-hidden="true"></i></Link>
                        </div>
                                            </div>
                                            <button className="btn btn-danger btn-multi-delete" onClick={() => { this.multipleDeleteDeptConfirm(); }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"

                    id="tblDepartment"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => { this.checkall(e); }} />
                            </th>
                            <th width="60">Sr.No</th>
                            <th>Department Name</th>
                            <th>Department Description</th>
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