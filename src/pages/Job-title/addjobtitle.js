import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment } from '../Environment'
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
class Jobtitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            jobtitleName: "",
            description: "",
            redirectToList: false
        }
    }
    //#region onClick Add function
    savejobtitle() {
        var isvalidate = window.formValidation("#formjobtitle");
        if (isvalidate) {
            var _this = this;

            var formData = {
                "jobtitleName": this.state.jobtitleName,
                "description": this.state.description
            }
            const endpointPOST = environment.apiUrl + 'jobtitle_master/'
            $.ajax({
                url: endpointPOST,
                type: "POST",
                data: formData,
                success: function (resultData) {
                    _this.setState({ redirectToList: true });
                    toast.success("Jobtitle Saved Successfully!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            });
        } else {

            return false;
        }

    }
    //#endregion
    resetform(){
        this.setState({
            jobtitleName:"",
            description:""

        })
    }
    getjobtitleDetilsApi() {
        const endpointGET = environment.apiUrl + 'jobtitle_master/' + `${this.state.id}`

        return $.ajax({
            url: endpointGET,
            type: "GET",

        })
    }
    updateDetailsApi(data) {

        var body =
        {
            "jobtitleName": data.jobtitleName,
            "description": data.description

        }

        const endpointPOST = environment.apiUrl + 'jobtitle_master/' + `${data.id}`
        return $.ajax({
            url: endpointPOST,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"

            },
            data: JSON.stringify(body)
        });
    }
    UpdatejobtitleDetails(data) {
        var isvalidate = window.formValidation("#formjobtitle");
        if (isvalidate) {
            var res = this.updateDetailsApi(data);

            res.done((response) => {
                debugger;
                this.setState({
                    redirectToList: true
                })
                toast.success("Job Title Updated Successfully!", {
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
        if (this.state.id !== undefined) {
            var res = this.getjobtitleDetilsApi();
            res.done((response) => {
                debugger;
                this.setState({
                    jobtitleName: response[0].jobtitleName,
                    description: response[0].description
                })
            });
            res.fail((error) => {

            })
        } else {

        }

    }

    render() {
        if (this.state.redirectToList === true) {

            return <Redirect to={{ pathname: "/job-title" }} />
        }
        return (
            <div className="row">
                {this.state.id !== undefined ? <div></div> : <div></div>}
                <form id="formjobtitle" className="col-6">
                    <div className="form-group">
                        <label className="required">Name</label>
                        <input type="text" id="jobtitleid" name="jobtitlename" minLength="" className="form-control" value={this.state.jobtitleName}
                            onChange={(event) => {
                                this.setState({
                                    jobtitleName: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label> <textarea name="jobtitleaddress" className="form-control" rows="4" value={this.state.description}
                            onChange={(event) => {
                                this.setState({
                                    description: event.target.value
                                })
                            }} ></textarea>
                    </div>
                    {this.state.id !== undefined ?
                        <button type="button" className="btn btn-success mr-3" onClick={() => {
                            this.UpdatejobtitleDetails(this.state);
                        }}>Update</button>
                        : <button type="button" className="btn btn-success mr-3" onClick={() => {
                            this.savejobtitle(this.state);
                        }}>Save</button>}

                    <button type="clear" className="btn btn-primary mr-3" onClick={() => {
                        this.resetform()
                    }}>Clear</button>
                    <Link to="/job-title" className="btn btn-danger ">Cancel</Link>

                </form>
            </div>
        )
    }
}
export default Jobtitle;