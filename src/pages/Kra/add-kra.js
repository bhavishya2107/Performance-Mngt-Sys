import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification , ModuleNames } from '../Environment';
const $ = require('jquery');

class kraHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            RedirectToSample: false,
            description: "",
            kraName: "",
        };
    }

    submitDataFromKra() {
        var isvalidate = window.formValidation("#kraAddForm");
        if (isvalidate) {
            var res = this.kraAlreadyExistApi();
            res.done((response) => {
                if (response.length > 0) {
                    //alert("")
                    // toast.error("Kra Already exists!", {
                    //     position: toast.POSITION.TOP_RIGHT
                    // });
                    $(".hide").show()
                } else {
                    var _this = this;
                    var kraFormData =
                    {
                        "kraName": this.state.kraName,
                        "description": this.state.description,
                    };
                    const endpointPOST = environment.apiUrl + moduleUrls.Kra + '/'
                    $.ajax({
                        url: endpointPOST,
                        type: "POST",
                        data: kraFormData,
                        success: function (resultData) {

                            _this.setState({ RedirectToSample: true });
                            toast.success("Kra " + Notification.saved, {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        }
                    });
                }
            });
            res.fail(error => {

            });

        } else {

            return false;
        }

    }

    kraAlreadyExistApi() {
        // http://192.168.10.109:3000/api/modulename?_where=(fieldname,eq,searchtext)
        const endpoint = environment.apiUrl + moduleUrls.Kra + '?_where=(kraName,eq,' + this.state.kraName + ')';
        return $.ajax({
            url: endpoint,
            type: Type.get,
            data:''
        });
    }
  


    getKraDetailsApi() {
        var _this = this;
        const endpoint = environment.apiUrl + moduleUrls.Kra + '/' + `${this.state.id}`
        // const endpoint = `http://180.211.103.189:3000/api/kra_master/${this.state.id}`;
        return $.ajax({
            url: endpoint,
            type: Type.get,

        })
    }
    kraFormClear() {
        this.setState({
            description: "",
            kraName: "",
        });
    }

    updatekraDetailsApi(data) {
        const endpoint = environment.apiUrl + moduleUrls.Kra + '/' + `${data.id}`
        var body =
        {
            "kraName": data.kraName,
            "description": data.description,
        }
        return $.ajax({
            // url: `http://180.211.103.189:3000/api/kra_master/${data.id}`,
            url: endpoint,
            type: Type.patch,
            headers: {
                "Content-Type": "application/json",
                "x-requested-with": "XMLHttpRequest"
            },
            data: JSON.stringify(body)
        });
    }
    UpdateKraDetails(data) {

        var res = this.updatekraDetailsApi(data);
        res.done((response) => {

            this.setState({
                RedirectToSample: true

            })
            toast.success("KRA " + Notification.updated, {
                position: toast.POSITION.TOP_RIGHT
            });
        });
        res.fail((error) => {

        })
        var res = window.formValidation("#kraAddForm");
        if (res) {

        } else {

            return false;
        }
    }
    componentDidMount() {


        if (this.state.id !== undefined) {
            var res = this.getKraDetailsApi();
            res.done((response) => {

                this.setState({
                    kraName: response[0].kraName,
                    description: response[0].description
                })
            });
            res.fail((error) => {

            })
        } else {

        }
    }

    render() {
        if (this.state.RedirectToSample) {
            return <Redirect to={{ pathname: "/kra", state: "2222" }} />
        }

        return (


            <div className="clearfix">
                <div className="clearfix d-flex align-items-center row page-title">
                    <h2 className="col"> {ModuleNames.kra} >
                {this.state.id !== undefined ? <span>Edit</span> : <span>Add</span>}
                    </h2>
                </div>

                <form id="kraAddForm" action="" >

                    <div className="form-group">
                        <label className=" required" htmlFor="kraName">Name</label>
                        <div className="">
                            <input id="kraName" type="text" className="form-control col-6" name="kraName"
                                value={this.state.kraName}
                                onChange={(event) => {
                                    this.setState(
                                        {
                                            kraName: event.target.value
                                        }
                                    )
                                }} required /> <p className="hide" style={{ "display": "none" }}>{Notification.recordExists}</p>
                                
                        </div>
                    </div>
                    <div className="form-group">
                        <label className=" required" htmlFor="kraDescription">Description</label>
                        <div className="">
                            <textarea name="kraDescription" className="form-control col-6"
                                value={this.state.description}
                                onChange={(event) => {
                                    this.setState(
                                        {
                                            description: event.target.value
                                        }
                                    )
                                }}></textarea><br />
                        </div>
                    </div>
                    {this.state.id !== undefined ?
                        <button className="btn btn-success" type="button" onClick={() => {
                            this.UpdateKraDetails(this.state);
                        }}>Update</button>
                        : <button className="btn btn-success" type="button" onClick={() => {
                            this.submitDataFromKra(this.state);
                        }}>Save</button>}&nbsp;
                <button type="clear" className="btn btn-info" onClick={() => { this.kraFormClear() }}>Clear</button>&nbsp;
                <Link to="/kra" className="btn btn-danger" >Cancel</Link><br />
                </form>
                <ToastContainer></ToastContainer>

            </div>
        )
    }
}
export default kraHome;