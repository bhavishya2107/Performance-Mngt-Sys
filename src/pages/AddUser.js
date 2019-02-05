import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from './Environment'

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.match.params.userId,
            RedirecttouserManagement: false,
            userName: "Nikki",
            password: "12345",
            firstName: "",
            lastName: "",
            emailAddress: "",
            roleId:6,
            isUpdate: false
        }


    }

    save() {
        var _this = this;
        var DataList =
        {
            "userName":this.state.userName,
            "password":this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailAddress": this.state.emailAddress,
            "roleId":this.state.roleId
        }
        var url = environment.apiUrl + 'user_master';
        $.ajax({
            url: url,
            type: "POST",
            data: DataList,
            success: function (response) {
                _this.setState({ RedirecttouserManagement: true });
                toast.success("Save Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });

            }
        });
    }

    //bind the droplist
    // componentWillMount() {
    //     var self = this
    //     var url = environment.apiUrl + 'user_master';

    //     $.ajax = (
    //         {
    //             url: url,
    //             type: "GET",
    //             data: "DataList",
    //             success: function (response) {
    //                 console.log(response)
    //                 // self.setState({ firstName: response })
    //                 {

    //                 }
    //             }
    //         })
    // }

    // //Edit the user details
    getUserApi() {
        console.log('user', this.state.userId)
        var url = environment.apiUrl + 'user_master/' + `${this.state.userId}`
        return $.ajax({
            url: url,
            type: "GET",

        })
    }
    updateDetailsApi(data) {
        var _this = this;
        var userList =
        {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "emailAddress":data.emailAddress
        }
        var url = environment.apiUrl + 'user_master/' + `${data.userId}`
        return $.ajax({
            url: url,
            type: "PATCH",

            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",

                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(userList),

        });
    }

    UpdateUserDetails(data) {
        console.log(data,'data')
        var res = this.updateDetailsApi(data);
        res.done((response) => {
            console.log('sucesss')
            this.setState({
                isUpdate: true
            })

        });
        res.fail((error) => {

            console.log('error', error);
        })
    }
    componentDidMount() {
        

        if (this.state.userId !== undefined) {
            var res = this.getUserApi();
            res.done((response) => {
                console.log(response, 'res');
                var res = response[0];

                this.setState({
                    firstName: res.firstName,
                    lastName: res.lastName,
                    emailAddress:res.emailAddress
                })
            });
            res.fail((error) => {

            })
        } else {

        }

    }

    render() {
        if (this.state.RedirecttouserManagement) {

            return <Redirect to={{ pathname: "/UserManagement", state: "2" }} />
        }
        if (this.state.isUpdate == true) {
            return <Redirect to={{ pathname: "/UserManagement" }} />
        }
        return (
            <div>
                <div>
                    {this.state.userId !== undefined ? <div>Edit</div> : <div>ADD</div>}

                </div>
                <Form>
                    <div className="row">
                        <div className="col">
                            <FormGroup >
                                <Label for="firstName" sm={2}>FirstName</Label>
                                <Input type="text" name="firstName" id="firstName" className="form-control col-sm-5" placeholder="Enter the Name" value={this.state.firstName}
                                    onChange={(event) => {
                                        this.setState({
                                            firstName: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>


                        <div className="col">
                            <FormGroup >
                                <Label for="lastName" sm={2}>LastName</Label>
                                <Input type="text" name="lastName" id="lastName" className="form-control col-sm-5" placeholder="Enter the Name" value={this.state.lastName}
                                    onChange={(event) => {
                                        this.setState({
                                            lastName: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormGroup >
                                <Label for="UserName" sm={2}>userName</Label>
                                <Input type="text" name="UserName" id="UserName" className="form-control col-sm-5" value={this.state.UserName}
                                    onChange={(event) => {
                                        this.setState({
                                            UserName: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                        <div className="col">
                            <FormGroup >
                                <Label for="EmailID" sm={2}>EmailID</Label>
                                <Input type="text" name="EmailID" id="EmailID" className="form-control col-sm-5" value={this.state.EmailID}
                                    onChange={(event) => {
                                        this.setState({
                                            EmailID: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormGroup >
                                <Label for="Address" sm={2}>AddresslID</Label>
                                <Input type="textarea" name="Address" id="Address" className="form-control col-sm-5" value={this.state.Address}
                                    onChange={(event) => {
                                        this.setState({
                                            Address: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                        <div className="col">
                            <FormGroup >
                                <Label for="Image" sm={2}>Image</Label>
                                <Input type="text" name="Image" id="Image" className="form-control col-sm-5" value={this.state.Image}
                                    onChange={(event) => {
                                        this.setState({
                                            Image: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormGroup >
                                <Label for="MobileNo" >MobileNo</Label>
                                <Input type="number" name="MobileNo" id="MobileNo" className="form-control col-sm-5" value={this.state.MobileNo}
                                    onChange={(event) => {
                                        this.setState({
                                            MobileNo: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                        <div className="col">
                            <FormGroup >
                                <Label for="Department" >Department</Label>
                                <select onChange={(e) => { this.onChangeDepartment(e) }}>

                                </select>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <FormGroup >
                                <Label for="jobTitle" >Job Title</Label>
                                <select>
                                    {}
                                </select>
                            </FormGroup>
                        </div>
                        <div className="col">
                            <FormGroup >
                                <Label for="TeamLeader" >Team Leader</Label>
                                <select Dept="dropdown" onClick={(event) => { this.addDept(); }} >
                                    /></select>
                            </FormGroup>
                        </div>
                    </div>
                    {this.state.userId !== undefined ?
                        <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.UpdateUserDetails(this.state);
                        }}>Edit</button>
                        : <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.save(this.state);
                        }}>Save</button>}





                </Form>
            </div>


        )
    }
}
export default AddUser;
