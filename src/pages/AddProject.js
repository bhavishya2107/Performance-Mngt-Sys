import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';



const $ = require('jquery');


class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTypeId: "",
            projectName: "",
            status: "",
            startDate: "",
            endDate: "",
            description: "",
            filterProjects: [],
            ProjectsData: "", 
        };
    }
    save() {
        var _this = this;
        var ProjectsData =
        {
            "projectTypeId": this.state.projectTypeId,
            "ProjectName": this.state.projectTypeName,
            "status": this.state.status,
            "startDate": this.state.startDate,
            "endDate": this.state.endDate,
            "Description": this.state.description,
            "createdBy": 1,
            // "createdOn": null,
            "modifiedBy": 1,
            //"modifiedOn": null
        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/project_master/describe",
            type: "POST",
            data: ProjectsData,
            // dataType:"text", 
            success: function (resultData) {
                _this.setState({ RedirecttouserManagement: true });
                toast.success("Success  Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }
  
    render() {
  
        return (
            <div>
                <Form className="addProjectComplexity" className="col mx-sm-3" data-toggle="validator">
                    <FormGroup row>
                        <Label for="text" sm={2}>Project Name</Label>
                        <Col sm={10}>
                            <Input type="text" id="projectName" placeholder="Enter Your Project Name Here"
                                onChange={(event) => {
                                    this.setState({
                                        projectName: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="date" className="col mx-sm-3">Start Date</Label>
                        <Col sm={10}>

                            <Input type="date" id="startDate"
                                onChange={(event) => {
                                    this.setState({
                                        startDate: event.target.value
                                    })
                                }} required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="date" className="col mx-sm-3">End Date</Label>
                        <Col sm={10}>
                            <Input type="date" id="endDate"
                                onChange={(event) => {
                                    this.setState({
                                        endDate: event.target.value
                                    })
                                }} required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="text" sm={2}>Description</Label>
                        <Col sm={10}>
                            <Input type="textarea" id="description" className="col mx-sm-3" placeholder="Enter Your Description Here"
                                onChange={(event) => {
                                    this.setState({
                                        description: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dropdown" id="ProjectComplexity" sm={2}>Project Complexity </Label>
                        <div>
                            <select id='select1'>
                                {this.state.opts}
                            </select>
                        </div>
                    </FormGroup>
                <FormGroup row>
                    <Label for="dropdown" id="Status" sm={2}>Project Status</Label>
                    <select onChange={(e) => { this.onChangeStatus(e) }}>
                        <option>Select Your status</option>
                    </select>
                </FormGroup>
                <FormGroup row>
                    <Label for="dropdown" id="ProjectComplexity" sm={2}>Resources</Label>
                    <select>
                        <option value="select">Select</option>
                        <option value="select">VS Code</option>
                        <option value="select">Android Studio</option>
                        <option value="select">Swift</option>
                    </select>
                </FormGroup>
                <FormGroup row>
                    <Label for="dropdown" id="ProjectComplexity" sm={2}>Project Managed By</Label>
                    <select>
                        <option value="select">Select Here</option>
                        <option value="select">Janmesh</option>
                        <option value="select">Vishal</option>
                        <option value="select">Bhavishya</option>
                        <option value="select">Nikita</option>
                    </select>
                </FormGroup>
                <FormGroup check row>
                    <Col sm={{ size: 10, offset: 2 }}>
                        <Link to={{ pathname: '/Projects' }} onClick={(event) => { this.save(event) }} className="btn btn-sm btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
                        <button type="button" id="btnClr" className="btn btn-sm btn-danger mr-2" onClick={(event) => { this.clearfields(event) }}  style={{ float: "center" }}>Clear</button>
                    </Col>
                </FormGroup >
                </Form>
            </div >
        )
    }
}
export default AddProject;
