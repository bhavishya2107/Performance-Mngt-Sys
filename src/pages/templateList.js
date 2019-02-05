import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from './Environment';
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
        var apiUrl = environment.dynamicUrl + 'dynamic';
        var querystr = {
            "query": "SELECT TM.templateId,TM.templateName,KM.KRAname FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId JOIN kra_master as KM ON  TKKA.kraid = KM.kraid" 
        }
         

// var json = JSON.stringify(query ); 
        // $.ajax({
        //     type: 'POST',
        //     url: apiUrl,
        //     data: query,
        //     complete: function (resultData) {
        //         debugger;
        //         // alert("Save Complete");
        //     }
        // });
        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/dynamic",
                type: "POST",
                // data:[],
                /*data:  {
                    'query': 'SELECT TM.templateId,TM.templateName,KM.KRAname FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId JOIN kra_master as KM ON  TKKA.kraid = KM.kraid'
                },*/
                
                dataType: 'json',
                data:  querystr,
                contentType: "application/json; charset=utf-8",
                
                dataSrc: "",
                error: function (xhr, status, error) {
// debugger
                },
                complete: function (resultData) {
                    
                    // alert("Save Complete");
                }

            },
            columns: [
                {
                    data: "templateName",
                    targets: 0
                },
                {
                    data: "KRAname",
                    targets: 1
                },
                {
                    data: "",
                    targets: 2,
                    render: function (data, type, row) {
                        return (
                            // '<a href="/edit/' + row.templateId + '" class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i></a>' +
                            // '&nbsp' +
                            // '<a href="/edit/' + row.templateId + '">' +
                            // '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            // '</a>'
                            ''

                        )
                    }

                }
            ]
        });


    }



    //     var apiUrl = environment.dynamicUrl + 'dynamic';
    //     debugger;
    //     this.$el = $(this.el);       
    //     var query =  {
    //         "query": "SELECT TM.templateId,TM.templateName,KM.KRAname FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId JOIN kra_master as KM ON  TKKA.kraid = KM.kraid"
    //     }
    //     this.$el.DataTable({
    //         ajax: {
    //             url: apiUrl,
    //             type: "POST",
    //             dataSrc:{
    //                 "query": "SELECT TM.templateName,KM.KRAname FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId    JOIN kra_master as KM ON  TKKA.kraid = KM.kraid"
    //             },
    //             headers:{
    //                 "Content-Type":"application/json"
    //             }              
    //         },
    //         columns: [
    //             {
    //                 data: "templateName",
    //                 targets: 0
    //             },
    //             {
    //                 data: "KRAname",
    //                 targets: 1
    //             },
    //             {
    //                 data: "",
    //                 targets: 2,
    //                 render: function (data, type, row) {
    //                     return (
    //                         '<a href="/edit/' + row.templateId + '" class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i></a>' +
    //                         '&nbsp' +
    //                         '<a href="/edit/' + row.templateId + '">' +
    //                         '<i class="fa fa-trash" aria-hidden="true"></i>' +
    //                         '</a>'

    //                     )
    //                 }

    //             }
    //         ]
    //     });

    render() {
        return (<div>

            {/* {
                    this.props.location.state === "2222"
                  
    //                 <div className="alert alert-success" role="alert">
    //                     <strong>Well done!</strong> You added successfully .
    //   </div>
                } */}
            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/addtemplate' }} className="btn btn-primary"><i className="fa fa-plus"></i> Add</Link>
            </div>
            <div className="clearfix text-right mb-2">
                <a href='/Edittemplate/id=1'>edit</a>
            </div>
            <table className="table table-striped table-bordered table-hover"
                ref={el => (this.el = el)}>
                <thead>
                    <tr>
                        <th>Template Name</th>
                        <th>KRA name</th>
                        <th>Action</th>
                    </tr>
                </thead>

            </table>
        </div>
        );
    }
}

export default Templatelist;

