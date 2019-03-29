import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
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

    //single role delete on selecting single checkbox
    SingleRoleDelete(roleId) {
        if (roleId != 134) {
            var res = this.DeleteRoleApi(roleId);

            res.done(response => {
                if (response.affectedRows > 0) {
                    toast.success("Role " + Notification.deleted, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.$el.DataTable().ajax.reload();
                }
            });
            res.fail(error => {
                toast.error("Role " + Notification.notdeleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
        } else {
            alert('system role cannot be deleted !')
        }
    }

    //API to be called during delete role
    DeleteRoleApi(roleId) {

        const delRole = environment.apiUrl + moduleUrls.Role + '/' + `${roleId}`

        return $.ajax({
            url: delRole,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }

    //multiRole delete api
    multiDeleteRoleApi(roleId) {

        const multiDelRole = environment.apiUrl + moduleUrls.Role + '/bulk?_ids=' + `${roleId}`;
        return $.ajax({
            url: multiDelRole,
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

        var item = roleId.join(",");
        var res = this.multiDeleteRoleApi(item);
        res.done((response) => {

            toast.success("Role " + Notification.deleted, {
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
                        label: 'Ok',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
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
        var roleId = []
        $("#roleDataList input:checkbox:checked").each((e, item) => {
            if (item.name != "checkAll" && item.name != 134) {
                roleId.push(item.value);
            }

        });
        if (roleId.length > 0) {

            bootbox.confirm({
                message: Notification.deleteConfirm,
                buttons: {
                    confirm: {
                        label: 'Ok',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'Cancel',
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
        const getRoleList = environment.apiUrl + moduleUrls.Role + '/?_size=1000' + '&_sort=-roleId'
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[0, 'asc']],
            // aaSorting: [[2, 'asc']],
            ajax: {
                url: getRoleList,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },

            columnDefs: [
                { width: '1%', targets: 0 },
                { width: '20%', targets: 1 },
                { width: '65%', targets: 2 },
                { width: '10%', targets: 3 },

            ],

            columns: [
                {

                    data: "roleId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="roleId" value=' + row.roleId + ">" +
                            '<i></i> ' +
                            '</label>'
                        );
                    },

                },
            
                {
                    data: "roleName",
                    targets: 1
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 2
                },

                {
                    data: "action",
                    targets: 3,
                    className: "text-center",
                    render: function (data, type, row) {
                        return (
                            '<a href="/role/edit/id=' + row.roleId + '"class="btn mr-2 btn-edit btn-info btn-sm">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +

                            '<a href="#" id="' + row.roleId + '"class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    },
                    "orderable": false

                }
            ],
            initComplete: (settings, json) => {
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
                        <Link to={{ pathname: '/role/add', state: {} }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
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
                            <label className="checkbox">
                                <input
                                    type="checkbox" name="checkAll"
                                    onClick={e => { this.checkallrole(e); }}
                                />
                                 <i></i>
                                </label>
                            </th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Action</th>
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