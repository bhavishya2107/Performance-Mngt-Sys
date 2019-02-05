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
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="" for="kraName">Name</label>
                                        <div>
                                            <input id="kraName" type="text" className="form-control px-5 "
                                                value=""
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