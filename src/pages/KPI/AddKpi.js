import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { environment, moduleUrls, Type, Notification } from '../Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
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
            redirectToList: false
        }
    }

    //#region Clear form details function
    clearForm() {
        this.setState({
            kpiTitle: "",
            target: "",
            weightage: ""

        })
    }
    //#endregion
    isKpiExistsApi() {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi +'?_where=(kpiTitle,eq,' + this.state.kpiTitle + ')';
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
                    // toast.error("KPI Already exists!", {
                    //     position: toast.POSITION.TOP_RIGHT
                    // });
                } else {
                    var _this = this;
                    var Kpidata = {
                        "KpiTitle": this.state.kpiTitle,
                        "target": this.state.target,
                        "scaleSetId": 5,
                        "weightage": this.state.weightage,
                    }
                    const endpointPOST = environment.apiUrl + moduleUrls.Kpi+'/'
                    $.ajax({
                        url: endpointPOST,
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
            return false;
        }
    }

    getKpiDetailsApi(KpiId) {
        const endpointGET = environment.apiUrl + moduleUrls.Kpi+'/' + `${this.state.kpiId}`
        return $.ajax({
            url: endpointGET,
            type: Type.get,
        })
    }
    onChangeScaleSetId(event) {
        this.setState({
            selectScaleSetId: event.target.value
        })
    }
    addKpi() {
        var kpiDataapi = {
            "scaleSetId": this.state.scaleSetId,
        }
        kpiData.push(kpiDataapi)
        this.setState({
            kpiDataTable: kpiData
        })
        this.$el = $(this.el);
        this.$el.DataTable({
            datasrc: kpiData,
            data: kpiData,
            columns: [
                {
                    data: "scaleSetName",
                    target: 0
                },
            ]
        })
    }

    getscaleSetIdData() {
        const endpointGET = environment.apiUrl + moduleUrls.ScaleSet+'/'
        $.ajax({
            type: Type.get,
            url: endpointGET,
            complete: (temp) => {
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option value={i.scaleSetId}>{i.scaleSetId}</option> ,
                        <option value={i.scaleSetName}>{i.scaleSetName}</option>
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
    
    updateDetailsApi(data) {
        const endpointPATCH = environment.apiUrl + moduleUrls.Kpi+'/' + `${this.state.kpiId}`
        var body =
        {
            "KpiTitle": data.kpiTitle,
            "target": data.target,
            "weightage": data.weightage,
            "scaleSetName": data.scaleSetName
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
            var res = this.updateDetailsApi(data);
            res.done((response) => {
                this.setState({
                    redirectToList: true
                })
                toast.success("KPI " + Notification.updated, {
                    position: toast.POSITION.TOP_RIGHT
                });
            });
            res.fail((error) => {
            })
        } else {

            return false;
        }
    }
    componentDidMount() {
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
        if (this.state.redirectToList == true) {
            return <Redirect to={{ pathname: "/KPI" }} />
        }
        return (
            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> KPI >
                    {this.state.kpiId !== undefined ? <span>Edit</span> : <span>Add</span>}
                    </h2>
                </div>
                <div className="row">
                    <div className="col">
                        <form id="kpiform">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" for="target">KPI Title</label>
                                        <input className="form-control" rows="4" type="text" value={this.state.kpiTitle}
                                            onChange={(event) => {
                                                this.setState({
                                                    kpiTitle: event.target.value
                                                })
                                            }} required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="required" for="weightage">Weight</label>
                                        <input className="form-control" rows="4" type="text" value={this.state.weightage}
                                            onChange={(event) => {
                                                this.setState({
                                                    weightage: event.target.value
                                                })
                                            }} required />
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label className="mr-2">Scale Set</label>
                                        <select onChange={(e) => { this.onChangeScaleSetId(e) }} required className="form-control">
                                            <option>select</option>
                                            {this.state.displayScaleSetId}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-group">
                                        <label className="required" for="target">Target</label>
                                        <textarea className="form-control" rows="4" type="text" value={this.state.target}
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
                                            <button type="button" class="btn btn-success mr-2" onClick={() => {
                                                this.UpdateKpiDetails(this.state);
                                            }}>Update</button>
                                            : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {
                                                this.saveApiDetails(this.state);
                                            }}>Save</button>}
                                        <button type="clear" className="btn btn-info mr-2" onClick={() => {
                                            this.clearForm()
                                        }}>Clear</button>
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
    }
}
export default AddKpi;
