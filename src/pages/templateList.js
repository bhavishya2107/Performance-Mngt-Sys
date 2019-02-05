import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');





class kraListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitDataFromKra: "",

        };


    }


    componentDidMount() {
        debugger;
        this.$el = $(this.el);

        this.$el.DataTable({
            ajax: {
                url: "192.168.10.109:3000/dynamic",
                type: "POST",
                dataSrc:  {
                    "query": "SELECT TM.templateName,KM.KRAname FROM template_kra_kpi_assignment as TKKA JOIN template_master as TM   ON TKKA.templateId= TM.templateId JOIN kra_master as KM ON  TKKA.kraid = KM.kraid ",
            
             },

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
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/edit/' + row.kraId + '"class="mr-3">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="/edit/' + row.firstname + '">' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +

                            "</a>"
                        )
                    },

                },
            ]
        });
    }
    render() {
        return (<div>
            <h1>KRA</h1>
              
     
               {/* {
                    this.props.location.state === "2222"
                  
    //                 <div className="alert alert-success" role="alert">
    //                     <strong>Well done!</strong> You added successfully .
    //   </div>
                } */}
            <div className="clearfix text-right mb-2">
                <Link to={{ pathname: '/kraHome', state: {} }} className="btn btn-primary"><i className="fa fa-plus"></i> Add</Link>
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
                <tbody></tbody>
      
            </table>
        </div>);
    }
}

export default kraListPage;

