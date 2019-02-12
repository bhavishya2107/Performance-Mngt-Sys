import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification,ModuleNames} from '../Environment';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class UserRolePMS extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            submitEntryFromRole: "",
            selectedIds: [],
        };
    }
    SingleRoleDelete(roleId) {
        var res = this.DeleteRoleApi(roleId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Role "+Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.$el.DataTable().ajax.reload();
            }
        });
        res.fail(error => {
            toast.error("Role "+ Notification.notdeleted, {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }
    DeleteRoleApi(roleId) {
        const endpoint = environment.apiUrl + moduleUrls.Role + '/' + `${roleId}`
        // const endpoint = `http://180.211.103.189:3000/api/role_master/${roleId}`;

        return $.ajax({
            url: endpoint,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    multiDeleteRoleApi(roleId){
        ;
         const endpoint = environment.apiUrl + moduleUrls.Role + '/bulk?_ids=' + `${roleId}`;
         return $.ajax({
             url: endpoint,
             type: Type.deletetype,
             headers: {
                 "content-type": "application/json",
                 "x-requested-with": "XMLHttpRequest",
             }
         });
     }

    checkallrole(e) {
        $("#roleDataList input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    DeleteAllRole(roleId) {

        var  item  = roleId.join(",")

        ;
          var res = this.multiDeleteRoleApi(item);
          res.done((response) => {
      
      toast.success("Role "+ Notification.deleted, {
          position: toast.POSITION.TOP_RIGHT
      });
      this.$el.DataTable().ajax.reload();
      });
      res.fail(error => {
      });    
    }


    SingleRoleDeleteConfirm(id) {
        if (id !== undefined) {
            bootbox.confirm({
                message: Notification.deleteConfirm,
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
                        this.SingleRoleDelete(id);
                    }
                    else {

                    }
                }
            });
        }
    }

    multiRoleDeleteConfirm() {
        var roleId=[]
        $("#roleDataList input:checkbox:checked").each((e, item) => {
            roleId.push(item.value);
        });
        if (roleId.length > 0) {
            
            bootbox.confirm({
                message: Notification.deleteConfirm,
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
                            this.DeleteAllRole(roleId);
                    }
                    else {
    
                    }
                }
            });
        }
        else {
            toast.info(Notification.selectOneRecord);
        }

  

    }

    componentDidMount() {
        this.$el = $(this.el);
        const endpointGET = environment.apiUrl + moduleUrls.Role + '/?_size=1000'
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
      
            ajax: {
                // url: "http://180.211.103.189:3000/api/role_master/?_size=1000",
                url: endpointGET,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {

                    data: "roleId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="roleId" value=' + row.roleId + ">"
                        );
                    },

                },
                {
                    data: null,
                    targets: 1,
                    "orderable": false,

                },
                {
                    data: "roleName",
                    targets: 2
                },

                {
                    data: "action",
                    targets: 3,
                    className: "text-right",
                    render: function (data, type, row) {
                        return (
                            '<a href="/EditRoleForm/id=' + row.roleId + '"class="btn mr-2 btn-edit btn-info btn-sm">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="#" id="' + row.roleId + '"class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
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
                // $(".btnDelete").on("click", e => {
                //     this.SingleDelete(e.currentTarget.id);
                // });
            },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.SingleRoleDeleteConfirm(e.currentTarget.id);
                });
            }

        });
    }

    render() {
        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">{ModuleNames.Role}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/addRole', state: {} }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button type="button"
                        className="btn btn-danger btn-multi-delete"
                        onClick={() => {
                            this.multiRoleDeleteConfirm();
                        }}><i className="fa fa-trash" aria-hidden="true"></i></button>

                </div>


                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="roleDataList"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            <th width="20">
                                <input
                                    type="checkbox" name="checkAll"
                                    onClick={e => { this.checkallrole(e); }}
                                />
                            </th>
                            <th width="50">Sr.No</th>
                            <th>Name</th>
                            <th width="90">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div>
        )
    }


}
export default UserRolePMS;