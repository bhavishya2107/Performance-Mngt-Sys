import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
class AddKpi extends Component {

    constructor(props) {
        debugger;
        super(props);
        this.state = {
            kpiId: props.match.params.kpiId,
            scalesetId: "",
            KpiData: "",
            kpiTitle: "",
            target: "",
            weightage: "",
            KpiDataDetails: "",
            isUpdate: false
        }
    }

    saveApiDetails() {
        var _this = this;
        var Kpidata = {
            "KpiTitle": this.state.kpiTitle,
            "target": this.state.target
        }
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
    getKpiDetailsApi() {
        const endpoint = `http://192.168.10.109:3000/api/kpi_master/${this.state.kpiId}`;
        return $.ajax({
            url: endpoint,
            type: "GET",
        })
    }
    updateDetailsApi(data) {
        var body =
        {
            "KpiTitle": data.kpiTitle,
            "target": data.target,
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
        debugger;
        if (this.state.kpiId !== undefined) {
            var res = this.getKpiDetailsApi();
            res.done((response) => {
                debugger;
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target,
                    weightage: response[0].weightage
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
            <div>
                {this.state.kpiId !== undefined ? <div>Edit</div> : <div>ADD</div>}
                <form id="kpiform" className="col-12">
                    <div className="form-group">
                        <label>KPI title</label>
                        <input className="form-control" value={this.state.KpiTitle}
                            onChange={(event) => {
                                this.setState({
                                    kpiTitle: event.target.value
                                })
                            }} />
                    </div>
                    <div className="form-group">
                        <label>Target</label> <textarea className="form-control" rows="4" value={this.state.target}
                            onChange={(event) => {
                                this.setState({
                                    target: event.target.value
                                })
                            }} ></textarea>
                    </div>
                <br />
                {this.state.kpiId !== undefined ?
                    <button type="button" class="btn btn-success mr-2" onClick={() => {
                        this.UpdateKpiDetails(this.state);
                    }}>Save</button>
                    : <button type="button" class="btn btn-success mr-2" onClick={() => {
                        this.UpdateKpiDetails(this.state);
                    }}>ADD</button>}
                <button className="btn btn-info">Clear</button>
                </form>

            </div>
        );
    }
}
export default AddKpi;
