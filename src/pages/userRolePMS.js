import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class UserRolePMS extends Component{
    constructor(props){
        super(props);
        this.state = {
            
           submitEntryFromRole:"",

        };
    }
    SingleDelete(roleId) {
        var res = this.DeletescalesetApi(roleId);
        res.done(response => {
          if (response === 200) {
        
            window.location.reload("")
          }this.$el.DataTable().ajax.reload();
        });
        toast.error("Record Deleted", {
            position: toast.POSITION.TOP_RIGHT
        });
        res.fail(error => {
          alert("error");
        });
      }
      DeletescalesetApi(roleId) {
        const endpoint = `http://192.168.10.109:3000/api/role_master/${roleId}`;
    
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
                // url: "http://192.168.10.109:3000/api/role_master/?_size=1000",
                url: "http://180.211.103.189:3000/api/role_master/",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [
                {
                    data: "roleId",
                    targets: 0

                },
                {
                    data: "roleName",
                    targets: 1
                },

                {
                    data: "action",
                    targets: 3,
                    className:"text-right",
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditForm/id=' + row.roleId + '"class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="#" id="' + row.roleId +'"class="btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                          "</a>"
                        )
                    },

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

    render(){
        return(
            <div>
                <h1>ROLE</h1>
                {
                    this.props.location.state === "2222"
    //                 <div className="alert alert-success" role="alert">
    //                     <strong>Well done!</strong> You added successfully .
    //   </div>
                }
            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/userRoleForm', state: {} }} className="btn btn-primary"><i className="fa fa-plus"></i> Add</Link>
            </div>
         
     


            <table className="table table-striped table-bordered table-hover"
                id="apiDataList"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>


                    </tr>
                </thead>
                <ToastContainer />
            </table>
            </div>
        )
    }


}
export default UserRolePMS;