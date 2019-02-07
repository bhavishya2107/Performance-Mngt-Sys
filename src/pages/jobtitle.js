import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from './Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Jobtitlelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds:[]
        }
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

        const endpoint = environment.apiUrl + 'jobtitle_master/' + `${jobtitleId}`

        return $.ajax({
            url: endpoint,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    //#endregion
    Deletejobtitle() {
       
        $("#tbljobtitle input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
                var res = this.DeletejobtitleApi(item);
                res.done(response => {
                    //  alert("data deleted Successfully.");
                    this.$el.DataTable().ajax.reload();
                });
                res.fail(error => { });
            });
        } 
        else {
            alert("please select atleast one record!");
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
                    data: "jobtitleName",
                    targets: 1
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 2

                },

                {
                    data: "jobtitleId",
                    "orderable": false,
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Editjobtitle/id=' + row.jobtitleId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>"
                            +
                            '<a href="#" id="' + row.jobtitleId + '"class="btn mr-2 delete btn-danger btn-sm btnDeletejobtitle" >' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],
            initComplete: (settings, json) => {

                $(".btnDeletejobtitle").on("click", e => {
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
                <button onClick={() => this.Deletejobtitle()}>Delete</button>
                <div className="clearfix text-right mb-2">
                    <Link to="/addjobtitle" className="btn btn-primary btn-sm ">Add</Link>
                </div>
                <table className="table table-striped table-bordered table-hover"
                        id="tbljobtitle"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                        <th  width="20">
                                <input
                                    type="checkbox"
                                    name="checkAll"
                                    onClick={e => {
                                        this.checkall(e);
                                    }}
                                />
                            </th>
                            <th>Job Title</th>
                            <th>Description</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                    <ToastContainer />
                </table>
            </div>
        )
    }
}
export default Jobtitlelist;