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
            roleId: 11,
            isUpdate: false,
            selectDept: "",
            selectJobTitle: "",
            selectRole: "",
            optionsOfTeamLeader: "",
            filterRole: [],
            displayDataReturn:"",
        }
    }
    //clear all the fields
    clear() {
        this.setState = {

            userName: "",
            password: "",
            firstName: "",
            lastName: "",
            emailAddress: "",

        }
    }

    //bind the dropdown list
    onChangeDepartment(event) {
        this.setState({
            selectDept: event.target.value

        })
    }
    onChangeJob(event) {
        var filter_By_Role = event.filter(item => { return item.TeamLeader === event.target.value });
        console.log(filter_By_Role);
        this.setState({
            selectJobTitle: event.target.value

        })
    }
    onChangeRole(event) {
        this.setState({
            selectRole: event.target.value

        })
    }

    onChangeTeamLeader(event) {
        this.setState({
            optionsOfTeamLeader: event.target.value
        })
    }
    save() {
        debugger;
        var _this = this;
        var DataList =
        {
            "userName": this.state.userName,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailAddress": this.state.emailAddress,
            "roleId": this.state.roleId
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
    //Edit the user details
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
            "emailAddress": data.emailAddress
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
        console.log(data, 'data')
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
                    emailAddress: res.emailAddress,
                    roleId: res.roleId
                })
            });
            res.fail((error) => {

            })
        } else {

        }

    }
    //get dept,job,role records through api
    getDeptData() {
        var url = environment.apiUrl + 'department_master/'
        $.ajax({
            url: url,
            type: 'GET',
            success: (temp) => {
                console.log(temp);
                var displayDataReturn = temp.map(function (item) {
                    return (
                        <option value={item.depId}>{item.depId}</option> ,
                        <option value={item.depName}>{item.depName}</option>
                    )
                });
                this.setState({
                    displayDeptData: displayDataReturn
                })
            },
        });
    }
    getJobData() {
        var url = environment.apiUrl + 'jobtitle_master/'
        $.ajax({
            type: 'GET',
            url: url,

            success: (tempJob) => {
                debugger
                console.log(tempJob);
                var displayDataReturn = tempJob.map(function (i) {
                    return (
                        <option value={i.jobtitleId}>{i.jobtitleId}</option> ,
                        <option value={i.jobtitleName}>{i.jobtitleName}</option>
                    )
                });
                this.setState({
                    displayJobData: displayDataReturn
                })

            },

        });
    }
    getRoleData() {
        var url = environment.apiUrl + 'role_master/'
        $.ajax({
            type: 'GET',
            url: url,

            success: (tempRole) => {
                // if (this.state.roleName == "TeamLeader"){
                //     return(
                    
                //     )
                // }
                    console.log(tempRole);
                var displayDataReturn = tempRole.map(function (item) {
                    return (
                        <option value={item.roleId}>{item.roleId}</option> ,
                        <option value={item.roleName}>{item.roleName}</option>
                    )
                });

                this.setState({
                    displayRoleData: displayDataReturn
                })

            },

        });
    }
    componentWillMount() {
        this.getDeptData();
        this.getJobData();
        this.getRoleData();

    }
    getTeamLeader() {
        var url = environment.apiUrl + 'user_master/'
        $.ajax({
            url: url,
            type: 'GET',
            success: (temp) => {
                console.log(temp);
                var displayDataReturn = temp.map(function (item) {

                    return (

                        <option value={item.userId}>{item.userId}</option> ,
                        <option value={item.userName}>{item.userName}</option>
                    )
                });
                this.setState({
                    displayTeamLeaderData: displayDataReturn
                })

            },

        });
    }

    render() {
        if (this.state.RedirecttouserManagement) {

            return <Redirect to={{ pathname: "/UserManagement", state: "2" }} />
        }
        if (this.state.isUpdate == true) {
            return <Redirect to={{ pathname: "/UserManagement" }} />
        }
        if (this.state.displayDataReturn == 15) {
            var optionsOfTeamLeader = this.state.filterRole.map(function (options) {
                return <option value={options.TeamLeader}>{options.TeamLeader}</option>
            });
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
                                <Label for="UserName" sm={2}>UserName</Label>
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
                                <Label for="EmailID" sm={2}>Email ID</Label>
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
                                <Label for="Address" sm={2}>Address</Label>
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
                                <Label for="MobileNo" >Mobile No</Label>
                                <Input type="number" name="MobileNo" id="MobileNo" className="form-control col-sm-5" value={this.state.MobileNo}
                                    onChange={(event) => {
                                        this.setState({
                                            MobileNo: event.target.value
                                        })
                                    }} />
                            </FormGroup>
                        </div>
                        <div className="dropdown" >
                            <label className="mr-2">Department:</label>
                            <select onChange={(e) => { this.onChangeDepartment(e) }} className="btn btn-info dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayDeptData}
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Job Title:</label>
                            <select onChange={(e) => { this.onChangeJob(e) }} className="btn btn-info dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayJobData}
                            </select>
                        </div>

                    </div>

                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Role:</label>
                            <select onChange={(e) => { this.onChangeRole(e) }} className="btn btn-info dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayRoleData}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Team Leader:</label>
                            <select onChange={(e) => { this.onChangeTeamLeader(e) }} className="btn btn-info dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayJobData}
                            </select>
                        </div>
                    </div>
                    {this.state.userId !== undefined ?
                        <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.UpdateUserDetails(this.state);
                        }}>Edit</button>
                        : <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.save(this.state);
                        }}>Save</button>}

                    <button type="button" onClick={() => { this.clear(); }}>Clear</button>

                </Form>
            </div>
        )
    }
}
export default AddUser;
