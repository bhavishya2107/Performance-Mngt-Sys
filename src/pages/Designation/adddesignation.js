import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Notification, moduleUrls, Type, ModuleNames } from '../Environment'
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
class Designation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            designationName: "",
            description: "",
            redirectToList: false,
            title: ""
        }
    }
    //#region onClick Add function
    isDesignationExistsApi() {
        const isJobtitleExistsApiUrl = environment.apiUrl + moduleUrls.Designation + '?_where=(designationName,eq,' + this.state.designationName.trim() + ')';
        return $.ajax({
            url: isJobtitleExistsApiUrl,
            type: Type.get,
            data: ''
        });
    }
    isDesignationExistsUpdateApi() {
        const isJobtitleExistsApiUrl = environment.apiUrl + moduleUrls.Designation + '?_where=(designationName,eq,' + this.state.designationName.trim() + ')' + '~and(designationId,ne,' + this.state.id + ')';
        return $.ajax({
            url: isJobtitleExistsApiUrl,
            type: Type.get,
            data: ''
        });
    }
    savedesignation() {
        $(".recordexists").hide()
        var isvalidate = window.formValidation("#formjobtitle");

        if (isvalidate) {

            var res = this.isDesignationExistsApi();
            res.done((response) => {
                if (response.length > 0) {

                    $(".recordexists").show()

                } else {
                    var _this = this;
                    var formData = {
                        "designationName": this.state.designationName.trim(),
                        "description": this.state.description,
                        "createdBy": localStorage.getItem('userId')

                    }
                    const savejobtitleUrl = environment.apiUrl + moduleUrls.Designation + '/'
                    $.ajax({
                        url: savejobtitleUrl,
                        type: Type.post,
                        data: formData,
                        success: function (resultData) {
                            _this.setState({ redirectToList: true });
                            toast.success("Designation " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            }); res.fail(error => {

            });

        } else {

            return false;
        }

    }
    //#endregion
    resetform() {
        window.location.reload();
    }
    getdesignationDetilsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Designation + '/' + `${this.state.id}`

        return $.ajax({
            url: endpointGET,
            type: "GET",

        })
    }
    updateDetailsApi(data) {

        var body =
        {
            "designationName": data.designationName.trim(),
            "description": data.description,
            "modifiedBy": localStorage.getItem('userId')

        }

        const endpointPOST = environment.apiUrl + moduleUrls.Designation + '/' + `${data.id}`
        return $.ajax({
            url: endpointPOST,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"

            },
            data: JSON.stringify(body)
        });
    }
    UpdatedesignationDetails(data) {

        var isvalidate = window.formValidation("#formjobtitle");
        if (isvalidate) {
            var res = this.isDesignationExistsUpdateApi()
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()

                } else {

                    var res = this.updateDetailsApi(data);
                    res.done((result) => {
                        this.setState({
                            redirectToList: true
                        })
                        toast.success("Designation " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    });
                    res.fail((error) => {
                        console.log(error)
                    })
                }
            });
            res.fail((error) => {
                console.log(error)
            })
        } else {
            $(".recordexists").hide()
            return false;
        }

    }
    onblurRowExists() {
        if (this.state.id != undefined) {
            var res = this.isDesignationExistsUpdateApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()

                } else {
                }
            }
            )
        }

        else {
            var res = this.isDesignationExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            })
        }
    }
    componentDidMount() {
        this.setState({
            title: ModuleNames.Jobtitle
        })
        if (this.state.id !== undefined) {
            var res = this.getdesignationDetilsApi();
            res.done((response) => {

                this.setState({
                    designationName: response[0].designationName,
                    description: response[0].description
                })
            });
            res.fail((error) => {

            })
        } else {
        }
    }

    render() {
        if (this.state.redirectToList === true) {

            return <Redirect to={{ pathname: "/designation" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.id !== undefined ? <span>Edit Designation</span> : <span>Add New Designation</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="formjobtitle">
                            <div className="form-group">
                                <label className="required">Name</label>
                                <input type="text" id="designationid" name="designationname" onBlur={() => { this.onblurRowExists() }} minLength="" maxLength="50" className="form-control" value={this.state.designationName}
                                    onChange={(event) => {
                                        $(".recordexists").hide()
                                        this.setState({
                                            designationName: event.target.value
                                        })
                                    }} required />

                                <label className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea name="designationaddress" className="form-control" rows="4" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} ></textarea>
                            </div>
                            <div className="form-group">
                                {this.state.id !== undefined ?
                                    <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.UpdatedesignationDetails(this.state);
                                    }}>Update</button>
                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.savedesignation(this.state);
                                    }}>Save</button>}

                                <button type="button" className="btn btn-info mr-2" onClick={() => {
                                    this.resetform(this.state)
                                }}>Reset</button>
                                <Link to="/designation" className="btn btn-danger ">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer></ToastContainer>
            </div>
        )
    }
}
export default Designation;