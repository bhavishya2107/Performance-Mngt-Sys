import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast, error } from 'react-toastify';
import { Redirect } from "react-router-dom";
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
const $ = require('jquery');
class AddProjectComplexity extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            projectTypeName: "",
            description: "",
            ProjectComplexityData: "",
            Redirect: false,
        };
    }
    save() {
        var _this = this;
        var ProjectComplexityData =
        {
            "projectTypeName": this.state.projectTypeName,
            "Description": this.state.description,
            // "createdBy": 1,
            // "createdOn": null,
            // "modifiedBy": 1,
            //"modifiedOn": null
        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/project_type_master",
            type: "POST",
            data: ProjectComplexityData,
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
                    <Redirect to={{ pathname: "/ProjectComplexity", state: "" }} />
                )
            }
        }
        return (
            <div>
                <Form className="addProjectComplexity" data-toggle="validator">
                    {/* <FormGroup row>
                        <Label for="projectTypeId" sm={2}>ID</Label>
                        <Col sm={10}>
                            <Input type="text" name="name" id="projectTypeId" placeholder="Enter Your Here"
                                onChange={(event) => {
                                    this.setState({
                                        projectTypeId: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup> */}
                    <FormGroup row>
                        <Label for="text" sm={2}>Project Type</Label>
                        <Col sm={10}>
                            <Input type="textarea" id="projectTypeName" placeholder="Enter Your Project Type Here"
                                onChange={(event) => {
                                    this.setState({
                                        projectTypeName: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="text" sm={2}>Description</Label>
                        <Col sm={10}>
                            <Input type="textarea" id="description" placeholder="Enter Your Description Here"
                                onChange={(event) => {
                                    this.setState({
                                        description: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{ size: 10, offset: 2 }}>
                            
                            <Link to={{ pathname: '/ProjectComplexity' }} onClick={(event) => { this.save(event) }} className="btn btn-sm btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
                            <button type="button" id="btnClr" className="btn btn-sm btn-success mr-2" onClick={(event) => { this.clearfields(event) }} style={{ float: "center" }}>Clear</button>

                        </Col>
                    </FormGroup >
                </Form>

            </div>
        )
    }
}
export default AddProjectComplexity;
