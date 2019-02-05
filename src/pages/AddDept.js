import React, { Component } from 'react';
import { Form, Label, FormGroup, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { Redirect } from 'react-router-dom'

class AddDept extends Component {
    constructor(props) {
        super(props);
        this.state = {
            RedirectToDept: false,
            depId: 1,
            depName: "",
            description: "",
            // createdBy: 2,
            // createdOn: "null",
            // modifiedBy: 2,
            // modifiedOn: "null"
        }
    }
    // clear(){
    //     this.setState={
    //         depName: "",
    //         description: ""
    //     }
    // }


    save() {

        var _this = this
        var deptList =
        {

            "depName": this.state.depName,
            "description": this.state.description,
            // "createdBy": 2,
            // "createdOn": 1,
            // "modifiedBy": 2,
            // "modifiedOn": 1
        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/department_master",
            type: "POST",
            data: deptList,
            success: function (result) {

                _this.setState({ RedirectToDept: true });
                toast.success("Success  Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });


            }

        });


    }

    render() {
        if (this.state.RedirectToDept) {

            return <Redirect to={{ pathname: "/Department", state: "2" }} />
        }

        return (
            <div>
                <Form>
                    <div>

                        <FormGroup >
                            <Label for="depName" sm={2}>Name</Label>
                            <Input type="text" name="depName" id="depName" placeholder="Enter the Name" value={this.state.depName}
                                onChange={(event) => {
                                    this.setState({
                                        depName: event.target.value
                                    })
                                }} />
                        </FormGroup>

                        <FormGroup >
                            <Label for="description" sm={2}>description</Label>
                            <Input type="text" name="description" id="description" value={this.state.description}
                                onChange={(event) => {
                                    this.setState({
                                        description: event.target.value
                                    })
                                }} />
                        </FormGroup>
                    </div>


                    <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => { this.save(); }}>Save</button>
                    <button className="btn btn-sm btn-success mr-2">Clear</button>
                </Form>

            </div >
        )

    }
}
export default AddDept;