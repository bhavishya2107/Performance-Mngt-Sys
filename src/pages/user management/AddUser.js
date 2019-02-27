import React, { Component } from 'react';
import { Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Type, moduleUrls, Notification } from '../Environment'
import { Link } from 'react-router-dom';
import ReactFileReader from 'react-file-reader';


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
            address: "",
            roleId: "",
            departmentId: "",
            reportingManagerId: "",
            reportingManagerName : '',
            oldreportingManagerId:"",
            profileImage: null,
            isUpdate: false,
            selectDept: "",
            selectJobTitle: "",
            selectRole: "",
            displayDataReturn: "",
            displayTeamLeaderData: '',
            departmentId: "",
            designationId: "",
            imageSrc: "",
            gender: ""


        }

    }

    //#region  clear user fields
    reset() {
        window.location.reload();
    }
    //#endregion

    //#region  bind the dropdown list on onChange event
    onChangeDepartment(event) {
        this.setState({
            departmentId: event.target.value

        })
    }
    onChangeJob(event) {
        this.setState({
            designationId: event.target.value
        })
    }
    onChangeRole(event) {
        this.setState({
            roleId: event.target.value

        })
    }

    onChangeTeamLeader(event) {

console.log(event.target)
console.log(event.target.name)

        this.setState({
            reportingManagerId: event.target.value,
            reportingManagerName: event.target.value,

        })
    }
    //#endregion
    //#region save the details on click button

    isUserExistApi() {
        var url = environment.apiUrl + moduleUrls.User + '?_where=(userName,eq,' + this.state.userName.trim() + ')'
        return $.ajax({
            url: url,
            type: Type.get
        })
    }
    isUserEmailExistApi() {
        var url = environment.apiUrl + moduleUrls.User + '?_where=(emailAddress,eq,' + this.state.emailAddress.trim() + ')'
        return $.ajax({
            url: url,
            type: Type.get
        })
    }

    isExistUserNameOnChange() {
        if (this.state.userId != undefined) {
            var res = this.isUserExistUpdateApi();

            res.done((response) => {

                if (response.length > 0) {
                    $(".dataExist").show()

                } else {
                }
            }
            )
        }
        else {
            var res = this.isUserExistApi();
            console.log(res, 1)
            res.done((response) => {
                if (response.length > 0) {

                    $(".dataExist").show()

                } else {

                }
            })
        }
    }
    sendMailAPI(body) {
        const emailUrl = "https://prod-17.centralindia.logic.azure.com:443/workflows/ecb28aa6326c46d2b632dbe5a34f76af/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qK3dMqlg6f1nEjlqWvG-KtxyVrAXqb3Zn1Oy5pJJrXs";

        return $.ajax({
            url: emailUrl,
            type: "post",
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",

            },


        })
    }
    userGender() {
        if (this.state.gender == "Male") {
            return "<span>His name is <b>" +this.state.userName  + "</b></span>"
        }
        else {
            return "<span>Her name is <b>" + this.state.userName + "</b></span>"
        }
    }
    sendMail() {

        var body =
        {
            emailSubject: "Employee added in your team",
            emailBody: `<html>
             <body>
                <p>Hello ${this.state.reportingManagerName},</p>
                <p>${this.state.firstName} ${this.state.lastName} is added to your team. ${this.userGender()}</p>
                
                <p>Thanks,</p>
                <p>PSSPL ADMIN</p>
            </body>
             </html>`,
            toemailadress: "psspl.trainee32@outlook.com"
        }

        var res = this.sendMailAPI(body);
        res.done((response) => {
            this.setState({
                RedirectToUserManagement: true
            })
        })
        res.fail((error) => {
            console.log(error);
        })


    }
    saveUserDetailsApi(DataList) {
        var url = environment.apiUrl + moduleUrls.User
        return $.ajax({
            url: url,
            type: Type.post,
            data: DataList,
        })
    }
    saveUserDetails(DataList) {
        var res = this.saveUserDetailsApi(DataList);
        res.done((response) => {

            this.sendMail();
            toast.success("User " + Notification.saved, {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error) => {

        })

    }
    saveUser() {
        var isvalidate = window.formValidation("#createUser");
        if (isvalidate) {
            var res = this.isUserExistApi();
            var res = this.isUserEmailExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show()
                }
                else {
                    var _this = this;
                    var DataList =
                    {
                        "userName": this.state.userName.trim(),
                        "password": this.state.password,
                        "firstName": this.state.firstName,
                        "lastName": this.state.lastName,
                        "emailAddress": this.state.emailAddress.trim(),
                        "roleId": this.state.roleId,
                        "mobileNo": this.state.mobileNo,
                        //"profileImage": this.state.imageSrc,
                        "reportingManagerId": this.state.reportingManagerId,
                        "departmentId": this.state.departmentId,
                        "designationId": this.state.designationId,
                        "address": this.state.address,
                        "profileImage": this.state.imageSrc,
                        "gender": this.state.gender,

                    }
                    this.saveUserDetails(DataList);
                }
            });
            res.fail(error => {

            });
        }
        else {

            return false;
        }
    }

    handleFiles = files => {
        debugger;
        this.setState({
            imageSrc: files.base64
        })
    }

    removeimg() {
        this.setState({
            imageSrc: ""
        })
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
    isUserExistUpdateApi() {
        var url = environment.apiUrl + moduleUrls.User + '/' + '?_where=(userName,eq,' + this.state.userName.trim() + ')' + '~and(userId,ne,' + this.state.userId + ')'
        return $.ajax({
            url: url,
            type: Type.get
        })
    }
    isUserExistEmailUpdateApi() {
        var url = environment.apiUrl + moduleUrls.User + '/' + '?_where=(emailAddress,eq,' + this.state.emailAddress.trim() + ')' + '~and(userId,ne,' + this.state.userId + ')'
        return $.ajax({
            url: url,
            type: Type.get
        })
    }

    //email row Exists
    isExistEmailOnChange() {
        if (this.state.userId != undefined) { //id is undefinded edit 
            var res = this.isUserExistEmailUpdateApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            }
            )
        }
        else {
            var res = this.isUserEmailExistApi(); //save
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            })
        }
    }

    updateAjaxCall(data) {

        var userList =
        {
            "designationId": data.designationId,
            "departmentId": data.departmentId,
            "roleId": data.roleId,
            "userName": data.userName.trim(),
            "password": "12345",
            "firstName": data.firstName,
            "lastName": data.lastName,
            "emailAddress": data.emailAddress.trim(),
            "mobileNo": data.mobileNo,
            "reportingManagerId": data.reportingManagerId,
            "address": data.address,
            "profileImage": data.imageSrc,
            "gender": data.gender,

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
    updatedUserGender() {
        if (this.state.gender == "Male") {
            return "<span>.His name is <b>" + this.state.userName + "</b></span>"
        }
        else {
            return "<span>Her name is " + <b>this.state.userName </b>+ "</span>"
        }
    }
    updatedMailApi(body) {
        const emailUrl = "https://prod-17.centralindia.logic.azure.com:443/workflows/ecb28aa6326c46d2b632dbe5a34f76af/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=qK3dMqlg6f1nEjlqWvG-KtxyVrAXqb3Zn1Oy5pJJrXs";

        return $.ajax({
            url: emailUrl,
            type: "post",
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
       })
    }
    updatedMail() {
        
        if (this.state.oldreportingManagerId !== this.state.reportingManagerId) {
            
            var body = {
                emailSubject: "Employee updated",
                emailBody: `<html>
                <body>
                <p>Hello ${this.state.reportingManagerName},</p>
                <p>${this.state.firstName} ${this.state.lastName} is updated in your team ${this.updatedUserGender()}</p>
                <p>Thanks,</p>
                <p>PSSPL ADMIN</p>
                </body>
                </html>`,
                toemailadress: "prashant.khanderia@prakashinfotech.com"
            }
            var result=this.getTeamLeaderAPI()
            result.done((teamLeaderSent)=>{
                

            })
            result.fail((error)=>{

            })
            var res = this.updatedMailApi(body);
           
            res.done((response) => {
                this.setState({
                    isUpdate: true
                })
            })
            res.fail((error) => {
                console.log(error);
            })


        }
    }

    updateUser(data) {
        var res = this.updateAjaxCall(data);
        res.done((response) => {
            this.updatedMail();
            toast.success("User " + Notification.updated, {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error)=>{

        })
    }


    UpdateUserDetails(data) {
        var result = window.formValidation("#createUser");
        if (result) {
            var res = this.isUserExistUpdateApi();
            var res = this.isUserExistEmailUpdateApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show()
                }
                else {
                   this.updateUser(data)
                }
            });

            res.fail((error) => {
            })
        }
        else {
            return false;
        }
    }
    getUserDetails() {
        if (this.state.userId !== undefined) {
            var res = this.getUserApi();
            res.done((response) => {
                if (response !== undefined) {
                    var res = response[0];
                    this.setState({
                        firstName: res.firstName,
                        lastName: res.lastName,
                        userName: res.userName,
                        emailAddress: res.emailAddress,
                        mobileNo: res.mobileNo,
                        roleId: res.roleId,
                        address: res.address,
                        imageSrc: res.profileImage,
                        designationId: res.designationId,
                        departmentId: res.departmentId,
                        roleId: res.roleId,
                        reportingManagerId: res.reportingManagerId,
                        oldreportingManagerId:res.reportingManagerId,
                        gender: res.gender,

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
                        <option key={item.departmentId} value={item.departmentId}>{item.departmentName}</option>

                    )
                });
                this.setState({
                    displayDeptData: displayDataReturn
                })
            },
        });

    }
    getJobData() {
        var url = environment.apiUrl + moduleUrls.Designation
        $.ajax({
            url: url,
            type: Type.get,
            success: (tempJob) => {
                var displayDataReturn = tempJob.map(function (i) {
                    return (
                        <option key={i.designationId} value={i.designationId}>{i.designationName}</option>


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
                        <option key={item.roleId} value={item.roleId}>{item.roleName}</option>
                    )
                });
                this.setState({
                    displayRoleData: displayDataReturn
                })
            },
        });
    }


    getTeamLeaderAPI=()=>{
        // var changePWquery = {
        //     query: `update user_master  set password =  '${this.state.password}'  where emailAddress = '${localStorage.getItem('emailAddress')}'`
        // }
        var getTL=environment.dynamicUrl + 'dynamic' ;
        var TLquery={
            query:`select firstName,lastName from user_master where userid='1'`
        }
        $.ajax({
            url:getTL,
            type:Type.post,
            data:JSON.stringify(TLquery),
            headers:{
                "Content-Type":"application/json"
            },

        })

    }

    getTeamLeader() {
        var url = environment.apiUrl + moduleUrls.User
        $.ajax({
            url: url,
            type: Type.get,
            success: (res) => {
                console.log(res);
                var displayDataReturn = res.map(function (item) {
                    if (item.roleId === 1) {
                        return (
                            <option key={item.userName} value={item.userId}>{item.userName}</option>
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
            return <Redirect to={{ pathname: "/user-management", state: "2" }} />
        }
        if (this.state.isUpdate === true) {

            return <Redirect to="/user-management" />
        }
        return (
            <div>
                <div className="clearfix">
                    <div className="clearfix d-flex align-items-center row page-title">
                        <h2 className="col">
                            {this.state.userId !== undefined ? <span>Edit User</span> : <span>Add User</span>}
                        </h2>

                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <form id="createUser">
                                <div className="row">
                                    <div className="col-md-3 order-md-last text-left">
                                        <div className="form-group">
                                            <label htmlFor="profileImage">Image</label>
                                            <div className="clearfix mb-2">
                                                <div className="user-img-block">
                                                    {this.state.imageSrc == "" ?

                                                        (<img src="../img/download.png" id="imgB" className="img-thumbnail" />)
                                                        :
                                                        (<img src={this.state.imageSrc} id="imgB" className="img-thumbnail" />)
                                                    }
                                                    {this.state.imageSrc !== "" ?
                                                        (<a href="#" onClick={() => { this.removeimg() }} className="btn-image-remove">x</a>)
                                                        :
                                                        (<div>

                                                        </div>)
                                                    }
                                                </div>
                                            </div>
                                            <div className="upload-img">

                                                <ReactFileReader base64={true} handleFiles={this.handleFiles}>
                                                    <label className="btn btn-primary btn-sm">Upload Image</label>
                                                </ReactFileReader>


                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9 order-md-first">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="firstName" className="required" sm={2} maxLength="50" >First Name</label>
                                                    <input type="text" name="firstName" id="firstName" className="form-control" value={this.state.firstName}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                firstName: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="lastName" className="required" sm={2} >Last Name</label>
                                                    <input type="text" name="lastName" id="lastName" maxLength="50" className="form-control" value={this.state.lastName}
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
                                                    <label htmlFor="userName" className="required" sm={2}>User Name</label>
                                                    <input type="text" name="userName" id="userName" maxLength="50" className="form-control" value={this.state.userName}
                                                        onBlur={() => { this.isExistUserNameOnChange() }}

                                                        onChange={(event) => {
                                                            $(".dataExist").hide()
                                                            this.setState({
                                                                userName: event.target.value
                                                            })
                                                        }} required />
                                                    <p className="dataExist" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="emailAddress" className="required" sm={2}>email</label>
                                                    <input type="email" name="emailAddress" id="emailAddress" maxLength="50"
                                                        onBlur={() => { this.isExistEmailOnChange() }}
                                                        className="form-control" value={this.state.emailAddress}
                                                        onChange={(event) => {
                                                            $(".recordexists").hide()
                                                            this.setState({
                                                                emailAddress: event.target.value
                                                            })
                                                        }} required />
                                                    <p className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="mobileNo" className="required">Mobile No</label>
                                                    <input type="text" name="mobileNo" id="mobileNo" maxLength="10" className="form-control" value={this.state.mobileNo}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                mobileNo: event.target.value
                                                            })
                                                        }} required />
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="required">Department</label>
                                                    <select required name="deptDropDown" value={this.state.departmentId} onChange={(e) => { this.onChangeDepartment(e) }} className="form-control" >
                                                        <option value="">select</option>
                                                        {this.state.displayDeptData}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="required">Designation</label>
                                                    <select required name="jobDropDown" onChange={(e) => { this.onChangeJob(e) }} value={this.state.designationId} className="form-control" >
                                                        <option value="">select</option>
                                                        {this.state.displayJobData}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="required">Role</label>
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
                                                    <label className="required">Team Leader</label>
                                                    <select required onChange={(e) => { this.onChangeTeamLeader(e) }} value={this.state.reportingManagerId} className="form-control">
                                                        <option value="">select</option>
                                                        {this.state.displayTeamLeaderData}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label className="required">Gender</label><br></br>
                                                    <label> <input type="radio" name="gender" value="Male" checked={this.state.gender === "Male"} onChange={(event) => {
                                                        this.setState({
                                                            gender: event.target.value
                                                        })
                                                    }} />Male</label>
                                                    <label> <input type="radio" name="gender" value="Female" checked={this.state.gender === "Female"} onChange={(event) => {
                                                        this.setState({
                                                            gender: event.target.value
                                                        })
                                                    }} />Female</label>


                                                </div>
                                            </div>

                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group">
                                                    <label className="required">Address</label>
                                                    <textarea name="Address" id="Address" rows="3" maxLength="100" className="form-control" value={this.state.address}
                                                        onChange={(event) => {
                                                            this.setState({
                                                                address: event.target.value
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

                                                    <button type="button" className="btn btn-info mr-2" onClick={() => { this.reset(); }}>Reset</button>
                                                    <Link to='/user-management' className="btn btn-danger mr-2">Cancel</Link>
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
