import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from '../Environment';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Templatelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitDataFromKra: "",
        };
    }
    checkall() { }
    componentDidMount() {
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            aaSorting: [[2, 'asc']],
            ajax: {
                url: "http://192.168.10.110:3000/dynamic",
                type: "POST",
                dataSrc: "",
                data: {
                    "query": "SELECT TM.templateId,TM.templateName, GROUP_CONCAT( KM.kraName SEPARATOR ',') as kraName FROM template_detail as TKKA JOIN template_master as TM ON TKKA.templateId = TM.templateId JOIN kra_master as KM ON TKKA.kraid = KM.kraid group by TM.templateId"
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
                    data: null,
                    targets: 1,
                    "orderable": false,
                },
                {
                    data: "templateName",
                    targets: 2
                },
                {
                    data: "kraName",
                    targets: 3
                },

                {
                    data: "templateId",
                    targets: 4,
                    "orderable": false,
                    render: function (data, type, row) {
                        ;
                        return (
                            '<a href="/Edittemplate/id=' + row.templateId + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            "</a>" +
                            '<a href="#" id="' + row.templateId + '"class="btnDelete">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }
                }
            ],
            "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                $("td:eq(1)", nRow).html(iDisplayIndex + 1);
                return nRow;
            },
            initComplete: (settings, json) => {

            },
            drawCallback: (settings) => {
                window.smallTable();

            }
        });
    }

    render() {
        return (<div>
            <div className="clearfix d-flex align-items-center row page-title">
                <h2 className="col">Template</h2>
                <div className="col text-right">
                    <Link to="/addtemplate" className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
                </div>
                <button className="btn btn-danger btn-multi-delete" onClick={() => {
                    this.multipleDeleteconfirm()
                }}><i className="fa fa-trash " aria-hidden="true"></i></button>
            </div>
            <table className="table table-striped table-bordered table-hover customDataTable"
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
                        <th width="50">Sr.No</th>
                        <th>Template Name</th>
                        <th>Kra Name</th>

                        <th>Action</th>
                    </tr>
                </thead>
            </table>
        </div>
        );
    }
}

export default Templatelist;

