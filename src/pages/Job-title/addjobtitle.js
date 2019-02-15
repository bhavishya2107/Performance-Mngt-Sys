import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, Notification, moduleUrls, Type, ModuleNames } from '../Environment'
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
class Jobtitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            jobtitleName: "",
            description: "",
            redirectToList: false,
            title: ""
        }
    }
    //#region onClick Add function
    isJobtitleExistsApi() {
        const isJobtitleExistsApiUrl = environment.apiUrl + moduleUrls.Jobtitle + '?_where=(jobtitleName,eq,' + this.state.jobtitleName + ')';
        return $.ajax({
            url: isJobtitleExistsApiUrl,
            type: Type.get,
            data: ''
        });
    }
    isJobtitleExistsUpdateApi() {
        const isJobtitleExistsApiUrl = environment.apiUrl + moduleUrls.Jobtitle + '?_where=(jobtitleName,eq,' + this.state.jobtitleName + ')' + '~and(jobtitleId,ne,' + this.state.id + ')';
        return $.ajax({
            url: isJobtitleExistsApiUrl,
            type: Type.get,
            data: ''
        });
    }
    savejobtitle() {
        $(".recordexists").hide()
        var isvalidate = window.formValidation("#formjobtitle");
        if (isvalidate) {
            var res = this.isJobtitleExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    
                    $(".recordexists").show()

                } else {
                    var _this = this;

                    var formData = {
                        "jobtitleName": this.state.jobtitleName,
                        "description": this.state.description
                    }
                    const savejobtitleUrl = environment.apiUrl + moduleUrls.Jobtitle + '/'
                    $.ajax({
                        url: savejobtitleUrl,
                        type: Type.post,
                        data: formData,
                        success: function (resultData) {
                            _this.setState({ redirectToList: true });
                            toast.success("Job Title " + Notification.saved, {
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
    getjobtitleDetilsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Jobtitle + '/' + `${this.state.id}`

        return $.ajax({
            url: endpointGET,
            type: "GET",

        })
    }
    updateDetailsApi(data) {

        var body =
        {
            "jobtitleName": data.jobtitleName,
            "description": data.description

        }

        const endpointPOST = environment.apiUrl + moduleUrls.Jobtitle + '/' + `${data.id}`
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
    UpdatejobtitleDetails(data) {
        
        var isvalidate = window.formValidation("#formjobtitle");
        if (isvalidate) {
            var res = this.isJobtitleExistsUpdateApi()
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()

                } else {

                    var res = this.updateDetailsApi(data);
                    res.done((result) => {
                        this.setState({
                            redirectToList: true
                        })
                        toast.success("Job Title " + Notification.updated, {
                            position: toast.POSITION.TOP_RIGHT
                        });
                    });
                    res.fail((error) => {
                        console.log(error)
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
    componentDidMount() {
        this.setState({
            title: ModuleNames.Jobtitle
        })
        if (this.state.id !== undefined) {
            var res = this.getjobtitleDetilsApi();
            res.done((response) => {

                this.setState({
                    jobtitleName: response[0].jobtitleName,
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

            return <Redirect to={{ pathname: "/job-title" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.id !== undefined ? <span>Edit Job Title</span> : <span>Add Job Title</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="formjobtitle">
                            <div className="form-group">
                                <label className="required">Name</label>
                                <input type="text" id="jobtitleid" name="jobtitlename" minLength="" maxLength="50" className="form-control" value={this.state.jobtitleName}
                                    onChange={(event) => {
                                        $(".recordexists").hide()
                                        this.setState({
                                            jobtitleName: event.target.value
                                        })
                                    }} required />
                                    
                                <label className="recordexists" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</label>
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea name="jobtitleaddress" className="form-control" rows="4" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value
                                        })
                                    }} ></textarea>
                            </div>
                            <div className="form-group">
                                {this.state.id !== undefined ?
                                    <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.UpdatejobtitleDetails(this.state);
                                    }}>Update</button>
                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.savejobtitle(this.state);
                                    }}>Save</button>}

                                <button type="button" className="btn btn-info mr-2" onClick={() => {
                                    this.resetform(this.state)
                                }}>Reset</button>
                                <Link to="/job-title" className="btn btn-danger ">Cancel</Link>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer></ToastContainer>
            </div>
        )
    }
}
export default Jobtitle;