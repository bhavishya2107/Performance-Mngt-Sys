import React, { Component } from "react";
import { environment } from "../Environment";
const $ = require("jquery");

class MyProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      username: "",
      firstname: "",
      lastname: "",
      emailaddress: "",
      mobileno: "",
      depname: "",
      address: "",
      profileimage: "",
      designationName: "",
      rolename: "",
      teamleader: ""
    };
  }

  getUserDetailsApi() {
     var endpoint = environment.dynamicUrl + 'dynamic';

    // const endpoint = "http://180.211.103.189:3000/dynamic";

    return $.ajax({
      url: endpoint,
      type: "POST",
      data: {
        query:
        "select u.username,u.firstname,u.lastname,u.emailaddress,u.mobileno,d.departmentName,u.address,u.profileimage,r.rolename, u.firstname  as teamleader from user_master U left join department_master d on U.departmentId = d.departmentId left join designation_master dm on u.designationId = dm.designationId left join role_master r on u.roleid = r.roleid where u.userid = 2"
      }
    });
  }

  componentDidMount() {
    if (this.state.userId !== undefined) {
      var res = this.getUserDetailsApi();
      res.done(response => {
        this.setState({
          userName: response[0].username,
          firstName: response[0].firstname,
          lastName: response[0].lastname,
          emailAddress: response[0].emailaddress,
          mobileno: response[0].mobileno,
          depname: response[0].depname,
          address: response[0].address,
          designationName: response[0].designationName,
          rolename: response[0].rolename,
          teamleader: response[0].teamleader,
          profileImage: response[0].profileimage
        });
      });
      res.fail(error => {});
    } else {
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="clearfix d-flex align-items-center row page-title">
          <h2 className="col">MyProfile</h2>
          <div className="col text-right" />
        </div>

        <form action="">
          <div className="row">
            <div className="col-md-3 order-md-last text-center">
              <div>
                <img
                  // src={this.state.profileImage}
                  src= "https://media.voog.com/0000/0042/3119/photos/profile-picture.jpg"

                  style={{ width: "200px" }}
                  className="img-thumbnail"
                />
              </div>
            </div>
            <div className="col-md-9 order-md-first">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userFirstName">
                      First Name
                    </label>
                    <div>
                      <input
                        id="userFirstName"
                        type="text"
                        className="form-control"
                        readonly
                        value={this.state.firstName}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userLastName">
                      Last Name
                    </label>
                    <div>
                      <input
                        id="userLastName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.lastName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userName">
                      User Name
                    </label>
                    <div>
                      <input
                        id="userName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.userName}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userEmail">
                      Email
                    </label>
                    <div>
                      <input
                        id="userEmail"
                        type="email"
                        className="form-control"
                        readonly
                        value={this.state.emailAddress}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userAddress">
                      Address
                    </label>
                    <div>
                      <input
                        id="userAddress"
                        type="text"
                        className="form-control"
                        readonly
                        value={this.state.address}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userImage">
                      Mobile No.
                    </label>
                    <div>
                      <input
                        id="userLastName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.mobileno}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userDepartment">
                      Department
                    </label>
                    <div>
                      <input
                        id="userDepartment"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.depname}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userLastName">
                    Designation Name
                    </label>
                    <div>
                      <input
                        id="userLastName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.designationName}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userFirstName">
                      Role
                    </label>
                    <div>
                      <input
                        id="userFirstName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.rolename}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userLastName">
                      Team Leader
                    </label>
                    <div>
                      <input
                        id="userLastName"
                        type="text"
                        className="form-control "
                        readonly
                        value={this.state.teamleader}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
export default MyProfile;
