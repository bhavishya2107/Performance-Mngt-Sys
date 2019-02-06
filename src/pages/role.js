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
          if (response.affectedRows>0) {
            toast.success("Role Deleted Successfully", {
                position: toast.POSITION.TOP_RIGHT
            });
          }
          this.$el.DataTable().ajax.reload();
        });
      
        res.fail(error => {
          toast.error("Role Not Deleted", {
            position: toast.POSITION.TOP_RIGHT
        });
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
            "autoWidth": false,
            ajax: {
                url: "http://192.168.10.109:3000/api/role_master/?_size=1000",
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
                            '<a href="/EditRoleForm/id=' + row.roleId + '"class="btn mr-2 btn-edit btn-info btn-sm">'  + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="#" id="' + row.roleId +'"class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                          "</a>"
                        )
                    },
                    "orderable": false

                }
            ],
            
            initComplete: (settings, json) => {
                 $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                 });
               },
               drawCallback: ( settings ) =>{
                 $(".btnDelete").on("click", e => {
                    this.SingleDelete(e.currentTarget.id);
                   });
             }

        });
    }

    render(){
        return(
            <div>
           
                {
                    this.props.location.state === "2222"
                }
            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/addRole', state: {} }} className="btn btn-primary">Add</Link>
            </div>
         
     


            <table className="table table-striped table-bordered table-hover"
                id="apiDataList"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th width="90">Action</th>


                    </tr>
                </thead>
                <ToastContainer />
            </table>
            </div>
        )
    }


}
export default UserRolePMS;