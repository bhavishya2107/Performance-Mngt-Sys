import React, { Component } from 'react';
import { Link } from 'react-router-dom';

const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class Jobtitlelist extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/jobtitle_master/?_size=1000",
                type: "GET",
                dataSrc: "",
                error: function (xhr, status, error) {
                },
            },
            columns: [
                {
                    data: "jobtitleName",
                    targets: 0
                },
                {
                    data: "description",
                    targets: 1

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
                            '<a href="/' + row.scaleSetId + '"+ >' +
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

                {
                    this.props.location.state === "2222" &&
                    <div className="alert alert-success" role="alert">
                        <strong>Well done!</strong> You added successfully .
</div>
                }
                <Link to="/jobtitle" className="btn btn-success ">Add</Link>


                <table className="table table-striped table-bordered table-hover"

                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>Job Title</th>
                            <th>Description</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
            </div>
        )
    }
}
export default Jobtitlelist;