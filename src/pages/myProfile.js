import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class MyProfile extends Component {

    render() {
        return (
            <div className="container-fluid">
                <h1>MY PROFILE</h1>
                <form action="">
                    <div className="row">
                    <div className="col-md-3 order-md-last text-center">
                            <div>
                                <img src="https://via.placeholder.com/150" className="img-thumbnail" />
                            </div>
                        </div>
                        <div className="col-md-9 order-md-first">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userFirstName">First Name</label>
                                        <div>
                                            <input id="userFirstName" type="text" className="form-control "
                                                value="Bhavishya"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userLastName">Last Name</label>
                                        <div>
                                            <input id="userLastName" type="text" className="form-control "
                                                value="Negi"
                                            />
                                        </div>
                                    </div>
                                </div>
                 
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userName">User Name</label>
                                        <div>
                                            <input id="userName" type="text" className="form-control "
                                                value="trainee32"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userEmail">Email</label>
                                        <div>
                                            <input id="userEmail" type="email" className="form-control"
                                                value="email@email.com"
                                            required/>
                                        </div>
                                    </div>
                                </div>
                      
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userAddress">Address</label>
                                        <div>
                                            <input id="userAddress" type="text" className="form-control "
                                                value="Address"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userImage">Image</label>
                                        <div>
                                            <input id="userLastName" type="text" className="form-control "
                                                value="Image"
                                            />
                                        </div>
                                    </div>
                                </div>
                 
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userFirstName">Mobile No.</label>
                                        <div>
                                            <input id="userFirstName" type="text" className="form-control "
                                                value="number"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userLastName">Department</label>
                                        <div>
                                            <input id="userLastName" type="text" className="form-control "
                                                value="Department"
                                            />
                                        </div>
                                    </div>
                                </div>
                 
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userFirstName">Job Title</label>
                                        <div>
                                            <input id="userFirstName" type="text" className="form-control "
                                                value="jobtitle"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="" for="userLastName">Team Leader</label>
                                        <div>
                                            <input id="userLastName" type="text" className="form-control "
                                                value="Team leader"
                                            />
                                        </div>
                                    </div>
                                </div>
                 
                            </div>
                        </div>

                        
                    </div>
                </form >
            </div >
        )
    }
}
export default MyProfile;