import React, { Component } from 'react';
import { Form, Label, FormGroup, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router-dom'
import { environment, moduleUrls, Type, Notification } from '../Environment'
import $ from 'jquery';
import { Link } from 'react-router-dom';
class AddDept extends Component {
    constructor(props) {
        super(props);

        console.log(props.match.params, 'ppp')
        this.state = {
            RedirectToDept: false,
            isUpdate: false,
            departmentId: props.match.params.departmentId,
            departmentName: "",
            description: "",

        }
    }
    //#region clear department fields
    reset() {
        window.location.reload();
    }
    //#endregion

    //#region check whether the record is exist or not
    isDeptExistApi() {
        var DeptExist = environment.apiUrl + moduleUrls.Department + '?_where=(departmentName,eq,' + this.state.departmentName.trim() + ')'
        return $.ajax({
            url: DeptExist,
            type: Type.get
        })
    }
    //#endregion


    //#region onblur function
    isExistOnChange(data) {
        var result = []
        if (this.state !== undefined) { //add 
            var res = this.isDeptExistApi(); // get api call
            res.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show()   //check record exist or not
                }
                else {

                }

            });

            res.fail((error) => {
            })
        }
        else {
            var res = this.isDeptExistUpdateApi();

            res.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show()
                }
            })
        }
    }
    ////#endregion
    //#region save department details  
    saveDept() {
        var result = window.formValidation("#createDepartment");
        if (result) {
            var existApiResponse = this.isDeptExistApi();

            existApiResponse.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show();
                }
                else {
                    var _this = this
                    var deptList =
                    {

                        "departmentName": this.state.departmentName.trim(),
                        "description": this.state.description,
                    }
                    var saveDeptApiUrl = environment.apiUrl + moduleUrls.Department;
                    $.ajax({
                        url: saveDeptApiUrl,
                        type: Type.post,
                        data: deptList,
                        success: function (result) {

                            _this.setState({ RedirectToDept: true });
                            toast.success("Department " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            })
        }
    }
    //#endregion
    //#region Update department details

    getDepApi() {

        var getDept = environment.apiUrl + moduleUrls.Department + '/' + `${this.state.departmentId}`;
        return $.ajax({
            url: getDept,
            type: Type.get,

        })
    }
    updateDetailsApi(data) {
        var updateDeptDetails = environment.apiUrl + moduleUrls.Department + '/' + `${data.departmentId}`
        var _this = this;
        var deptList =
        {
            "departmentName": data.departmentName.trim(),
            "description": data.description
        }
        return $.ajax({
            url: updateDeptDetails,
            type: Type.patch,

            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",

                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(deptList),

        });
    }
    isDeptExistUpdateApi() {
        var deptExistOnUpdate = environment.apiUrl + moduleUrls.Department + '/' + '?_where=(departmentName,eq,' + this.state.departmentName.trim() + ')' + '~and(departmentId,ne,' + this.state.departmentId + ')'
        return $.ajax({
            url: deptExistOnUpdate,
            type: Type.get
        })
    }

    UpdateDeptDetails(data) {
        var result = window.formValidation("#createDepartment");
        if (result) {
            var res = this.isDeptExistUpdateApi();

            res.done((response) => {
                if (response.length > 0) {
                    $(".dataExist").show()
                }
                else {
                    var res = this.updateDetailsApi(data);
                    res.done(() => {
                        this.setState({
                            isUpdate: true

                        })
                        toast.success("Department " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    });
                    res.fail((error) => {

                    })

                }
            });

            res.fail((error) => {
            })
        }
        else {
            return false;
        }
    }
    componentDidMount() {
        if (this.state.departmentId !== undefined) {
            var res = this.getDepApi();
            res.done((response) => {
                var res = response[0];
                this.setState({
                    departmentName: res.departmentName,
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
                        <h2 className="col">
                            {this.state.departmentId !== undefined ? <span>Edit Department</span> : <span>Add Department</span>}
                        </h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="createDepartment">
                            <div className="form-group">
                                <label htmlFor="depName" className="required">Name</label>
                                <input type="text" name="depName" className="form-control" maxLength="50" id="depName" value={this.state.departmentName}
                                    onBlur={() => { this.isExistOnChange(); }}
                                    onChange={(event) => {
                                        $(".dataExist").hide()
                                        this.setState({
                                            departmentName: event.target.value
                                        })
                                    }} required />
                                <p className="dataExist" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</p>


                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <textarea name="description" className="form-control" id="description" maxLength="100" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} />
                            </div>
                            <div className="form-group">
                                {this.state.departmentId !== undefined ?
                                    <button type="button" className="btn  btn-success mr-2" onClick={() => {
                                        this.UpdateDeptDetails(this.state);
                                    }}>Update</button>
                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.saveDept(this.state);
                                    }}>Save</button>}

                                <button type="button" value="reset" className="btn  btn-info mr-2" onClick={() => { this.reset(); }}>Reset</button>
                                <Link to='/Department' className="btn btn-danger mr-2">Cancel</Link>
                            </div>
                        </form>
                    </div>
                    <ToastContainer />
                </div>
            </div>

        )
    }
}
export default AddDept;