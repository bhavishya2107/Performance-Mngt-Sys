import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { environment } from './Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Scalesetlist extends Component {
    constructor(props) {
        super(props); debugger;
        this.state = {
         
        }
    }
    
    //#region Delete Scale set functions
    SingleDelete(scaleSetId) {
        var res = this.DeletescalesetApi(scaleSetId);
        res.done(response => {
          if (response.affectedRows>0) {
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



    componentDidMount() {
        //#region Data table realted Block
        const endpointGET = environment.apiUrl + 'scale_set_master/'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            
            ajax: {
                url: endpointGET,
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },

            },
            columns: [

                {
                    data: "scaleSetName",
                    targets: 0
                },
                {
                    data: "description",
                    targets: 1

                },

                {
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 2,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Editscaleset/id=' + row.scaleSetId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.scaleSetId + '"class="btn mr-2 delete btn-danger btn-sm btnDeletescaleset">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],
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
            <div>
            <div className="clearfix text-right mb-2">
                    <Link to="/addscaleset" className="btn btn-primary btn-sm">Add</Link>
                </div>

                <table className="table table-striped table-bordered table-hover"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
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


