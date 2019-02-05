import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Scalesetlist extends Component {
    constructor(props) {
        super(props); debugger;
        this.state = {
            savescaleset: "",
            selectedIds:[]
        }
    }
    savesacleset() {
        alert("hi")
    }
    SingleDelete(scaleSetId) {
        var res = this.DeletescalesetApi(scaleSetId);
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
      DeletescalesetApi(scaleSetId) {
        const endpoint = `http://192.168.10.109:3000/api/scale_set_master/${scaleSetId}`; 
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
                url: "http://192.168.10.109:3000/api/scale_set_master/?_size=1000",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {

                },
                // beforeSend: function(request, urlPath) {
                //   request.setRequestHeader("Authorization", token);
                // }
            },
            columns: [
                //   {
                //       data:"scaleSetId",
                //       targets:0
                //   },
                {
                    data: "scaleSetName",
                    targets: 1
                },
                {
                    data: "description",
                    targets: 2

                },

                {
                    data: "scaleSetId",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/Edit/id=' + row.scaleSetId + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +                           
                            '<a href="#" id="' + row.scaleSetId +'"class="btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                          "</a>"                           
                        )
                    }
                },
            ],
            initComplete: (settings, json) => {
               // alert("DataTables has finished its initialisation.");
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
                {/* <h1>{this.props.location.state}</h1> */}
                {/* {
                this.props.location.state=="2222" ? 
           ( <div className="alert alert-success" role="alert">
                <strong>Well done!</strong> You successfully read this important alert message.
      </div>) : <div></div>
    } */}
                {
                    this.props.location.state === "2222"
                    //                  &&
                    //                 <div className="alert alert-success" role="alert">
                    //                     <strong>Well done!</strong> You added successfully .
                    //   </div>
                }

                <div className="clearfix text-right mb-2">
                    <Link to="/addscaleset" className="btn btn-primary mr-5 "><i className="fa fa-plus"></i> Add</Link>
                </div>

                <table className="table table-striped table-bordered table-hover"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Scaleset Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <ToastContainer />
                </table>
            </div>
        )
    }
}

export default Scalesetlist;


