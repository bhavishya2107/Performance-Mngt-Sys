import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { ToastContainer, toast, error } from 'react-toastify';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
const $ = require('jquery');

class AddKpi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scalesetId: "",
            KpiData: "",
            kpiTitle: "",
            Target: "",
            weightage: "",
            KpiDataDetails: "",
        }
    }

    save() {
        var _this = this;
        var KpiData =
        {

            "scalesetId": 5,
            "kpiTitle": this.state.kpiTitle,
            "target": this.state.Target,
            "weightage": 8,
            "createdBy": 1,
            // "createdOn": null,
            "modifiedBy": 1,
            //"modifiedOn": null
        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/kpi_master",
            type: "POST",
            data: KpiData,
            // dataType:"text", 
            success: function (resultData) {
                _this.setState({ redirectToList: true });
                toast.success("Successfully Added !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
    render() {
        {
            if (this.state.Redirect) {
                return (
                    <Redirect to={{ pathname: "/KPI", state: "" }} />
                )
            }
        }
        return (
            <div>
                <Form className="addKpi" data-toggle="validator">
                    <FormGroup row>
                        <Label for="KpiTitle" sm={2}>KPI title</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="kpiTitle" placeholder="Enter Your KPI title Here"
                                onChange={(event) => {
                                    this.setState({
                                        kpiTitle: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="target" sm={2}>Target</Label>
                        <Col sm={10}>
                            <Input type="text" id="Target" placeholder="Enter Your Target Here"
                                onChange={(event) => {
                                    this.setState({
                                        Target: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>                    <FormGroup row>
                        <Label for="weight" sm={2}>Weight</Label>
                        <Col sm={10}>
                            <Input type="number" id="Weight" placeholder="Enter Your Weightage Here"
                                onChange={(event) => {
                                    this.setState({
                                        Weight: event.target.value
                                    })
                                }}
                                required />
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
                            <Link to={{ pathname: '/KPI' }} onClick={(event) => { this.save(event) }} class="btn btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
                            <button type="button" id="btnClr" class="btn btn-success" onClick={(event) => { this.clearfields(event) }} style={{ float: "center" }}>Clear</button>
                        </Col>
                    </FormGroup >
                </Form>
            </div>
        )
    }
}
export default AddKpi;
