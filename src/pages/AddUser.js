import React, { Component } from 'react';
import {  Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';




class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {

            RedirecttouserManagement: false,
            jobtitleId: null,
            depId: null,
            roleId: 1,
            userName: "Nikki",
            password: "12345",
            firstName: "",
            lastName: "",
            emailAddress: "nikita@gmail.com",
            // mobileNo: null,
            // profileImage: null,
            // teamId: null,
            // createdBy: null,
            // createdOn: null,
            // modifiedBy: null,
            // modifiedOn: null

        }


    }

    save() {
        var _this = this;
        var DataList = {
            // "jobtitleId": this.state.jobtitleId,
            // "depId": this.state.depId,
            // "roleId": this.state.roleId,
            "jobtitleId": 1,
            "depId": 1,
            "roleId": 1,
            "userName": this.state.userName,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailAddress": this.state.emailAddress,
            "mobileNo": 1,
            "profileImage": 1,
            "teamId": 1,
            "createdBy": 1,
            //"createdOn": Date.now,
            "modifiedBy": 1,
            //  "modifiedOn":  Date.now

        }

        $.ajax({
            url: "http://192.168.10.109:3000/api/user_master",
            type: "POST",
            data: DataList,
            success: function (resultData) {
                alert("Save successfully");
                _this.setState({ RedirecttouserManagement: true });
                
            }
        });
    }

        render() {
            if (this.state.RedirecttouserManagement) {

                return <Redirect to={{ pathname: "/UserManagement", state: "2" }} />
            }

        return (
            <div>
                <Form>
                    <FormGroup >
                        <Label for="firstName" sm={2}>FirstName</Label>
                        <Input type="text" name="firstName" id="firstName" placeholder="Enter the Name" value={this.state.firstName}
                            onChange={(event) => {
                                this.setState({
                                    firstName: event.target.value
                                })
                            }} />
                    </FormGroup>


                    <FormGroup >
                        <Label for="lastName" sm={2}>LastName</Label>
                        <Input type="text" name="lastName" id="lastName" placeholder="Enter the Name" value={this.state.lastName}
                            onChange={(event) => {
                                this.setState({
                                    lastName: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <FormGroup >
                        <Label for="UserName" sm={2}>userName</Label>
                        <Input type="text" name="UserName" id="UserName" value={this.state.UserName}
                            onChange={(event) => {
                                this.setState({
                                    UserName: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <FormGroup >
                        <Label for="EmailID" sm={2}>EmailID</Label>
                        <Input type="text" name="EmailID" id="EmailID" value={this.state.EmailID}
                            onChange={(event) => {
                                this.setState({
                                    EmailID: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <FormGroup >
                        <Label for="Address" sm={2}>AddresslID</Label>
                        <Input type="textarea" name="Address" id="Address" value={this.state.Address}
                            onChange={(event) => {
                                this.setState({
                                    Address: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <FormGroup >
                        <Label for="Image" sm={2}>Image</Label>
                        <Input type="text" name="Image" id="Image" value={this.state.Image}
                            onChange={(event) => {
                                this.setState({
                                    Image: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <FormGroup >
                        <Label for="MobileNo" sm={2}>MobileNo</Label>
                        <Input type="number" name="MobileNo" id="MobileNo" value={this.state.MobileNo}
                            onChange={(event) => {
                                this.setState({
                                    MobileNo: event.target.value
                                })
                            }} />
                    </FormGroup>

                    <button type="button" onClick={() => { this.save(); }}>Save</button>

                  

                </Form>
            </div>


        )
    }
}
export default AddUser;
