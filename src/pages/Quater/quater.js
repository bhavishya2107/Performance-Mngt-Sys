import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Quater extends Component{
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            selectedIds: [],
        };
    }
    SingleRoleDelete(quaterId) {
    
            var res = this.DeleteRoleApi(quaterId);

            res.done(response => {
                if (response.affectedRows > 0) {
                    toast.success("Quarter " + Notification.deleted, {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.$el.DataTable().ajax.reload();
                }
            });
            res.fail(error => {
                toast.error("Quarter " + Notification.notdeleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
       
    }
    DeleteRoleApi(quaterId) {

        const delQuater = environment.apiUrl + moduleUrls.Quater + '/' + `${quaterId}`

        return $.ajax({
            url: delQuater,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }


    multiDeleteRoleApi(quaterId) {
        
        const multiDelQuater = environment.apiUrl + moduleUrls.Quater + '/bulk?_ids=' + `${quaterId}`;
        return $.ajax({
            url: multiDelQuater,
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
    DeleteAllRole(quaterId) {
        
        var item = quaterId.join(",");
        var res = this.multiDeleteRoleApi(item);
        res.done((response) => {

            toast.success("Quarter " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            toast.error("Quarter " + Notification.notdeleted, {
                position: toast.POSITION.TOP_RIGHT
              });
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
        var quaterId = []
        $("#roleDataList input:checkbox:checked").each((e, item) => {
            if (item.name != "checkAll" && item.name != 134) {
                quaterId.push(item.value);
            }

        });
        if (quaterId.length > 0) {

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
                        this.DeleteAllRole(quaterId);
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
        const endpointGET = environment.apiUrl + moduleUrls.Quater + '/?_size=1000' + '&_sort=-quaterId'
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[0, 'asc']],
            ajax: {
                url: endpointGET,
                type: Type.get,
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },

            columnDefs: [
              
               ],
        
            columns: [
                {
                    data: "quaterId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="quaterId" value=' + row.quaterId + ">" +
                            '<i></i> ' +
                            '</label>'
                        );
                    },

                },
                {
                    data: "quaterName",
                    targets: 1
                },
                {
                    data: "description",
                    targets: 2,
                    "orderable": false,
                },
                {
                    data: "action",
                    targets: 2,
                    className: "text-center",
                    render: function (data, type, row) {
                        return (
                            '<a href="/quarter/edit/id=' + row.quaterId + '"class="btn mr-2 btn-edit btn-info btn-sm">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            
                            '<a href="#" id="' + row.quaterId + '"class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
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
                    <h2 className="col">{ModuleNames.quater}</h2>
                    <div className="col text-right">
                        <Link to={{ pathname: '/quarter/add', state: {} }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
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
                            <th width="120">Name</th>
                            <th>Description</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <ToastContainer />
            </div>
        )
    }


}

export default Quater;