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
    componentDidMount() {
        // debugger;
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/dynamic",
                type: "POST",
                dataSrc: "",
                data: {
                    "query": "SELECT TM.templateId,TM.templateName,KM.KRAname  FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId    JOIN kra_master as KM ON  TKKA.kraid = KM.kraid "

                },
            },
            columns: [
                {
                    data: "KRAname",
                    targets: 0
                },
                {
                    data: "templateName",
                    targets: 1
                },
                {
                    data: "templateId",
                    targets: 2,
                    render: function (data, type, row) {
                        debugger;
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
            initComplete: (settings, json) => {

            },
            drawCallback: (settings) => {

            }
        });
    }

    render() {
        return (<div>

            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/addtemplate' }} className="btn btn-primary"><i className="fa fa-plus"></i> Add</Link>
            </div>

            <table className="table table-striped table-bordered table-hover"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>KRA NAME</th>
                        <th>TEMPLATE NAME</th>
                        <th>Action</th>
                    </tr>
                </thead>
            </table>
        </div>
        );
    }
}

export default Templatelist;

