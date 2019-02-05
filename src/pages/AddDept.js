import React, { Component } from 'react';
import { Form, Label, FormGroup, Input } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { Redirect } from 'react-router-dom'
import { environment } from './Environment'

class AddDept extends Component {
    constructor(props) {
        super(props);

        console.log(props.match.params, 'ppp')
        this.state = {
            RedirectToDept: false,
            depId: props.match.params.depId,
            // depId:
            depName: "",
            description: "",
            isUpdate: false
        }
    }
    // clear(){
    //     this.setState={
    //         depName: "",
    //         description: ""
    //     }
    // }


    save() {

        var _this = this
        var deptList =
        {

            "depName": this.state.depName,
            "description": this.state.description,
        }
        var url = environment.apiUrl + 'department_master';
        $.ajax({
            url: url,
            type: "POST",
            data: deptList,
            success: function (result) {

                _this.setState({ RedirectToDept: true });
                toast.success("Success  Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
    }

    //Edit the details
    getDepApi() {
        console.log('dep', this.state.depId)
        var url = environment.apiUrl + 'department_master/' + `${this.state.depId}`
        return $.ajax({
            url: url,
            type: "GET",

        })
    }
    updateDetailsApi(data) {
        var _this = this;
        var deptList =
        {
            "depName": data.depName,
            "description": data.description
        }
        return $.ajax({
            url: `http://192.168.10.109:3000/api/department_master/${data.depId}`,
            type: "PATCH",

            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest",

                "Access-Control-Allow-Origin": "*"
            },
            data: JSON.stringify(deptList),

        });
    }

    UpdateDeptDetails(data) {
        var res = this.updateDetailsApi(data);
        res.done((response) => {
            console.log('sucesss')
            this.setState({
                isUpdate: true
            })

        });
        res.fail((error) => {

            console.log('error', error);
        })
    }
    componentDidMount() {
        // console.log('out', this.state.depId);
        // this.state.depId = 27

        if (this.state.depId !== undefined) {
            var res = this.getDepApi();
            res.done((response) => {
                console.log(response, 'res');
                var res = response[0];

                this.setState({
                    depName: res.depName,
                    description: res.description
                })
            });
            res.fail((error) => {

            })
        } else {

        }

    }
    render() {
        if (this.state.RedirectToDept) {

            return <Redirect to={{ pathname: "/Department", state: "2" }} />
        }
        if (this.state.isUpdate == true) {
            return <Redirect to="/Department" />
        }

        return (
            <div>
                <div>
                    {this.state.id !== undefined ? <div>Edit</div> : <div>ADD</div>}

                </div>
                <Form>
                    <div>

                        <FormGroup >
                            <Label for="depName" sm={2}>Name</Label>
                            <Input type="text" name="depName" id="depName" placeholder="Enter the Name" value={this.state.depName}
                                onChange={(event) => {
                                    this.setState({
                                        depName: event.target.value
                                    })
                                }} />
                        </FormGroup>

                        <FormGroup >
                            <Label for="description" sm={2}>description</Label>
                            <Input type="text" name="description" id="description" value={this.state.description}
                                onChange={(event) => {
                                    this.setState({
                                        description: event.target.value
                                    })
                                }} />
                        </FormGroup>
                    </div>
                    {this.state.depId !== undefined ?
                        <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.UpdateDeptDetails(this.state);
                        }}>Edit</button>
                        : <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => {
                            this.save(this.state);
                        }}>Save</button>}


                    {/* <button type="button" className="btn btn-sm btn-success mr-2" onClick={() => { this.UpdateDepDetails(); }}>Save</button> */}
                    <button className="btn btn-sm btn-success mr-2">Clear</button>
                </Form>

            </div >
        )

    }
}
export default AddDept;