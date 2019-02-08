import React, { Component } from 'react';
import { Form, Label, FormGroup, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router-dom'
import { environment } from '../Environment'
import $ from 'jquery';
import { Link } from 'react-router-dom';
class AddDept extends Component {
    constructor(props) {
        super(props);

        console.log(props.match.params, 'ppp')
        this.state = {
            RedirectToDept: false,
            depId: props.match.params.depId,
            depName: "",
            description: "",
            isUpdate: false,
        }
    }
    //#region clear department fields
    clear() {

        this.setState({
            depName: "",
            description: ""
        })
    }
    //#endregion
    //#region save department details
    saveDept() {
        var result = window.formValidation("#createDepartment");
        if (result) {

        } else {
            return false;
        }

        var _this = this
        var deptList =
        {

            "depName": this.state.depName,
            "description": this.state.description,
        }
        var url = environment.apiUrl + 'department_master';
        $.ajax({
            url: url,
            type: "POST",
            data: deptList,
            success: function (result) {

                _this.setState({ RedirectToDept: true });
                toast.success("Department Saved Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });

            }

        });
    }
    //#endregion
    //#region Update department details
    getDepApi() {
        console.log('dep', this.state.depId)
        var url = environment.apiUrl + 'department_master/' + `${this.state.depId}`
        return $.ajax({
            url: url,
            type: "GET",

        })
    }
    updateDetailsApi(data) {
        var _this = this;
        var deptList =
        {
            "depName": data.depName,
            "description": data.description
        }
        return $.ajax({
            url: `http://192.168.10.109:3000/api/department_master/${data.depId}`,
            type: "PATCH",

            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",

                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(deptList),

        });
    }

    UpdateDeptDetails(data) {
        var res = this.updateDetailsApi(data);
        res.done((response) => {
            console.log('sucesss')
            this.setState({
                isUpdate: true
            })
            toast.success(" Department Updated Successfully !", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {
            console.log('error', error);
        })
    }
    componentDidMount() {

        if (this.state.depId !== undefined) {
            var res = this.getDepApi();
            res.done((response) => {
                console.log(response, 'res');
                var res = response[0];

                this.setState({
                    depName: res.depName,
                    description: res.description
                })
            });
            res.fail((error) => {

            })
        } else {

        }

    }
    //#endregion
    render() {
        if (this.state.RedirectToDept) {

            return <Redirect to={{ pathname: "/Department", state: "2" }} />
        }
        if (this.state.isUpdate == true) {
            return <Redirect to="/Department" />
        }

        return (
            <div>
                 <div className="clearfix">
                    <div className="clearfix d-flex align-items-center row page-title">
                        <h2 className="col"> Department >
                    {this.state.depId !== undefined ? <span>Edit</span> : <span>Add</span>}
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="createDepartment">
                            <div className="form-group">
                                <label for="depName">Name</label>
                                <input type="text" name="depName" className="form-control" id="depName" placeholder="Enter the Name" value={this.state.depName}
                                    onChange={(event) => {
                                        this.setState({
                                            depName: event.target.value
                                        })
                                    }} required />
                            </div>
                            <div className="form-group">
                                <label for="description">Description</label>
                                <textarea name="description" className="form-control" id="description" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} required />
                            </div>
                            <div className="form-group">
                                {this.state.depId !== undefined ?
                                    <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                                        this.UpdateDeptDetails(this.state);
                                    }}>Update</button>
                                    : <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                                        this.saveDept(this.state);
                                    }}>Save</button>}

                                <button className="btn btn-sm btn-success mr-2" onClick={() => { this.clear(); }}>Clear</button>
                                <Link to='/Department' className="btn btn-sm btn-danger mr-2">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
export default AddDept;