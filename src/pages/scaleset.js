import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
var scalesetData = []
class Scaleset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Name:"",
            Description:"",
            savescaleset: "",
            redirectToList: false
        }
    }
    savescaleset() {

        var _this=this;
        // alert("success")
        var formData ={
            "scaleSetName" : this.state.Name,
            //"scaleSetRange": "20 to 40",
            "description":this.state.Description
           
          }
       var saveData= $.ajax({
            url: "http://192.168.10.109:3000/api/scale_set_master",
            type: "POST",
            data: formData,
           // dataType:"text",           
            success:function(resultData)
            { 
                alert("Save Complete");
                _this.setState({ redirectToList: true });
            }
        });
 }
    // pushdata(){
    //     this.setState(){
    //         scalesetData.push(this.state);
    //     }
    // }
    render() {
        if (this.state.redirectToList) {

            return <Redirect to={{ pathname: "/scalesetlist", state: "2222" }} />
        }
        return (
            <div className="row">
                {/* <h1>hello</h1> */}
                <form id="formscaleset" className="col-6">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={this.state.Name}
                         onChange={(event) => {
                            this.setState({
                                Name: event.target.value
                            })
                        }} />
                    </div>
                    <div className="form-group">
                        <label>Description</label> <textarea className="form-control" rows="4" value={this.state.Description}
                        onChange={(event) => {
                            this.setState({
                                Description: event.target.value
                            })
                        }} ></textarea>
                    </div>
                    <button onClick={() => this.savescaleset()} type="button" className="btn btn-success mr-5" >
                        Save
                    </button>
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