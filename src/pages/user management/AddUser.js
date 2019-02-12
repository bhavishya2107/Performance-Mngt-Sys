import React, { Component } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification } from '../Environment'
import { Link } from 'react-router-dom';
var displayDataReturn = []

class AddUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: props.match.params.userId,
            RedirectToUserManagement: false,
            userName: "",
            password: "12345",
            firstName: "",
            lastName: "",
            emailAddress: "",
            mobileNo: "",
            Address: "",
            roleId: "",
            depId: "",
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
        this.setState({

            userName: "",
            password: "",
            firstName: "",
            lastName: "",
            emailAddress: "",
            mobileNo: "",
            profileImage: "",
            Address: "",
            Image: "",
        })
    }
    //#endregion

    //#region  bind the dropdown list on onChange event
    onChangeDepartment(event) {
        this.setState({
            depId: event.target.value

        })
    }
    onChangeJob(event) {
        this.setState({
            jobtitleId: event.target.value
        })
    }
    onChangeRole(event) {
        this.setState({
            roleId: event.target.value

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
            "roleId": this.state.roleId,
            "mobileNo": this.state.mobileNo,
            "profileImage": this.state.profileImage,
            "teamId": this.state.teamId,
            "depId": this.state.depId,
            "jobtitleId": this.state.jobtitleId,
            "Address": this.state.Address

        }
        var url = environment.apiUrl + moduleUrls.User
        $.ajax({
            url: url,
            type: Type.post,
            data: DataList,
            success: function (response) {
                _this.setState({ RedirectToUserManagement: true });
                toast.success("User " + Notification.saved, {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    //#endregion 
    //#region  Update the user details
    getUserApi() {
        var url = environment.apiUrl + moduleUrls.User + '/' + `${this.state.userId}`
        return $.ajax({
            url: url,
            type: Type.get,

        })
    }
    updateAjaxCall(data) {
        var _this = this;
        var userList =
        {
            "jobtitleId": data.jobtitleId,
            "depId": data.depId,
            "roleId": data.roleId,
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

        var url = environment.apiUrl + moduleUrls.User + '/' + `${data.userId}`
        return $.ajax({
            url: url,
            type: Type.patch,

            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",

                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(userList),
        });
    }
    UpdateUserDetails(data) {
        var res = this.updateAjaxCall(data);
        res.done((response) => {
            this.setState({
                isUpdate: true

            })
            toast.success("Update User Successfully !", {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error) => {
        })
    }
    getUserDetails() {
        if (this.state.userId !== undefined) {
            var res = this.getUserApi();
            res.done((response) => {
                if (response != undefined) {
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
                        jobtitleId: res.jobtitleId,
                        depId: res.depId,
                        roleId: res.roleId,
                        teamId: res.teamId
                    })
                }
            });
            res.fail((error) => {

            })
        } else {

        }
    }
    //#endregion
    //#region  get dept,job,role records through api
    getDeptData() {
        var url = environment.apiUrl + moduleUrls.Department
        $.ajax({
            url: url,
            type: Type.get,
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
        var url = environment.apiUrl + moduleUrls.Jobtitle
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempJob) => {
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
        var url = environment.apiUrl + moduleUrls.Role
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempRole) => {
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
        var url = environment.apiUrl + moduleUrls.User
        $.ajax({
            url: url,
            type: Type.get,
            success: (res) => {
                console.log(res);
                var displayDataReturn = res.map(function (item) {
                    if (item.roleId === 61) {
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
    componentDidMount() {
        this.getUserDetails();
        this.getDeptData();
        this.getJobData();
        this.getRoleData();
        this.getTeamLeader();

    }
    //#endregion
    render() {
        if (this.state.RedirectToUserManagement) {

            return <Redirect to={{ pathname: "/UserManagement", state: "2" }} />
        }
        if (this.state.isUpdate == true) {

            return <Redirect to="/UserManagement" />
        }
        return (
            <div>
                <div className="clearfix">
                    <div className="clearfix d-flex align-items-center row page-title">
                        <h2 className="col"> User Management >
                    {this.state.userId !== undefined ? <span>Edit</span> : <span>Add</span>}
                        </h2>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <form id="createUser">
                                <div className="row">
                                    <div className="col-md-3 order-md-last text-left">
                                        <div className="form-group">
                                            <label for="profileImage" class="required">Image</label>
                                            <div className="clearfix mb-2">
                                                <div className="user-img-block">
                                                    <img src="https://via.placeholder.com/150" className="img-thumbnail" />
                                                    <a href="#" className="btn-image-remove">x</a>
                                                </div>
                                            </div>
                                            <div className="upload-img">
                                                <Input type="file" name="profileImage" id="profileImage" className=""
                                                    onChange={(event) => {
                                                        this.setState({
                                                            profileImage: event.target.value
                                                        })
                                                    }} />

                                                <label className="btn btn-primary btn-block">Upload Image</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9 order-md-first">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="firstName" class="required" sm={2} >FirstName</label>
                                                    <input type="text" name="firstName" id="firstName" maxLength="20" className="form-control" placeholder="Enter the Name" value={this.state.firstName}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                firstName: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="lastName" class="required" sm={2}>LastName</label>
                                                    <input type="text" name="lastName" id="lastName" maxLength="20" className="form-control" placeholder="Enter the Name" value={this.state.lastName}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                lastName: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="userName" className="required" sm={2}>UserName</label>
                                                    <input type="text" name="userName" id="userName" maxLength="20" className="form-control" value={this.state.userName}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                userName: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="emailAddress" class="required" sm={2}>Email ID</label>
                                                    <input type="email" name="emailAddress" id="emailAddress" maxLength="50" className="form-control" value={this.state.emailAddress}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                emailAddress: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label for="mobileNo" class="required">Mobile No</label>
                                                    <input type="phone" name="mobileNo" id="mobileNo" maxLength="10" className="form-control" value={this.state.mobileNo}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                mobileNo: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Department</label>
                                                    <select required name="deptDropDown" value={this.state.depId} onChange={(e) => { this.onChangeDepartment(e) }} className="form-control" >
                                                        <option value="">select</option>
                                                        {this.state.displayDeptData}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Job Title</label>
                                                    <select required name="jobDropDown" onChange={(e) => { this.onChangeJob(e) }} value={this.state.jobtitleId} className="form-control" >
                                                        <option value="">select</option>
                                                        {this.state.displayJobData}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Role</label>
                                                    <select required name="roleDropDown" onChange={(e) => { this.onChangeRole(e) }} value={this.state.roleId} className="form-control">
                                                        <option value="">select</option>
                                                        {this.state.displayRoleData}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label>Team Leader</label>
                                                    <select required onChange={(e) => { this.onChangeTeamLeader(e) }} value={this.state.teamId} className="form-control">
                                                        <option value="">select</option>
                                                        {this.state.displayTeamLeaderData}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label class="required">Address</label>
                                                    <textarea name="Address" id="Address" maxLength="50" rows="3" className="form-control" value={this.state.Address}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                Address: event.target.value
                                                            })
                                                        }} required>
                                                    </textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    {this.state.userId !== undefined ?
                                                        <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                            this.UpdateUserDetails(this.state);
                                                        }}>Update</button>
                                                        : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                            this.saveUser(this.state);
                                                        }}>Save</button>}

                                                    <button type="button" className="btn btn-info mr-2" onClick={() => { this.clear(); }}>Clear</button>
                                                    <Link to='/UserManagement' className="btn btn-danger mr-2">Cancel</Link>
                                                </div>
                                            </div></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>


        )
    }
}
export default AddUser;
