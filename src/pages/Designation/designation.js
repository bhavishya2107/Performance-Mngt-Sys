import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');
class Designationlist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIds: [],
            title: ""
        }
    }
    SingleDeleteConfirm(id) {
        if (id != 105) {
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
                        this.SingleDelete(id);
                    }
                    else {

                    }
                }
            });
        } else (
            alert("you cannot delete system generated jobtitle")
        )
    }
    //#region delete details
    SingleDelete(designationId) {
        var res = this.DeletedesignationApi(designationId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Designation " + Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            toast.error(Notification.notdeleted, {
                position: toast.POSITION.TOP_RIGHT
            });
        });
    }
    DeletedesignationApi(designationId) {
        const deleteDesignationApiUrl = environment.apiUrl + moduleUrls.Designation + '/' + `${designationId}`
        return $.ajax({
            url: deleteDesignationApiUrl,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    multiDeletedesignationApi(designationId) {

        const deleteJobTitleApiUrl = environment.apiUrl + moduleUrls.Designation + '/bulk?_ids=' + `${designationId}`

        return $.ajax({
            url: deleteJobTitleApiUrl,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    //#endregion
    Deletedesignationconfirm() {
        var designationId = []
        $("#tbldesignation input:checkbox:checked").each((e, item) => {
            if (item.name != 'checkAll' && item.value != 105) {

                designationId.push(item.value);
            }

        });
        if (designationId.length > 0) {
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
                        this.Deletedesignation(designationId);
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
    Deletedesignation(designationId) {
        var item = designationId.join(",")
        var res = this.multiDeletedesignationApi(item);
        res.done((response) => {

            toast.success("Designation " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
        });


    }
    checkall(e) {
        $("#tbldesignation input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    componentDidMount() {
        this.setState({
            title: ModuleNames.Jobtitle
        })
        const jobtitleGET = environment.apiUrl + moduleUrls.Designation + '/?' + '&_sort=-designationId'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: jobtitleGET,
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [

                {
                    data: "designationId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<label class="checkbox">' +
                            '<input type="checkbox" name="designationId" value=' + row.designationId + ">" +
                            '<i></i> ' +
                            '</label>'
                        );
                    }
                },
                {
                    data: "designationName",
                    targets: 1,
                },
                {
                    data: "description",
                    "orderable": false,
                    targets: 2
                },
                {
                    data: "designationId",
                    "orderable": false,
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/designation/edit/id=' + row.designationId + '"class="btn mr-2 btn-edit btn-info btn-sm">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>"
                            +
                            '<a href="#" id="' + row.designationId + '"class="btn btn-danger btnDelete btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                },
            ],

            initComplete: (settings, json) => {

            },
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {

                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }

        });
    }
    render() {

        return (
            <div>
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">Designation</h2>
                    <div className="col text-right">
                        <Link to="/designation/add" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                    </div>
                    <button className="btn btn-danger btn-multi-delete" onClick={() => {
                        this.Deletedesignationconfirm()
                    }}><i className="fa fa-trash " aria-hidden="true"></i></button>
                </div>
                <table className="table table-striped table-bordered table-hover customDataTable"
                    id="tbldesignation"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr><th width="20">
                            <label className="checkbox">
                                <input type="checkbox" name="checkAll" onClick={e => { this.checkall(e); }} />
                                <i></i>
                            </label>
                        </th>
                            <th width="100">Name</th>
                            <th>Description</th>
                            <th width="100">Action</th>
                        </tr>
                    </thead>

                </table>
                <ToastContainer />
            </div>
        )
    }
}
export default Designationlist;