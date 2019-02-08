import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
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
    clearForm() {
        this.setState({
            kpiTitle: "",
            target: "",
            weightage: ""

        })
    }
    saveApiDetails() {
        var _this = this;
        var Kpidata = {
            "KpiTitle": this.state.kpiTitle,
            "target": this.state.target,
            "scaleSetId": 5,
            "weightage": this.state.weightage,
        }
        var re = window.formValidation("#kpiform");
        if (re) {
        } else {
            return false;
        }
        $.ajax({
            url: "http://180.211.103.189:3000/api/kpi_master",
            type: "POST",
            data: Kpidata,
            success: function (resultData) {
                _this.setState({ redirectToList: true });
                toast.success("Record Added Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    getKpiDetailsApi(KpiId) {
        const endpoint = `http://180.211.103.189:3000/api/kpi_master/${this.state.kpiId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }
    onChangeScaleSetId(event) {
        this.setState({
            selectScaleSetId: event.target.value
        })
    }
    addKpi() {
        debugger;
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
        $.ajax({
            type: 'GET',
            url: 'http://180.211.103.189:3000/api/scale_set_master',
            complete: (temp) => {
                console.log(temp);
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
        var body =
        {
            "KpiTitle": data.kpiTitle,
            "target": data.target,
            "weightage": data.weightage,
            "scaleSetName": data.scaleSetName
        }
        return $.ajax({
            url: `http://180.211.103.189:3000/api/kpi_master/${this.state.kpiId}`,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateKpiDetails(data) {
        var res = this.updateDetailsApi(data);
        res.done((response) => {
            this.setState({
                redirectToList: true
            })
            toast.success("Record Updated Succesfully!", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {
        })
    }
    componentDidMount() {
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            console.log(res);
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
            <div className="row">

                {this.state.kpiId !== undefined ? <div></div> : <div></div>}
                <form id="kpiform" className="col-12">
                    <div className="form-group">
                        <label className="required" for="target">KPI Title</label>
                        <input className="form-control" rows="4" type="text" value={this.state.kpiTitle}
                            onChange={(event) => {
                                this.setState({
                                    kpiTitle: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="form-group">
                        <label className="required" for="target">Target</label>
                        <textarea className="form-control" rows="4" type="text" value={this.state.target}
                            onChange={(event) => {
                                this.setState({
                                    target: event.target.value
                                })
                            }} required></textarea>
                    </div>
                    <div className="form-group">
                        <label className="required" for="weightage">Weight</label>
                        <input className="form-control" rows="4" type="text" value={this.state.weightage}
                            onChange={(event) => {
                                this.setState({
                                    weightage: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="dropdown">
                        <br /><br />
                        <label className="mr-2">Scale Set</label>
                        <select onChange={(e) => { this.onChangeScaleSetId(e) }} required className="btn btn-info dropdown-toggle md mr-3">
                            <option>select</option>
                            {this.state.displayScaleSetId}
                        </select>
                    </div>
                    <br />
                    {this.state.kpiId !== undefined ?
                        <button type="button" class="btn btn-success mr-2" onClick={() => {
                            this.UpdateKpiDetails(this.state);
                        }}>Update</button>
                        : <button type="button" className="btn btn-success mr-2" value="submit" onClick={() => {
                            this.saveApiDetails(this.state);
                        }}>Save</button>}

                    <button type="clear" className="btn btn-primary mr-3" onClick={() => {
                        this.clearForm()
                    }}>Clear</button>
                    <Link to={{ pathname: '/KPI', }} className="btn btn-danger mr-2">Cancel</Link>

                </form>
            </div>
        );
    }
}
export default AddKpi;
