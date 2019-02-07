import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Scalesetlist extends Component {
    constructor(props) {
        super(props); debugger;
        this.state = {
            selectedIds: []
        }
    }

    //#region Delete Scale set functions
    SingleDelete(scaleSetId) {
        var res = this.DeletescalesetApi(scaleSetId);
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
    DeletescalesetApi(scaleSetId) {

        const endpoint = environment.apiUrl + 'scale_set_master/' + `${scaleSetId}`;
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
    multipleDeleteScaleset() {
       
        $("#tblscaleset input:checkbox:checked").each((e, item) => {
            this.state.selectedIds.push(item.value);
        });
        if (this.state.selectedIds.length > 0) {
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
                        this.state.selectedIds.map(item => {
                            var res = this.DeletescalesetApi(item);
                            res.done(response => {                               
                                //toast.success("Data deleted successfully.")
                                this.$el.DataTable().ajax.reload();
                            });
                            res.fail(error => { 
                                toast.error("Delete Fail.");
                            });
                        });
                    }                   
                }
            });
        } 
        else {
            toast.info("please select atleast one record!");
        }
    }
    checkall(e) {
        $("#tblscaleset input:checkbox").each((index, item) => {
          if ($(e.currentTarget).is(":checked") === true) {
            $(item).prop("checked", true);
          } else {
            $(item).prop("checked", false);
          }
        });
      }
    componentDidMount() {

       
        $(document).on("click", ".confirmDelete", (e) => {
            var id = e.currentTarget.id;
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
        });
        //#region Data table realted Block
        const endpointGET = environment.apiUrl + 'scale_set_master/'
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
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="scalesetId" value=' + row.scaleSetId + ">"
                        );
                    }
                },
                {
                    data:null,
                     targets: 1,
                     "orderable": false,
                    
                 },
                {
                    data: "scaleSetName",
                    targets: 2
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 3

                },

                {
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 4,
                    render: function (data, type, row) {
                        return (
                            '<a href="/scale-set/edit/id=' + row.scaleSetId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.scaleSetId + '"class="btn btn-danger btn-sm confirmDelete" href="javascript:void(0);"">' +
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

                $(".btnDeletescaleset").on("click", e => {

                    this.SingleDelete(e.currentTarget.id);
                });
            },
            drawCallback: (settings) => {
                $(".btnDelete").on("click", e => {

                    this.SingleDelete(e.currentTarget.id);
                });
            }
        });
        //#endregion

        
    }

    render() {
        return (
            <div className="">
                
                <div>
                    <h2 className="clearfix mt-6">Scale Set</h2>
                    <br/>
                    <button class=" btn-danger btn-md" onClick={()=>{
                        this.multipleDeleteScaleset()
                    }}><i class="fa fa-trash " aria-hidden="true"></i></button>
                    <div className="clearfix text-right mb-2">
                        <Link to="/scale-set/add" className="btn btn-primary btn-lg mb-3"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                </div>
                <table className="table table-striped table-bordered table-hover"
                    id="tblscaleset"
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
                            <th width="50">Serial No</th>
                            <th>Scaleset Name</th>
                            <th>Description</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                    <ToastContainer />
                    <tbody></tbody>
                </table>
            </div>
        )
    }
}

export default Scalesetlist;


