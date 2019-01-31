import { Link } from 'react-router-dom'
import React, { Component } from 'react';
import $ from 'jquery';
$.DataTable = require('datatables.net-bs4');


class UserManagement extends Component {
    constructor(props) {
        super(props);

        this.setState = {
            firstName: "",
            lastName: "",
            emailAddress: ""
        }
    }
    // remove() {
    //     console.log("remove")
    //     this.setState({
    //         Data: this.state.Data.slice(0, -1)
    //         // console.log(this.state.selected)

    //         // this.setState({
    //         //     Data: this.state.Data.filter((i) => i.Name !== this.state.selectedName)
    //     })
    // }
    componentDidMount() {

        this.$el = $(this.el);
        this.$el.DataTable({
            ajax: {
                url: "http://192.168.10.109:3000/api/user_master/?_size=1000",
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [

                {
                    data: "firstName",
                    target: 1,
                    className: "text-center",
                    // render: function (data, type, row) {
                    //     return (
                    //         '<a href="/edit/' + row.id + '">' + 'Edit' + "</a>"
                    //     )
                    // }
                },
                {
                    data: "lastName",
                    target: 2,
                    className: "text-center"
                },
                {
                    data: "emailAddress",
                    target: 3,
                    className: "text-center"

                },
                // {
                //     data: "id",
                //     target: 4,
                //     render: function (data, type, row) {
                //         return (
                //             '<a href="/edit/' + row.id + '">' + 'Edit' + "</a>" + "/" +
                //             '<a href="/delete/' + row.id + '">' + 'Delete' + "</a>"
                //         )
                //     }
                // }
            ]
        })
    }
    render() {
        return (
            //to add the data to the table 
            <div>
                {
                    this.props.location.state === "2" &&
                    <div className="alert alert-success" role="alert">
                        <strong>Well done!</strong> You added successfully .
          </div>
                }
                <div className="text-right mb-3">
                    <Link to={{ pathname: '/AddUser' }} className="btn btn-sm btn-success mr-2" role="submit">Add User</Link>

                </div>

                <table className="table table-striped table-bordered table-hover"
                    ref={el => (this.el = el)}>
                    <thead>
                        <tr>

                            <th>firstName</th>
                            <th>lastName</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>

            </div>
        )
    }
}
export default UserManagement;