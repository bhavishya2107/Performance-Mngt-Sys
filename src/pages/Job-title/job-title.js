import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from '../Environment';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Jobtitlelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: []
        }
    }
    SingleDeleteConfirm(id){
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
                    this.SingleDelete(id);
                }
                else {

                }
            }
        });
    }
    //#region delete details
    SingleDelete(jobtitleId) {
        var res = this.DeletejobtitleApi(jobtitleId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Record Deleted Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            toast.error("Record Not Deleted", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }
    DeletejobtitleApi(jobtitleId) {

        const deleteJobTitleApiUrl = environment.apiUrl + 'jobtitle_master/' + `${jobtitleId}`

        return $.ajax({
            url: deleteJobTitleApiUrl,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    //#endregion
    Deletejobtitleconfirm(id){
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
                    this.Deletejobtitle(id);
                }
            }
        });
    }

    Deletejobtitle() {
        $("#tbljobtitle input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        var res = '';

        if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
                res = this.DeletejobtitleApi(item);
            });
            res.done(response => {
                toast.success("Jobtitle Deleted Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.$el.DataTable().ajax.reload();
            });
            res.fail(error => {

            });

        }
        else {
            toast.info("please select atleast one record!");
        }
        
    }
    checkall(e) {
        $("#tbljobtitle input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    componentDidMount() {
     const endpointGET = environment.apiUrl + 'jobtitle_master/'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: endpointGET,
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                
                {
                    data: "jobtitleId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="scalesetId" value=' + row.jobtitleId + ">"
                        );
                    }
                },
                {
                   data:null,
                    targets: 1,
                    "orderable": false,
                   
                },
                {
                    data: "jobtitleName",
                    targets: 2
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 3

                },

                {
                    data: "jobtitleId",
                    "orderable": false,
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/job-title/edit/id=' + row.jobtitleId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>"
                            +
                            '<a href="#" id="' + row.jobtitleId + '"class="btn btn-danger btnDelete btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],
            "fnRowCallback" : function(nRow, aData, iDisplayIndex){
                $("td:eq(1)", nRow).html(iDisplayIndex +1);
               return nRow;
            },
            initComplete: (settings, json) => {

                // $(".btnDeletejobtitle").on("click", e => {
                //     debugger;
                //     this.SingleDelete(e.currentTarget.id);
                // });
            },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                   
                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }
            
        });
    }
    render() {

        return (
            <div>
                <div>
                    <h2 className="clearfix mt-6">Job Title</h2>
                    <br/>
                    <button className=" btn-danger btn-md" onClick={() => {
                        this.Deletejobtitleconfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                    <div className="clearfix text-right mb-2">
                        <Link to="/job-title/add" className="btn btn-primary btn-lg mb-3"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                </div>

                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tbljobtitle"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr><th width="20">
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => {
                                        this.checkall(e);
                                    }}
                                />
                            </th>
                            <th width="50">Serial No</th>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                   
                </table>
                <ToastContainer />
            </div>
        )
    }
}
export default Jobtitlelist;