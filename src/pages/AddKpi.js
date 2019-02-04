import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
const $ = require('jquery');

class AddKpi extends Component {
    
    constructor(props) {
        debugger;
        alert();
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

    getDetailsApi() {
        return $.ajax({
            url: `http://192.168.10.109:3000/api/kpi_master/${this.state.kpiId}`,
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
            data: JSON.stringify(body)
        });
    }

    UpdateKpiDetails(data) {
        debugger;
        var res = this.updateDetailsApi(this.state);
        res.done((response) => {
            debugger;
            this.setState({
                isUpdate: true
            })
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
       // console.log('out',this.state.kpiId);
       alert('did')
       debugger
        if (this.state.kpiId !== undefined) {
            var res = this.getDetailsApi();
            res.done((response) => {
                debugger;
                this.setState({
                    kpiTitle: response[0].kpiTitle,
                    target: response[0].target,
                    weightage : response[0].weightage
                })
            });
            res.fail((error) => {
            })
        } else {
        }
    }
   
    render() {
        {
            
            // if (this.state.Redirect) {
            //     return (
            //         <Redirect to={{ pathname: "/KPI", state: "" }} />
            //     )
            // }
            return (
                <div>
                      {this.state.kpiId!== undefined ? <div>Edit</div> : <div>ADD</div>}
                    <Form className="addKpi" data-toggle="validator">
                        <FormGroup row>
                            <Label for="KpiTitle" sm={2}>KPI title</Label>
                            <Col sm={10}>
                                <Input type="text" id="kpiTitle" placeholder="Enter Your KPI title Here"
                               value={this.state.kpiTitle} onChange={(e) => {
                                    this.setState({
                                        kpiTitle: e.currentTarget.value
                                    })
                                }}required />
                        </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="target" sm={2}>Target</Label>
                            <Col sm={10}>
                                <Input type="textarea" id="target" placeholder="Enter Your Target Here"
                                     value={this.state.target} onChange={(e) => {
                                        this.setState({
                                            target: e.currentTarget.value
                                        })
                                    }}required />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="weight" sm={2}>Weight</Label>
                            <Col sm={10}>
                                <Input type="number" id="Weightage" placeholder="Enter Your Weightage Here"
                                     value={this.state.weightage} onChange={(e) => {
                                        this.setState({
                                            weightage: e.currentTarget.value
                                        })
                                    }}required />
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="dropdown" sm={2}>Scale Select</Label>
                            <Col sm={10}>
                                <select className="form-control">
                                    <option value="select">Select Scale</option>
                                    <option value="select">One</option>
                                    <option value="select">Two</option>
                                    <option value="select">Three</option>
                                </select>
                            </Col>
                        </FormGroup>
                        <FormGroup check row>
                            <Col sm={{ size: 10, offset: 2 }}>
                                <Link to={{ pathname: '/KPI' }} onClick={(event) => { this.UpdateKpiDetails(event) }} class="btn btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
                                <button type="button" id="btnClr" class="btn btn-success" onClick={(event) => { this.clearfields(event) }} style={{ float: "center" }}>Clear</button>
                            </Col>
                        </FormGroup >
                    </Form>
                        <br />
                        {/* {this.state.kpiId !== undefined ?
                            <button onClick={() => {
                                this.UpdateKpiDetails(this.state);
                            }}>Save</button>
                            : <button onClick={() => {
                                this.UpdateKpiDetails(this.state);
                            }}>ADD</button>} */}

                </div>

            );
        }
    }
}
export default AddKpi;
