import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
//var scalesetData = []
class Scaleset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            scaleSetName: "",
            description: "",
            redirectToList: false,
            title: ""
        }
    }

    //#region Onclick function for Add
    isScalesetExistsApi() {
        const scalesetExistsGET = environment.apiUrl + moduleUrls.ScaleSet + '?_where=(scaleSetName,eq,' + this.state.scaleSetName + ')';
        return $.ajax({
            url: scalesetExistsGET,
            type: Type.get,
            data: ''
        });
    }
    isScalesetExistsUpdateApi() {
        const scalesetExistsGET = environment.apiUrl + moduleUrls.ScaleSet + '?_where=(scaleSetName,eq,' + this.state.scaleSetName + ')' + '~and(scaleSetId,ne,' + this.state.id + ')';
        return $.ajax({
            url: scalesetExistsGET,
            type: Type.get,
            data: ''
        });
    }

    savescaleset() {
        var isvalidate = window.formValidation("#formscaleset1");
        if (isvalidate) {
            var res = this.isScalesetExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    //alert("")
                    $(".recordexists").show()

                } else {
                    var _this = this;
                    var formData = {
                        "scaleSetName": this.state.scaleSetName,
                        "description": this.state.description
                    }
                    const saveScalesetUrl = environment.apiUrl + moduleUrls.ScaleSet + '/'
                    $.ajax({
                        url: saveScalesetUrl,
                        type: Type.post,
                        data: formData,
                        success: function (resultData) {

                            _this.setState({ redirectToList: true });
                            toast.success("Scaleset " + Notification.saved, {
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
    //#endregion

    //#region Reset function onclick
    resetform() {

        window.location.reload();
    }
    //#endregion

    getscalesetDetilsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.ScaleSet + '/' + `${this.state.id}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,

        })
    }
    //#region  update Api function and ajax call
    updateDetailsApi(data) {
        var body =
        {
            "scaleSetName": data.scaleSetName,
            "description": data.description,
        }
        const endpointPOST = environment.apiUrl + moduleUrls.ScaleSet + '/' + `${data.id}`
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
    UpdatescalesetDetails(data) {
        var isvalidate = window.formValidation("#formscaleset1");
        if (isvalidate) {

            var res = this.isScalesetExistsUpdateApi();
            res.done((response) => {
                debugger;
                if (response.length > 0) {
                    $(".recordexists").show()

                } else {
                    var res = this.updateDetailsApi(data);

                    res.done((result) => {
                        this.setState({
                            redirectToList: true,

                        })
                        toast.success("Scaleset " + Notification.updated, {
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
    //#endregion


    componentDidMount() {
        this.setState({
            title: ModuleNames.ScaleSet
        })
        if (this.state.id !== undefined) {
            var res = this.getscalesetDetilsApi();
            res.done((response) => {

                this.setState({
                    scaleSetName: response[0].scaleSetName,
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

            return <Redirect to={{ pathname: "/scale-set" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.id !== undefined ? <span>Edit Scale Set</span> : <span>Add Scale Set</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form id="formscaleset1" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label className="required">Name</label>
                                <input type="text" id="scalesetid" name="scalesetname" maxLength="50" className="form-control" value={this.state.scaleSetName}
                                    onChange={(event) => {
                                        $(".recordexists").hide()
                                        this.setState({
                                            scaleSetName: event.target.value
                                        })
                                    }} required />

                                <label className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
                            </div>
                            <div className="form-group">
                                <label>Description</label> <textarea id="scalesetid" name="scalesetaddress" className="form-control" rows="4" value={this.state.description}
                                    onChange={(event) => {
                                        this.setState({
                                            description: event.target.value,
                                        })
                                    }} ></textarea>
                            </div>
                            <div className="form-group">
                                {this.state.id !== undefined ?
                                    <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.UpdatescalesetDetails(this.state);
                                    }}>Update</button>

                                    : <button type="button" className="btn btn-success mr-2" onClick={() => {
                                        this.savescaleset(this.state);
                                    }}>Save</button>}

                                <button type="button" className="btn btn-info mr-2" onClick={() => {
                                    this.resetform()
                                }}>Reset</button>

                                <Link to="/scale-set" className="btn btn-danger ">Cancel</Link>

                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer></ToastContainer>
            </div>
        )
    }
}
export default Scaleset;