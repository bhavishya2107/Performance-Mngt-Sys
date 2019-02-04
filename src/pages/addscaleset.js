import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
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
    savescaleset() {

        var _this = this;
      
        var formData = {
            "scaleSetName": this.state.scaleSetName,
            "description": this.state.description

        }
        $.ajax({
            url: "http://192.168.10.109:3000/api/scale_set_master",
            type: "POST",
            data: formData,
            // dataType:"text",           
            success: function (resultData) {
                alert("Save Complete");
                _this.setState({ redirectToList: true });
                toast.success("Success Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
                
            }
        });
    }
    getscalesetDetilsApi() {

        const endpoint = `http://192.168.10.109:3000/api/scale_set_master/${this.state.id}`;
        return $.ajax({
            url: endpoint,
            type: "GET",

        })
    }
    updateDetailsApi(data) {
        
        var body =
        {
            "scaleSetName" : data.scaleSetName,
            "description":data.description,

          }
        debugger;
        //const endpoint = `http://192.168.10.109:3000/api/scale_set_master/${data.id}`;

        return $.ajax({
            url:`http://192.168.10.109:3000/api/scale_set_master/${data.id}`,
            type: "PATCH",
            headers: {
                "content-type": "application/json",
                "x-requested-with": "XMLHttpRequest"
              
              },
            data: JSON.stringify(body)
        });
    }
    UpdatescalesetDetails(data) {
       
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
                {this.state.id !== undefined ? <div>Edit</div> : <div>Add</div>}
          
                <form id="formscaleset" className="col-6">
                    <div className="form-group">
                        <label>Name</label>
                        <input  className="form-control" value={this.state.scaleSetName}
                            onChange={(event) => {
                                this.setState({
                                    scaleSetName: event.target.value
                                })
                            }} />
                    </div>
                    <div className="form-group">
                        <label>Description</label> <textarea className="form-control" rows="4" value={this.state.description}
                            onChange={(event) => {
                                this.setState({
                                    description: event.target.value
                                })
                            }} ></textarea>
                    </div>
                    {this.state.id !== undefined ?
                        <button type="button" onClick={() => {
                            this.UpdatescalesetDetails(this.state);
                        }}>Save</button>
                        : <button type="button" onClick={() => {
                            this.savescaleset(this.state);
                        }}>ADD</button>}


                    {/* <button onClick={() => this.savescaleset()} type="button" className="btn btn-success mr-5" >
                        Save
                    </button> */}
                    <button className="btn btn-danger">Clear</button>
                    {/* <button onClick={() => this.pushdata()} type="button" className="btn btn-success mr-5" >
                        Save
                    </button> */}

                    {/* <Link to={{ pathname: '/scalesetlist', state: {scalesetlistData:scalesetData} }} className="btn btn-info" role="button" style={{textDecoration:"none"}}>Save</Link> */}


                </form>

            </div>
        )
    }
}
export default Scaleset;