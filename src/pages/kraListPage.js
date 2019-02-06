import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {environment} from './Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class kraListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            kraId:"",

        };
    }
    //delete record on click delete icon
    SingleDelete(kraId) {
        var res = this.DeletescalesetApi(kraId);
        res.done(response => {    
          if (response.affectedRows > 0) {
            toast.success("KRA Deleted Successfully !", {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        }       
        });      
        res.fail(error => {
            toast.error("KRA Not Deleted !", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
      }
      DeletescalesetApi(kraId) {

        const endpoint = `http://192.168.10.109:3000/api/kra_master/${kraId}`;
    
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
        const endpointGET = environment.apiUrl + 'kra_master/'
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: endpointGET,
                // url: "http://180.211.103.189:3000/api/kra_master/",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {

                },
            },
            columns: [
                {
                    data: "kraId",
                    targets: 0

                },
                {
                    data: "kraName",
                    targets: 1
                },
                {
                    data: "description",
                    targets: 2
                },

                {
                    data: "",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Editkra/id=' + row.kraId + '"class="btn mr-2 btn-edit btn-info btn-sm">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="#" id="' + row.kraId + '" class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        );
                    },
                    "orderable": false

                }
            ],
            initComplete: (settings, json) => {
                $(".btnDelete").on("click", e => {
               
                    this.SingleDelete(e.currentTarget.id);
                    
                });
            },
            drawCallback:( settings )=> {
                $(".btnDelete").on("click", e => {
                
                    this.SingleDelete(e.currentTarget.id);
                    
                });
            }
        });
    }
    render() {
        return (<div>


            {
                this.props.location.state === "2222"
            }
            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/addKra', state: {} }} className="btn btn-primary"> Add</Link>
            </div>




            <table className="table table-striped table-bordered table-hover"
                id="apiDataList"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th width="90">Action</th>
                     </tr>
                </thead>
                <ToastContainer />
            </table>
        </div>);
    }
}

export default kraListPage;