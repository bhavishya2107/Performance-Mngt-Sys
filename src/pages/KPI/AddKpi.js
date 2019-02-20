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
            selectScaleSetName: "",
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


    //#region 
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

    saveApiDetails() {
        var isvalidate = window.formValidation("#kpiform");
        if (isvalidate) {
            var res = this.isKpiExistsApi();
            res.done((response) => {
                if (response.length > 0) {
                    //alert("")
                    $(".recordexists").show()
                    // toast.error("KPI Already exists!", {
                    //     position: toast.POSITION.TOP_RIGHT
                    // });
                } else {
                    var _this = this;
                    var Kpidata = {
                        "KpiTitle": this.state.kpiTitle.trim(),
                        "weightage": this.state.weightage,
                        "scaleSetId": this.state.scaleSetId,
                        "target": this.state.target,
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
            $(".hide").hide()
 
            return false;
        }
    }

    getKpiDetailsApi(KpiId) {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi + '/' + `${this.state.kpiId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }

    onChangeBlur(){
        var res = this.isKpiExistsApi();
        res.done((response) => {
            if (response.length > 0) {
                //alert("")
                $(".recordexists").show()
                // toast.error("KPI Already exists!", {
                //     position: toast.POSITION.TOP_RIGHT
                // });
            } else {
                var _this = this;
                var Kpidata = {
                    "KpiTitle": this.state.kpiTitle,
                    "weightage": this.state.weightage,
                    "scaleSetId": this.state.scaleSetId,
                    "target": this.state.target,
                }
            }
        });
        res.fail(error => {
        });
    }

    // addKpi() {
    //     var kpiDataapi = {
    //         "scaleSetId": this.state.scaleSetId,
    //     }
    //     kpiData.push(kpiDataapi)
    //     this.setState({
    //         kpiDataTable: kpiData
    //     })
    //     this.$el = $(this.el);
    //     this.$el.DataTable({
    //         datasrc: kpiData,
    //         data: kpiData,
    //         columns: [
    //             {
    //                 data: "scaleSetName",
    //                 target: 0
    //             },
    //         ]
    //     })
    // }

//#region update related api

    updateDetailsApi(data) {
        var body =
        {
            "KpiTitle": data.kpiTitle.trim(),
            "target": data.target,
            "weightage": data.weightage,
            "scaleSetId": data.scaleSetId
        }
        const endpointPATCH = environment.apiUrl + moduleUrls.Kpi + '/' + `${this.state.kpiId}`
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
                    res.fail((error) => {
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

    onChangeScaleSetId(event) {
        this.setState({
            scaleSetId: event.target.value
        })
    }
    getscaleSetIdData() {
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

    componentWillMount() {
        this.getscaleSetIdData();
    }




    componentDidMount() {
        this.setState({
            title: ModuleNames.kpi
        })
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            res.done((response) => {
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target,
                    weightage: response[0].weightage,
                    scaleSetId: response[0].scalesetId
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }
    render() {
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/KPI" }} />
        }
        return (
            //#region datatable
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col">
                        {this.state.kpiId !== undefined ? <span>Edit {ModuleNames.kpi}</span> : <span>Add   {ModuleNames.kpi}</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col">
                        <form id="kpiform">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="target">KPI Title</label>
                                        <input type="text" className="form-control" rows="4" maxLength="50" name="kpiTitle" type="text" onBlur={()=>(this.onChangeBlur())} value={this.state.kpiTitle}
                                            onChange={(event) => {
                                                $(".recordexists").hide()
                                                this.setState({
                                                    kpiTitle: event.target.value
                                                })
                                            }} required />
                                        <label className="recordexists" style={{ "display": "none", "color": "red" }}>{Notification.recordExists}</label>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" htmlFor="weightage">Weight</label>
                                        <input className="form-control" name="weightage" min="1"  max="99" type="number" value={this.state.weightage}
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
                                        <select required name="scaleSetdropdown" className="form-control" onChange={(e) => { this.onChangeScaleSetId(e) }} value={this.state.scaleSetId}  >
                                            <option value="">select</option>
                                            {this.state.displayScaleSetId}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
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
                                        <Link to={{ pathname: '/KPI', }} className="btn btn-danger mr-2">Cancel</Link>
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
