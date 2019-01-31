import React, { Component } from 'react';
import { Link } from 'react-router-dom';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Scalesetlist extends Component {
    constructor(props) {
        super(props); debugger;
        this.state = {
            savescaleset: ""
        }
    }
    savesacleset() {
        alert("hi")
    }
    // delete() {
    //     return `<a onClick="this.savesacleset" >Well done!</a>`
    // }
    componentDidMount() {
        function aa() {
            alert("hi");
        }
        this.$el = $(this.el);
        //var token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJuYXlhbkBwcmFrYXNoaW5mb3RlY2guY29tIiwianRpIjoiZTE2MWZlNzEtMDk1Ny00ZmJkLTk3NTYtYTdiZTVkYTgyOTc0IiwiVXNlcklkIjoiNTYiLCJSb2xlIjoiQWRtaW4iLCJHaXZlbk5hbWUiOiJOeW4gUGFybWFyIiwiZXhwIjoxNTQ4NDIxNDI0LCJpc3MiOiJodHRwczovL2NhY2xpYnJhcnkuYXp1cmUtYXBpLm5ldC92MS9hdXRoYW50aWNhdGlvbi9jb21tb24iLCJhdWQiOiJodHRwczovL2NhY2xpYnJhcnkuYXp1cmUtYXBpLm5ldC92MS9hdXRob3JpemF0aW9uL2NvbW1vbiJ9.X6loziOfFKJT9VFWB9F0OWcTHmyqmUH75a2YySksx40";
        this.$el.DataTable({
            ajax: {

                //url: "https://caclibrary.azure-api.net/v1/Album",
                url: "http://192.168.10.109:3000/api/scale_set_master/?_size=1000",

                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {

                },
                // beforeSend: function(request, urlPath) {
                //   request.setRequestHeader("Authorization", token);
                // }
            },
            columns: [
                //   {
                //       data:"scaleSetId",
                //       targets:0
                //   },
                {
                    data: "scaleSetName",
                    targets: 1
                },
                {
                    data: "description",
                    targets: 2

                },

                {
                    data: "scaleSetId",
                    className: "text-right",
                    targets: 3,
                    render: function (data, type, row) {
                        return (
                            '<a href="/' + row.id + '"class="mr-3">' +
                            '<i class="fa fa-pencil" aria-hidden="true"></i>' +
                            '&nbsp' +
                            '<a href="/' + row.scaleSetId+'"+ >' +
                            '<i class="fa fa-trash" aria-hidden="true"></i>' +
                            "</a>"
                        )
                    }


                },



            ]
        });
    }
    render() {
        return (
            <div>
                {/* <h1>{this.props.location.state}</h1> */}
                {/* {
                this.props.location.state=="2222" ? 
           ( <div className="alert alert-success" role="alert">
                <strong>Well done!</strong> You successfully read this important alert message.
      </div>) : <div></div>
    } */}
                {
                    this.props.location.state === "2222" &&
                    <div className="alert alert-success" role="alert">
                        <strong>Well done!</strong> You added successfully .
      </div>
                }

                <Link to="/scaleset" className="btn btn-success mr-5">Add</Link>

                <table className="table table-striped table-bordered table-hover"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>
                            {/* <th>ID</th> */}
                            <th>Scaleset Name</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}

export default Scalesetlist;