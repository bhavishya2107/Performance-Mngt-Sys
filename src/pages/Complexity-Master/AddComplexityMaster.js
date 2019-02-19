import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { environment, moduleUrls, Type, Notification } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');

class AddComplexityMaster extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complexityId: props.match.params.id,
            complexityName: "",
            description: "",
            redirectToList: false
        };
    }
    resetForm() {
        window.location.reload();
    }
    //#region  save ComplexityMaster details
    isComplexityMasterExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.ComplexityMaster + '?_where=(complexityName,eq,'
            + this.state.complexityName.trim() + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    isEditComplexityMasterExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.ComplexityMaster + '?_where=(complexityName,eq,'
            + this.state.complexityName.trim() + ')' + '~and(complexityId,ne,' + this.state.complexityId + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    onchangeBlur() {
        var res = this.isComplexityMasterExistsApi();
        res.done((response) => {
            if (response.length > 0) {
                $(".recordexists").show()
            } else {
                var _this = this;
                var ComplexityMasterdata = {
                    "complexityName": this.state.complexityName,
                    "description": this.state.description,
                }
            }
        });
        res.fail(error => {
        });
    }


    saveComplexityMasterDetails() {
        var isvalidate = window.formValidation("#ComplexityMasterForm");
        if (isvalidate) {
            var res = this.isComplexityMasterExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var _this = this;
                    var ComplexityMasterdata = {
                        "complexityName": this.state.complexityName.trim(),
                        "description": this.state.description,
                    }
                    const endpointPOST = environment.apiUrl + moduleUrls.ComplexityMaster + '/'
                    $.ajax({
                        url: endpointPOST,
                        type: Type.post,
                        data: ComplexityMasterdata,
                        success: function (resultData) {
                            _this.setState({ redirectToList: true });
                            toast.success("Complexity " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            });
            res.fail(error => {
            });
        } else {
            return false;
        }
    }




    getComplexityMasterDeatilsApi(complexityId) {
        const endpointGET = environment.apiUrl + moduleUrls.ComplexityMaster + '/' + `${this.state.complexityId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }
    //#endregion


    //#region update fucntionality details
    updateDetailsApi(data) {
        const endpointPATCH = environment.apiUrl + moduleUrls.ComplexityMaster + '/' + `${this.state.complexityId}`
        var body =
        {
            "complexityName": data.complexityName.trim(),
            "description": data.description,
        }
        return $.ajax({
            url: endpointPATCH,
            type: Type.patch,
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateComplexityMasterDetails(data) {
        var isvalidate = window.formValidation("#ComplexityMasterForm");
        if (isvalidate) {
            var res = this.isEditComplexityMasterExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var res = this.updateDetailsApi(data);
                    res.done(() => {
                        this.setState({
                            redirectToList: true
                        })
                        toast.success("Complexity " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    })

                }
            });
            res.fail((error) => {
            })
        } else {
            $(".recordexists").hide()

            return false;
        }
    }
    //#endregion

    componentDidMount() {
        if (this.state.complexityId !== undefined) {
            var res = this.getComplexityMasterDeatilsApi();
            res.done((response) => {
                this.setState({
                    complexityName: response[0].complexityName,
                    description: response[0].description
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }

    render() {
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/complexity-master" }} />
        }
        return (
            //#region form of complexity master
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.complexityId !== undefined ? <span>Edit Complexity Master</span> : <span>Add Complexity Master</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="ComplexityMasterForm">
                            <div className="form-group">
                                <label className="required">Project Name</label>
                                <input type="text" id="complexityName" className="form-control" maxLength="50" onBlur={() => { this.onchangeBlur() }} name="complexityName" value={this.state.complexityName}
                                    onChange={(event) => {
                                        $(".recordexists").hide()
                                        this.setState({
                                            complexityName: event.target.value
                                        })
                                    }} required />
                                <label className="recordexists" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</label>
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea id="kpiId" className="form-control" name="description" rows="4" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} ></textarea>
                            </div>
                            <div className="form-group">
                                {this.state.complexityId !== undefined ?
                                    <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.UpdateComplexityMasterDetails(this.state);
                                    }}>Update</button>

                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.saveComplexityMasterDetails(this.state);
                                    }}>Save</button>}
                                <button type="button" className="btn btn-info mr-2" value="submit" onClick={() => {
                                    this.resetForm(this.state);
                                }}>Reset</button>
                                {/* <button type="clear" className="btn btn-info mr-2" >Reset</button> */}
                                <Link to="/complexity-master" className="btn btn-danger ">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
            //#endregion 
        );
    }
}
export default AddComplexityMaster;
