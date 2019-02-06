import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {environment} from './Environment'
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Jobtitlelist extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    SingleDelete(jobtitleId) {
        var res = this.DeletejobtitleApi(jobtitleId);
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
componentDidMount() {
    const endpointGET = environment.apiUrl + 'jobtitle_master/'
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
                    data: "jobtitleName",
                    targets: 0
                },
                {
                    data: "description",
                    targets: 1

                },

                {
                    data: "scaleSetId",
                    "orderable": false,
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Editjobtitle/id=' + row.jobtitleId + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>'+
                            "</a>"
                             +
                          '<a href="#" id="' + row.jobtitleId + '"class="btnDelete" >' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],
            initComplete: (settings, json) => {
                
                 $(".btnDelete").on("click", e => {
                   debugger;
                   this.SingleDelete(e.currentTarget.id);
                 });
               },
               drawCallback: ( settings ) =>{
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

                <div className="clearfix text-right mb-2">
                <Link to="/addjobtitle"className="btn btn-primary mr-5 "><i className="fa fa-plus"></i>Add</Link>
                </div>
              <table className="table table-striped table-bordered table-hover"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

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