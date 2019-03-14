import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
import bootbox from 'bootbox';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Templatelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    //#region  singleDelete
    singleDeleteTemplateMasterApi(templateId) {

        const singleDeleteAPIUrl = environment.apiUrl + moduleUrls.Template + '/' + `${templateId}`;
        return $.ajax({
            url: singleDeleteAPIUrl,
            type: Type.deletetype,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    SingleDelete(templateId) {
        var res = this.singleDeleteTemplateMasterApi(templateId);
        res.done(response => {
            if (response.affectedRows > 0) {
                toast.success("Template " + Notification.deleted, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            this.$el.DataTable().ajax.reload();
        });

        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Template were not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Template" + Notification.notdeleted)
            }
        });
    }
    SingleDeleteConfirm(id) {
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
    }
    //#endregion
    //#region MultiDelete
    multiDeleteTemplateApi(templateId) {

        const multiDeleteAPIUrl = environment.apiUrl + moduleUrls.Template + '/bulk?_ids=' + `${templateId}`;
        return $.ajax({
            url: multiDeleteAPIUrl,
            type: "DELETE",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",
            }
        });
    }
    multiDeleteTemplate(templateId) {
        var item = templateId.join(",")
        var res = this.multiDeleteTemplateApi(item);
        res.done((response) => {

            toast.success("Template " + Notification.deleted, {
                position: toast.POSITION.TOP_RIGHT
            });
            this.$el.DataTable().ajax.reload();
        });
        res.fail(error => {
            if (error.status === 400) {
                toast.error("Some of Template were not deleted as they are being used", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
            else {
                toast.error("Template" + Notification.notdeleted)
            }
        });
    }
    multipleDeleteTemplateconfirm() {
        var templateId = []
        $("#tblTemplate  input:checkbox:checked ").each((e, item) => {
            if (item.name != 'checkAll') {

                templateId.push(item.value);
            }
        });
        if (templateId.length > 0) {

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
                        this.multiDeleteTemplate(templateId);
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
    checkall(e) {
        $("#tblTemplate  input:checkbox").each((index, item) => {
            if ($(e.currentTarget).is(":checked") === true) {
                $(item).prop("checked", true);
            } else {
                $(item).prop("checked", false);
            }
        });
    }
    //#endregion
    componentDidMount() {
        const templateListUrl = environment.dynamicUrl + 'dynamic' + '/?_size=1000' + '&_sort=-templateId'
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            ajax: {
                url: templateListUrl,
                type: Type.post,
                dataSrc: "",
                data: {
                    "query": "SELECT TM.templateId,TM.templateName, GROUP_CONCAT( KM.kraName SEPARATOR ',') as kraName FROM template_master as TM LEFT JOIN template_detail as TKKA ON TKKA.templateId = TM.templateId LEFT JOIN kra_master as KM ON TKKA.kraid = KM.kraid group by TM.templateId ORDER BY TM.templateId desc"
                },
            },
            columns: [
                {
                    data: "templateId",
                    "orderable": false,
                    targets: 0,
                    render: function (data, type, row) {
                        return (
                            '<input type="checkbox" name="templateId" value=' + row.templateId + ">"
                        );
                    }
                },

                {
                    data: "templateName",
                    targets: 1
                },
                {
                    data: "kraName",
                    targets: 2
                },

                {
                    data: "templateId",
                    targets: 3,
                    "orderable": false,
                    render: function (data, type, row) {
                        ;
                        return (
                            '<a href="/template/edit/id=' + row.templateId + '"class="btn  btn-edit btn-info btn-sm mr-2">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.templateId + '"class="btnDelete btn btn-danger btnDelete btn-sm">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                }
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

    /*Reset Form*/

    resetform() {
        this.$el
            .DataTable()
            .clear()
            .draw();
    }

    render() {
        return (<div>
            <div className="clearfix d-flex align-items-center row page-title">
                <h2 className="col">Template</h2>
                <div className="col text-right">
                    <Link to="/template/add" className="btn btn-primary" onClick={() => { this.resetform() }} ><i className="fa fa-plus" aria-hidden="true"></i></Link>
                </div>
                <button className="btn btn-danger btn-multi-delete" onClick={() => {
                    this.multipleDeleteTemplateconfirm()
                }}><i className="fa fa-trash " aria-hidden="true"></i></button>
            </div>
            <table className="table table-striped table-bordered table-hover customDataTable"
                id="tblTemplate"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th width="20">
                            <input
                                type="checkbox"
                                name="checkAll"
                                onClick={e => {
                                    this.checkall(e);
                                }}
                            />
                        </th>
                        <th width="150">Template Name</th>
                        <th>KRAs</th>
                        <th width="100">Action</th>
                    </tr>
                </thead>
            </table>
            <ToastContainer />
        </div>
        );
    }
}

export default Templatelist;

