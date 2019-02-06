import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from './Environment'
var displayDataReturn = []
class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.match.params.userId,
            RedirecttouserManagement: false,
            userName: "",
            password: "12345",
            firstName: "",
            lastName: "",
            emailAddress: "",
            mobileNo: "",
            roleId: 15,
            teamId:"",
            profileImage:"",
            isUpdate: false,
            selectDept: "",
            selectJobTitle: "",
            selectRole: "",
            displayDataReturn: "",
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
            mobileNo: "",
            profileImage:""
        }
    }

    //bind the dropdown list
    onChangeDepartment(event) {
        this.setState({
            selectDept: event.target.value

        })
    }
    onChangeJob(event) {
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

        var _this = this;
        var DataList =
        {
            "userName": this.state.userName,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailAddress": this.state.emailAddress,
            "roleId": this.state.roleId,
            "mobileNo": this.state.mobileNo,
            "profileImage": this.state.profileImage,
            "teamId": this.state.teamId
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

        var url = environment.apiUrl + 'user_master/' + `${this.state.userId}`
        return $.ajax({
            url: url,
            type: "GET",

        })
    }
    updateAjaxCall(userDetails) {
        var _this = this;
        var userList =
        {
            "jobtitleId": userDetails.jobtitleId,
            "depId": userDetails.depId,
            "roleId": userDetails.roleId,
            "userName": userDetails.userName,
            "password": "12345",
            "firstName": userDetails.firstName,
            "lastName": userDetails.lastName,
            "emailAddress": userDetails.emailAddress,
            "mobileNo": userDetails.mobileNo,
            "profileImage": userDetails.profileImage,
            "teamId":userDetails.teamId
        }

        var url = environment.apiUrl + 'user_master/' + `${this.state.userId}`
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

    UpdateUserDetails(userDetails) {
        console.log(userDetails, 'userDetails')
        var res = this.updateAjaxCall(userDetails);
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
                    userName: res.userName,
                    emailAddress: res.emailAddress,
                    mobileNo: res.mobileNo,
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
        this.getTeamLeader();

    }
    getTeamLeader() {
        var url = environment.apiUrl + 'user_master/'
        $.ajax({
            url: url,
            type: 'GET',
            success: (res) => {
                console.log(res);
                var displayDataReturn = res.map(function (item) {
                    if (item.roleId === 15) {
                        return (
                            <option value={item.userId}>{item.userId}</option> ,
                            <option value={item.userName}>{item.userName}</option>

                            // <option>
                            //     {this.state.onChangeRole}
                            // </option>
                        )
                    }
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
                <form id="createUser">
                    <div className="row">
                        <div className="col">
                            <label for="firstName" sm={2}>FirstName</label>
                            <input type="text" name="firstName" id="firstName" maxLength="20" className="form-control col-sm-5" placeholder="Enter the Name" value={this.state.firstName}
                                onChange={(event) => {
                                    this.setState({
                                        firstName: event.target.value
                                    })
                                }} required />

                        </div>


                        <div className="col">

                            <label for="lastName" sm={2}>LastName</label>
                            <input type="text" name="lastName" id="lastName" maxLength="20" className="form-control col-sm-5" placeholder="Enter the Name" value={this.state.lastName}
                                onChange={(event) => {
                                    this.setState({
                                        lastName: event.target.value
                                    })
                                }} required />

                        </div>
                    </div>

                    <div className="row">
                        <div className="col">

                            <label for="UserName" sm={2}>UserName</label>
                            <input type="text" name="UserName" id="UserName" maxLength="20" className="form-control col-sm-5" value={this.state.UserName}
                                onChange={(event) => {
                                    this.setState({
                                        UserName: event.target.value
                                    })
                                }} required />

                        </div>
                        <div className="col">

                            <label for="EmailID" sm={2}>Email ID</label>
                            <input type="email" name="EmailID" id="EmailID" maxLength="20" className="form-control col-sm-5" value={this.state.emailAddress}
                                onChange={(event) => {
                                    this.setState({
                                        EmailID: event.target.value
                                    })
                                }} required />

                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label for="Address" sm={2}>Address</label>
                            <input type="textarea" name="Address" id="Address" maxLength="50" className="form-control col-sm-5" value={this.state.Address}
                                onChange={(event) => {
                                    this.setState({
                                        Address: event.target.value
                                    })
                                }} required />
                        </div>
                        <div className="col">
                            <label for="Image" sm={2}>Image</label>
                            <Input type="text" name="Image" id="Image" className="form-control col-sm-5" value={this.state.Image}
                                onChange={(event) => {
                                    this.setState({
                                        Image: event.target.value
                                    })
                                }} />

                        </div>
                    </div>
                    <div className="row">
                        <div className="col">

                            <label for="MobileNo" >Mobile No</label>
                            <input type="phone" name="MobileNo" id="MobileNo" maxLength="10" className="form-control col-sm-5" value={this.state.mobileNoleNo}
                                onChange={(event) => {
                                    this.setState({
                                        MobileNo: event.target.value
                                    })
                                }} required />

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
                            <select onChange={(e) => { this.onChangeJob(e) }} className="btn btn-info dropdown-toggle md mr-3" required>
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
                                {this.state.displayTeamLeaderData}
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

                </form>
            </div>
        )
    }
}
export default AddUser;
