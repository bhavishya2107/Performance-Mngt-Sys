import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
var kpiData = []

const $ = require('jquery');

class AddKpi extends Component {

    constructor(props) {
        debugger;
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
            scaleSetName:"",
            redirectToList: false
        }
    }

    saveApiDetails() {
        var _this = this;
        var Kpidata = {
            "KpiTitle": this.state.kpiTitle,
            "target": this.state.target,
            "scaleSetId": 5,
            "weightage": this.state.weightage,
            "scaleSetName": this.state.scaleSetName,
            "scaleSetId": this.state.scaleSetId,
        }
        // var re = window.formValidation("#kpiform");
        // if (re) {
        //     alert("Success")
        // } else {

        //     return false;
        // }
        $.ajax({
            url: "http://192.168.10.109:3000/api/kpi_master",
            type: "POST",
            data: Kpidata,
            success: function (resultData) {
                alert("Save Complete");
                _this.setState({ redirectToList: true });
                toast.success("Success Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    SaveData() {

    }
    getKpiDetailsApi(KpiId) {
        const endpoint = `http://192.168.10.109:3000/api/kpi_master/${this.state.kpiId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }

    onChangeScaleSetName(event) {
        debugger;
        this.setState({
            selectScaleSetName: event.target.value
        })
    }
    onChangeScaleSetId(event) {
        debugger;
        this.setState({
            selectScaleSetId: event.target.value
        })
    }
    addKpi() {
        debugger;
        var kpiDataapi = {
            "scaleSetId": this.state.scaleSetId,
            "scaleSetName": this.state.selectScaleSetName,
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
                    data: "scaleSetId",
                    target: 0
                },
                {
                    data: "scaleSetName",
                    target: 1
                }
            ]
        })
    }



   
    getscaleSetIdData() {
        $.ajax({
            type: 'GET',
            url: 'http://192.168.10.109:3000/api/scale_set_master',
            complete: (temp) => {
                console.log(temp);
                var temp = temp.responseJSON;
                var displayDataReturn = temp.map((i) => {
                    return (
                        <option value={i.scaleSetId}>{i.scaleSetId}</option>,
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
        debugger;
        return $.ajax({
            url: `http://192.168.10.109:3000/api/kpi_master/${this.state.kpiId}`,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateKpiDetails(data) {
        debugger;
        var res = this.updateDetailsApi(data);
        res.done((response) => {
            debugger;
            this.setState({
                redirectToList: true
            })
            toast.info("Updated!", {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {
        })
    }

    // var _this = this;
    //     var KpiData =
    //     {
    //         "scalesetId": 5,
    //         "kpiTitle": this.state.kpiTitle,
    //         "target": this.state.Target,
    //         "weightage": 8,
    //         "createdBy": 1,
    //         // "createdOn": null,
    //         "modifiedBy": 1,
    //         //"modifiedOn": null
    //     }
    //     $.ajax({
    //         url: "http://192.168.10.109:3000/api/kpi_master",
    //         type: "POST",
    //         data: KpiData,
    //         // dataType:"text", 
    //         success: function (resultData) {
    //             _this.setState({ RedirecttouserManagement: true });
    //             toast.success("Success  Notification !", {
    //                 position: toast.POSITION.TOP_RIGHT
    //             });
    //         }
    //     });

    componentDidMount() {
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            console.log(res);
            res.done((response) => {
                debugger;
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target,
                    weightage: response[0].weightage,
                    scaleSetName: response[0].scaleSetName,
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
                {this.state.kpiId !== undefined ? <div>Edit</div> : <div>ADD</div>}

                <form id="kpiform" className="col-12">
                    <div className="form-group">
                        <label for="kpititle">KPI title (required, at least 3 characters)</label>
                        <input id="kpititle" className="form-control" minlength="2" type="text" value={this.state.kpiTitle}
                            onChange={(event) => {
                                this.setState({
                                    kpiTitle: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="form-group">
                        <label for="target">Target(required, at least 50 characters)</label>
                        <textarea className="form-control" rows="4" minlength="50" type="text" value={this.state.target}
                            onChange={(event) => {
                                this.setState({
                                    target: event.target.value
                                })
                            }} ></textarea>
                    </div>
                    <div className="form-group">
                        <label for="weightage">Weight(required)</label>
                        <input className="form-control" rows="4" minlength="5" maxlength="5" type="text" value={this.state.weightage}
                            onChange={(event) => {
                                this.setState({
                                    weightage: event.target.value
                                })
                            }} />
                    </div>
                    <div className="dropdown">
                        {/* <label className="mr-2">Scale set</label>
                        <select onChange={(e) => { this.onChangeScaleSetName(e) }} className="btn btn-info dropdown-toggle md mr-3">
                            <option>select</option>
                            {this.state.displayScaleSetName}
                        </select> */}
                        <br /><br />
                        <label className="mr-2">Scale Set</label>
                        <select onChange={(e) => { this.onChangeScaleSetId(e) }} className="btn btn-info dropdown-toggle md mr-3">
                            <option>select</option>
                            {this.state.displayScaleSetId}
                        </select>
                    </div>
                    <br />
                    {this.state.kpiId !== undefined ?
                        <button type="button" class="btn btn-success mr-2" onClick={() => {
                            this.UpdateKpiDetails(this.state);
                        }}>Save</button>

                        // <input  type="button" value="Submit" onClick={()=>{
                        //     this.SaveData();
                        // }}/>
                        : <button type="button" className="btn btn-info mr-2" value="submit" onClick={() => {
                            this.saveApiDetails(this.state);
                        }}>ADD</button>}
                    <button className="btn btn-info">Clear</button>
                </form>
            </div>
        );
    }
}
export default AddKpi;
