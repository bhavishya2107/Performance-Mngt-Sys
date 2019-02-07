import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from './Environment'
import {Link} from 'react-router-dom';
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
            Address: "",
            roleId: "",
            teamId: "",
            profileImage: "",
            isUpdate: false,
            selectDept: "",
            selectJobTitle: "",
            selectRole: "",
            displayDataReturn: "",
            displayTeamLeaderData: '',
            departmentId: "",
            jobtitleId: "",

        }
    }
    //#region  clear user fields
    clear() {
        this.setState = {

            userName: "",
            password: "",
            firstName: "",
            lastName: "",
            emailAddress: "",
            mobileNo: "",
            profileImage: "",
            Address: "",
            Image: "",
            
            
        }
    }
    //#endregion

    //#region  bind the dropdown list on onChange event
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
            teamId: event.target.value
        })
    }
    //#endregion
    //#region save the details on click button
    saveUser() {
        var res = window.formValidation("#createUser");
        if (res) {

        } else {

            return false;
        }

        var _this = this;
        var DataList =
        {
            "userName": this.state.userName,
            "password": this.state.password,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailAddress": this.state.emailAddress,
            "roleId": this.state.selectRole,
            "mobileNo": this.state.mobileNo,
            "profileImage": this.state.profileImage,
            "teamId": this.state.teamId,
            "depId": this.state.selectDept,
            "jobtitleId": this.state.selectJobTitle,
            "Address": this.state.Address

        }
        var url = environment.apiUrl + 'user_master';
        $.ajax({
            url: url,
            type: "POST",
            data: DataList,
            success: function (response) {
                _this.setState({ RedirecttouserManagement: true });
                toast.success("Save User Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    //#endregion 
    //#region  Update the user details
    getUserApi() {

        var url = environment.apiUrl + 'user_master/' + `${this.state.userId}`
        return $.ajax({
            url: url,
            type: "GET",

        })
    }
    updateAjaxCall(data) {
        var _this = this;

        var userList =
        {
            "jobtitleId": data.selectJobTitle,
            "depId": data.selectDept,
            "roleId": data.selectRole,
            "userName": data.userName,
            "password": "12345",
            "firstName": data.firstName,
            "lastName": data.lastName,
            "emailAddress": data.emailAddress,
            "mobileNo": data.mobileNo,
            "profileImage": data.profileImage,
            "teamId": data.teamId,
            "Address": data.Address,

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
        console.log(data, 'charmi')
        var res = this.updateAjaxCall(data);
        res.done((response) => {
            console.log('sucesss')
            this.setState({
                isUpdate: true

            })
            toast.success("Update User Successfully !", {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error) => {

            console.log('error', error);
        })
    }
    componentDidMount() {


        if (this.state.userId !== undefined) {
            var res = this.getUserApi();
            res.done((response) => {
                
                var res = response[0];
                this.setState({
                    firstName: res.firstName,
                    lastName: res.lastName,
                    userName: res.userName,
                    emailAddress: res.emailAddress,
                    mobileNo: res.mobileNo,
                    roleId: res.roleId,
                    Address: res.Address,
                    profileImage: res.profileImage,
                    selectJobTitle: res.jobtitleId,
                    selectDept:res.depId,
                    selectRole:res.roleId,
                    teamId:res.teamId
                })
          
            });
            res.fail((error) => {

            })
        } else {

        }
    }
    //#endregion
    //#region  get dept,job,role records through api
    getDeptData() {
        var url = environment.apiUrl + 'department_master/'
        $.ajax({
            url: url,
            type: 'GET',
            success: (temp) => {
                console.log(temp);
                var displayDataReturn = temp.map(function (item) {
                    return (
                        <option value={item.depId}>{item.depName}</option>
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

                console.log(tempJob);
                var displayDataReturn = tempJob.map(function (i) {
                    return (
                        <option value={i.jobtitleId}>{i.jobtitleName}</option>
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
                        <option value={item.roleId}>{item.roleName}</option>
                    )
                });

                this.setState({
                    displayRoleData: displayDataReturn
                })
            },

        });
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
                            <option value={item.userId}>{item.userName}</option>

                        )
                    }
                });
                this.setState({
                    displayTeamLeaderData: displayDataReturn
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
    //#endregion
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
                <form id="createUser">
                    <div className="row">
                        <div className="col">
                            <label for="firstName" class="required" sm={2} >FirstName</label>
                            <input type="text" name="firstName" id="firstName" maxLength="20" className="form-control col-sm-5" placeholder="Enter the Name" value={this.state.firstName}
                                onChange={(event) => {
                                    this.setState({
                                        firstName: event.target.value
                                    })
                                }} required />
                        </div>
                        <div className="col">
                            <label for="lastName" class="required" sm={2}>LastName</label>
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
                            <label for="userName" sm={2}>UserName</label>
                            <input type="text" name="userName" id="userName" maxLength="20" className="form-control col-sm-5" value={this.state.userName}
                                onChange={(event) => {
                                    this.setState({
                                        userName: event.target.value
                                    })
                                }} required />
                        </div>
                        <div className="col">
                            <label for="emailAddress" class="required" sm={2}>Email ID</label>
                            <input type="email" name="emailAddress" id="emailAddress" maxLength="50" className="form-control col-sm-5" value={this.state.emailAddress}
                                onChange={(event) => {
                                    this.setState({
                                        emailAddress: event.target.value
                                    })
                                }} required />

                        </div>
                    </div>

                    <div className="row">
                        <div className="col">
                            <label for="Address" class="required" sm={2}>Address</label>
                            <input type="textarea" name="Address" id="Address" maxLength="50" className="form-control col-sm-5" value={this.state.Address}
                                onChange={(event) => {
                                    this.setState({
                                        Address: event.target.value
                                    })
                                }} required />
                        </div>
                        <div className="col">
                            <label for="profileImage" class="required" sm={2}>Image</label>
                            <Input type="text" name="profileImage" id="profileImage" className="form-control col-sm-5" value={this.state.profileImage}
                                onChange={(event) => {
                                    this.setState({
                                        profileImage: event.target.value
                                    })
                                }} required />

                        </div>
                    </div>
                    <div className="row">
                        <div className="col">

                            <label for="mobileNo" class="required">Mobile No</label>
                            <input type="phone" name="mobileNo" id="mobileNo" maxLength="10" className="form-control col-sm-5" value={this.state.mobileNo}
                                onChange={(event) => {
                                    this.setState({
                                        mobileNo: event.target.value
                                    })
                                }} required />

                        </div>
                        <div className="dropdown" >
                            <label className="mr-2">Department:</label>
                            <select name="deptDropDown" value={this.state.selectDept} onChange={(e) => { this.onChangeDepartment(e) }} className="btn btn-info dropdown-toggle md mr-3" required>
                                <option>select</option>
                                {this.state.displayDeptData}
                            </select>

                        </div>
                    </div>

                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Job Title:</label>
                            <select onChange={(e) => { this.onChangeJob(e) }} value={this.state.selectJobTitle} className="btn  dropdown-toggle md mr-3" required>
                                <option>select</option>
                                {this.state.displayJobData}
                            </select>
                        </div>

                    </div>

                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Role:</label>
                            <select value={this.state.selectRole} onChange={(e) => { this.onChangeRole(e) }} className="btn dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayRoleData}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="dropdown" >
                            <label className="mr-2">Team Leader:</label>
                            <select  onChange={(e) => { this.onChangeTeamLeader(e) }} value={this.state.teamId} className="btn dropdown-toggle md mr-3">
                                <option>select</option>
                                {this.state.displayTeamLeaderData}
                            </select>
                        </div>
                    </div>
                    {this.state.userId !== undefined ?
                        <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.UpdateUserDetails(this.state);
                        }}>Update</button>
                        : <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.saveUser(this.state);
                        }}>Save</button>}

                    <button type="button" className="btn btn-sm btn-info mr-2" onClick={() => { this.clear(); }}>Clear</button>
                  <Link to='/UserManagement'className="btn btn-sm btn-danger mr-2">Cancel</Link>

                </form>
            </div>
        )
    }
}
export default AddUser;
