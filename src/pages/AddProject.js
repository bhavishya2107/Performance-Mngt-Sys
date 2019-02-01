import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';
const $ = require('jquery');


var ArrayStatus = [
    { Status: "DoneByReviewver", Projects: "Android", id: 1 },
    { Status: "DoneByDeveloper", Projects: "Android", id: 2 },
    { Status: "Approved", Projects: "IOS", id: 3 },
    { Status: "Reverted", Projects: "React", id: 4 }
];
class AddProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectTypeName: "",
            StartDate: "",
            EndDate: "",
            filterProjects: [],
        };
    }

    save() {
        var _this = this;
        var DataList = {
            // "jobtitleId": this.state.jobtitleId,
            // "depId": this.state.depId,
            // "roleId": this.state.roleId,
            "": 1,
            
        }
    }
    onChangeProjects(event) {
        console.log(event.target.value)
        var filter_By_Projects = ArrayStatus.filter(item => { return item.Projects === event.target.value });
        console.log(filter_By_Projects);
        this.setState({
            filterProjects: filter_By_Projects,
            Projects: event.target.value
        })
    }
    onChangeStatus(event) {
        this.setState({ optionsOfStatus: event.target.value })
    }
    
    render()
    
    {
        debugger;
        var optionsOfStatus = this.state.filterProjects.map(function (options) {
            return <option value={options.Status}>{options.Status}</option>
        })
        
        return (
            <div>
                <Form className="addProjectComplexity" data-toggle="validator">
                    <FormGroup row>
                        <Label for="text" sm={2}>Project Name</Label>
                        <Col sm={10}>
                            <Input type="text" id="projectTypeName" placeholder="Enter Your Project NAme Here"
                                onChange={(event) => {
                                    this.setState({
                                        projectTypeName: event.target.value
                                    })
                                }}
                                required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="date" className="col-md-4">Start Date</Label>
                        <Col sm={10}>
                        <div className="row mb-3"/>
                    <div className="col-md-3"/>
            
                            <Input type="date" id="StartDate"
                                onChange={(event) => {
                                    this.setState({
                                        StartDate: event.target.value
                                    })
                                }} required />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="date" className="md-8">End Date</Label>
                        <Col sm={10}>
                            <Input type="date" id="StartDate"
                                onChange={(event) => {
                                    this.setState({
                                        StartDate: event.target.value
                                    })
                                }} required />
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
                    <FormGroup row>
                        <Label for="dropdown" id="ProjectComplexity" sm={2}>Project Complexity </Label>
                        <select onChange={(e) => { this.onChangeProjects(e) }}>
                            <option value="Android">Select Your Project</option>
                            <option value="Android">Android</option>
                            <option value="IOS">IOS</option>
                            <option value="React">React</option>
                        </select>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dropdown" id="Status" sm={2}>Project Status</Label>
                        <select onChange={(e) => { this.onChangeStatus(e) }}>
                            <option>Select Your status</option>
                            {optionsOfStatus}
                        </select>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dropdown" id="ProjectComplexity" sm={2}>Resources</Label>
                        <select onChange={(e) => { this.onChangeState(e) }}>
                            <option value="select">Select Type</option>
                            <option value="select">Select Type</option>
                            <option value="select">Select Type</option>
                        </select>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="dropdown" id="ProjectComplexity" sm={2}>Project Managed BY</Label>
                        <select onChange={(e) => { this.onChangeState(e) }}>
                            <option value="select">Janmesh</option>
                            <option value="select">Vishal</option>
                            <option value="select">Bhavishya</option>
                        </select>
                    </FormGroup>
                    <FormGroup check row>
                        <Col sm={{ size: 10, offset: 2 }}>
                            <Link to={{ pathname: '/Projects' }} onClick={(event) => { this.save(event) }} className="btn btn-sm btn-success mr-2" role="submit" input ty style={{ textDecoration: "none", float: "center" }}>Save</Link>
                            <button type="button" id="btnClr" className="btn btn-sm btn-danger mr-2" onClick={(event) => { this.clearfields(event) }} style={{ float: "center" }}>Clear</button>

                        </Col>
                    </FormGroup >
                </Form>

            </div>
        )
    }
}
export default AddProject;
