import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { environment, Type, moduleUrls, Notification, ModuleNames } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

var kpiData = []

class AddKpi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            kpiId: props.match.params.id,
            displayScaleSetName: "",
            displayScaleSetId: "",
            selectScaleSetId: "",
            kpiTitle: "",
            target: "",
            weightage: "",
            scaleSetId: "",
            scaleSetName: "",
            redirectToList: false
        }
    }

    //#region Clear form details function
    resetForm() {
        window.location.reload();
    }
    //#endregion

    //#region to check kpi exist or not
    isKpiExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi + '?_where=(kpiTitle,eq,' + this.state.kpiTitle.trim() + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    isEditKpiExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi + '?_where=(kpiTitle,eq,' + this.state.kpiTitle.trim() + ')' + '~and(kpiId,ne,' + this.state.kpiId + ')';
        return $.ajax({
            url: endpointGET,
            type: Type.get,
            data: ''
        });
    }
    //#endregion

    //#region save Kpi details
    saveApiDetails() {
        var isvalidate = window.formValidation("#kpiform");
        if (isvalidate) {
            var res = this.isKpiExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var _this = this;
                    var Kpidata = {
                        "KpiTitle": this.state.kpiTitle.trim(),
                        "weightage": this.state.weightage,
                        "scaleSetId": this.state.scaleSetId,
                        "target": this.state.target,
                        "createdBy": localStorage.getItem('userId')

                    }
                    const saveKpiUrl = environment.apiUrl + moduleUrls.Kpi + '/'
                    $.ajax({
                        url: saveKpiUrl,
                        type: Type.post,
                        data: Kpidata,
                        success: function (resultData) {
                            _this.setState({ redirectToList: true });
                            toast.success("KPI " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            });
            res.fail(error => {
            });
        }
        else {
            $(".recordexists").hide()
            return false;
        }
    }
    //#endregion

    getKpiDetailsApi(KpiId) {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi + '/' + `${this.state.kpiId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }

    onChangeBlur() {
        if (this.state.kpiId !== undefined) {
            var res = this.isEditKpiExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                }
            }
            )
        }
        else {
            var res = this.isKpiExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                }
            })
        }
    }

    //#region update related api

    updateDetailsApi(updateData) {
        const endpointPATCH = environment.apiUrl + moduleUrls.Kpi + '/' + `${this.state.kpiId}`
        var body =
        {
            "KpiTitle": updateData.kpiTitle.trim(),
            "target": updateData.target,
            "weightage": updateData.weightage,
            "scaleSetId": updateData.scaleSetId,
            "modifiedBy": localStorage.getItem('userId')
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

    UpdateKpiDetails(data) {
        var isvalidate = window.formValidation("#kpiform");
        if (isvalidate) {
            var res = this.isEditKpiExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    $(".recordexists").show()
                } else {
                    var res = this.updateDetailsApi(data);
                    res.done(() => {
                        this.setState({
                            redirectToList: true
                        })
                        toast.success("KPI " + Notification.updated, {
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

    //#region on change for scaleSet
    onChangeScaleSetMaster(event) {
        this.setState({
            scaleSetId: event.target.value,
        })
    }

    getScaleSetData() {
        const endpointGET = environment.apiUrl + moduleUrls.ScaleSet + '/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option key={i.scaleSetId} value={i.scaleSetId}>{i.scaleSetName}</option>
                    )
                });
                this.setState({
                    displayScaleSetId: displayDataReturn
                })
            },
        });
    }
    //#endregion

    componentDidMount() {
        this.setState({
            title: ModuleNames.kpi
        })
        this.getScaleSetData();
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            res.done((response) => {
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target,
                    weightage: response[0].weightage,
                    scaleSetId: response[0].scaleSetId
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }

    render() {
        if (this.state.redirectToList === true) {
            return <Redirect to={{ pathname: "/kpi" }} />
        }
        return (
            //#region datatable
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.kpiId !== undefined ? <span>Edit {ModuleNames.kpi}</span> : <span>Add New {ModuleNames.kpi}</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col">
                        <form id="kpiform">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required">KPI Title</label>
                                        <input type="text" id="kpititle" name="kpititle" onBlur={() => { this.onChangeBlur() }} maxLength="50" className="form-control" value={this.state.kpiTitle}
                                            onChange={(event) => {
                                                $(".recordexists").hide()
                                                this.setState({
                                                    kpiTitle: event.target.value
                                                })
                                            }} required />
                                        <label className="recordexists" style={{ "display": "none", "color": "#dc3545" }}>{Notification.recordExists}</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="weightage">Weight</label>
                                        <input className="form-control" name="weightage" min="1" max="99" type="number" value={this.state.weightage}
                                            onChange={(event) => {
                                                this.setState({
                                                    weightage: event.target.value
                                                })
                                            }} required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label>Scale Set</label>
                                        <select required name="scalesetdropdown" className="form-control" htmlFor="scaleSetId"
                                            onChange={(e) => {
                                                this.onChangeScaleSetMaster(e)
                                            }} value={this.state.scaleSetId}  >
                                            <option value="">select</option>
                                            {this.state.displayScaleSetId}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="required" htmlFor="target">Target</label>
                                        <textarea className="form-control" rows="4" name="target" type="text" value={this.state.target}
                                            onChange={(event) => {
                                                this.setState({
                                                    target: event.target.value
                                                })
                                            }} required></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        {this.state.kpiId !== undefined ?
                                            <button type="button" className="btn btn-success mr-2" onClick={() => {
                                                this.UpdateKpiDetails(this.state);
                                            }}>Update</button>
                                            : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {
                                                this.saveApiDetails(this.state);
                                            }}>Save</button>}
                                        <button type="button" className="btn btn-info mr-2" onClick={() => {
                                            this.resetForm();
                                        }}>Reset</button>
                                        {/* <button type="clear" className="btn btn-info mr-2" >Reset</button> */}
                                        <Link to={{ pathname: '/kpi', }} className="btn btn-danger mr-2">Cancel</Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <ToastContainer />
            </div>
        );
        //#endregion
    }
}
export default AddKpi;
