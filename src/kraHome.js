import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
const $ = require('jquery');



class kraHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitDataFromKra: "",
            RedirectToSample: false,
            description: "",
            kraName: "",
            kraFormData: "",

        };
    }

    submitDataFromKra() {
        debugger;
        var _this = this;

        var kraFormData =
        {
            "kraName": this.state.kraName,
            "description": this.state.description,
            // "createdBy": "",
            // "createdOn": "",
            // "modifiedBy": "",
            // "modifiedOn": ""
        };



        $.ajax({
            url: "http://192.168.10.109:3000/api/kra_master",
            type: "POST",
           
            data: kraFormData,
            // dataType: "text",
            success: function (resultData) {
               
                _this.setState({ RedirectToSample: true });
            },
       
        });

    }

    render() {
        if (this.state.RedirectToSample) {
            return <Redirect to={{ pathname: "/kraListPage", state: "2222" }} />
        }
        return (
            <div>
                <form action="" style={{ textAlign: "center", paddingTop: "100px" }}>
                    <label for="kraName">Name</label>
                    <input id="kraName" type="text" width="250px" className="form"
                        value={this.state.kraName}
                        onChange={(event) => {
                            this.setState(
                                {
                                    kraName: event.target.value
                                }
                            )
                        }} /><br />
                    <label for="kraDescription">Description</label>
                    <textarea rows="6" cols="30"
                        value={this.state.description}
                        onChange={(event) => {
                            this.setState(
                                {
                                    description: event.target.value
                                }
                            )
                        }}></textarea><br />
                    <button type="button" className="btn btn-success btn-sm" onClick={() =>  this.submitDataFromKra() }>Save</button>&nbsp;
                <button className="btn btn-success btn-sm">Clear</button>

                </form>

            </div>
        )
    }
}
export default kraHome;