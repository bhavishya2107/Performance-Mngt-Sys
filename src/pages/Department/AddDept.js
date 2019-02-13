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
            depId: props.match.params.depId,
            depName: "",
            description: "",

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

    //#region check whether the record is exist or not
    isDeptExistApi() {
        var url = environment.apiUrl + moduleUrls.Department + '?_where=(depName,eq,' + this.state.depName + ')'
        return $.ajax({
            url: url,
            type: Type.get
        })
    }
    //#endregion
    //#region sort the list 

    //#endregion
    //#region save department details
    saveDept() {
        var result = window.formValidation("#createDepartment");
        if (result) {
            var existApiResponse = this.isDeptExistApi();

            existApiResponse.done((response) => {
           //     alert(response.length)
                if (response.length > 0) {
                    //alert('if')
                    // alert("already exists")
                    $(".dataExist").show();
                }
                else {
                  //  alert('else')
                    var _this = this
                    var deptList =
                    {

                        "depName": this.state.depName,
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
        var url = environment.apiUrl + moduleUrls.Department;
        return $.ajax({
            url: url,
            type: Type.get,

        })
    }
    updateDetailsApi(data) {
        var url = environment.apiUrl + moduleUrls.Department + '/' + `${data.depId}`
        var _this = this;
        var deptList =
        {
            "depName": data.depName,
            "description": data.description
        }
        return $.ajax({
            url: url,
            type: Type.patch,

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
            this.setState({
                isUpdate: true
            })
            toast.success(" Department " + Notification.updated, {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {
            // console.log('error', error);
        })
    }
    componentDidMount() {

        if (this.state.depId !== undefined) {
            var res = this.getDepApi();
            res.done((response) => {
                // console.log(response, 'res');
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
                                <label htmlFor="depName" className="required">Name</label>
                                <input type="text" name="depName" className="form-control" id="depName" placeholder="Enter the Name" value={this.state.depName}
                                    onChange={(event) => {
                                        this.setState({
                                            depName: event.target.value
                                        })
                                    }} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description</label>
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
                    <ToastContainer />
                </div>
            </div>

        )
    }
}
export default AddDept;