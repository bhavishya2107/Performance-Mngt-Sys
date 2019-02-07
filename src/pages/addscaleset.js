import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { environment } from './Environment'
import { ToastContainer, toast } from 'react-toastify';
const $ = require('jquery');
//var scalesetData = []
class Scaleset extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            scaleSetName: "",
            description: "",
            redirectToList: false
        }
    }
    //#region Onclick function for Add
    savescaleset() {
        var isvalidate = window.formValidation("#formscaleset");
        if (isvalidate) {

            var _this = this;
            var formData = {
                "scaleSetName": this.state.scaleSetName,
                "description": this.state.description
            }
            const endpointPOST = environment.apiUrl + 'scale_set_master/'
            $.ajax({
                url: endpointPOST,
                type: "POST",
                data: formData,
                success: function (resultData) {
                    
                    _this.setState({ redirectToList: true });
                    toast.success("Scaleset Saved Successfully!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            });
        } else {

            return false;
        }

    }
    //#endregion
    
    //#region Reset function onclick
    resetform(){
        this.setState({
            scaleSetName:"",
            description:""

        })
    }
    //#endregion
    
    getscalesetDetilsApi() {
        const endpointGET = environment.apiUrl + 'scale_set_master/' + `${this.state.id}`
        return $.ajax({
            url: endpointGET,
            type: "GET",

        })
    }
    //#region  update Api function and ajax call
    updateDetailsApi(data) {
        var body =
        {
            "scaleSetName": data.scaleSetName,
            "description": data.description,
        }
        const endpointPOST = environment.apiUrl + 'scale_set_master/' + `${data.id}`
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
    UpdatescalesetDetails(data) {
        var isvalidate = window.formValidation("#formscaleset");
        if (isvalidate) {
            var res = this.updateDetailsApi(data);
            res.done((response) => {
                this.setState({
                    redirectToList: true
                })
            });
            res.fail((error) => {

            })
        } else {

            return false;
        }
        var res = this.updateDetailsApi(data);

        res.done((response) => {
        
            this.setState({
                redirectToList: true
            })
            toast.success("Scaleset Updated Successfully!", {
                position: toast.POSITION.TOP_RIGHT
            });

        });
        res.fail((error) => {

        })
    }
    //#endregion
    
    
    componentDidMount() {
        if (this.state.id !== undefined) {
            var res = this.getscalesetDetilsApi();
            res.done((response) => {
                debugger;
                this.setState({
                    scaleSetName: response[0].scaleSetName,
                    description: response[0].description
                })
            });
            res.fail((error) => {

            })
        } else {

        }
    }
    render() {
        if (this.state.redirectToList == true) {

            return <Redirect to={{ pathname: "/scaleset" }} />
        }
        return (

            <div className="row">
                {this.state.id !== undefined ? <div></div> : <div></div>}

                <form id="formscaleset" className="col-6">
                    <div className="form-group">
                        <label className="required">Name</label>
                        <input type="text" id="scalesetid" name="scalesetname" className="form-control" minLength="" value={this.state.scaleSetName}
                            onChange={(event) => {
                                this.setState({
                                    scaleSetName: event.target.value
                                })
                            }} required />
                    </div>
                    <div className="form-group">
                        <label>Description</label> <textarea id="scalesetid" name="scalesetaddress" className="form-control" rows="4" value={this.state.description}
                            onChange={(event) => {
                                this.setState({
                                    description: event.target.value
                                })
                            }} ></textarea>
                    </div>
                    {this.state.id !== undefined ?
                        <button type="button" className="btn btn-success mr-3" onClick={() => {
                            this.UpdatescalesetDetails(this.state);
                        }}>Update</button>
                        
                        : <button type="button" className="btn btn-success mr-3" onClick={() => {
                            this.savescaleset(this.state);
                        }}>Save</button>}

                 <button type="clear" className="btn btn-primary mr-3" onClick={() => {
                            this.resetform()}}>CLEAR</button>
                  <Link to="/scaleset" className="btn btn-danger ">Cancel</Link>           
                </form>
            </div>
        )
    }
}
export default Scaleset;