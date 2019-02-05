import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');



class UserRoleForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Redirect: false,
            roleName: "",
            id: props.match.params.id,

        };
    }

    submitDataFromRoleform() {
        debugger;
        var _this = this;

        var roleFormData =
        {
            "roleName": this.state.roleName,
        };



        $.ajax({
            url: "http://192.168.10.109:3000/api/role_master",
            type: "POST",

            data: roleFormData,
            // dataType: "text",
            success: function (resultData) {

                _this.setState({ Redirect: true });
                toast.success("Saved Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                })
            },

        });

    }
    getRoleDetailsApi() {
        var _this = this;
        const endpoint = `http://192.168.10.109:3000/api/role_master/${this.state.id}`;
        return $.ajax({
            url: endpoint,
            type: "GET",

        })
    }
    updateRoleDetailsApi(data) {
        debugger;

        var body =
        {
            "roleName": data.roleName,
        }
        return $.ajax({
            url: `http://192.168.10.109:3000/api/role_master/${data.id}`,
            type: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateRoleDetails(data) {

        var res = this.updateRoleDetailsApi(data);
        res.done((response) => {

            this.setState({
                Redirect: true

            })
            toast.info("Info Notification !", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {

        })
    }
    componentDidMount() {
        debugger;

        if (this.state.id !== undefined) {
            var res = this.getRoleDetailsApi();
            res.done((response) => {

                this.setState({
                    roleName: response[0].roleName,
                })
            });
            res.fail((error) => {

            })
        } else {

        }
    }


    render() {
        if (this.state.Redirect) {
            return <Redirect to={{ pathname: "/userRolePMS", state: "2222" }} />
        }
        return (
            <div className="container">
                {this.state.id !== undefined ? <div>Edit</div> : <div>ADD</div>}
                <form action="" style={{ textAlign: "center", paddingTop: "100px" }}>
                    <div className="jumbotron">
                        <div className="form-group row">
                            <label for="roleName" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input id="roleName" type="text" className="form-control"
                                    value={this.state.roleName}
                                    onChange={(event) => {
                                        this.setState(
                                            {
                                                roleName: event.target.value
                                            }
                                        )
                                    }} /><br />
                            </div>
                        </div>

                        {/* <button type="button" className="btn btn-success btn-sm" onClick={() => this.submitDataFromRoleform()}>Save</button>&nbsp; */}
                        {this.state.id !== undefined ?
                            <button className="btn btn-success btn-sm" type="button" onClick={() => {
                                this.UpdateRoleDetails(this.state);
                            }}>Save</button>
                            : <button className="btn btn-success btn-sm" type="button" onClick={() => {
                                this.submitDataFromRoleform(this.state);
                            }}>ADD</button>}&nbsp;
                <button className="btn btn-success btn-sm">Clear</button>
                        <br />
                      
                    </div>
                </form>

            </div>
        )
    }
}
export default UserRoleForm;