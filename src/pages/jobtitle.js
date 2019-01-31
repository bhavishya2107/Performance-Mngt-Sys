import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
class Jobtitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Jobtitle:"",
            Description:"",
            redirectToList: false
        }
    }
    savejobtitle() {

        var _this=this;
        
        var formData ={
            "jobtitleName" : this.state.Jobtitle,
            "description":this.state.Description
           
          }
       $.ajax({
            url: "http://192.168.10.109:3000/api/jobtitle_master",
            type: "POST",
            data: formData,           
            success:function(resultData)
            { 
                _this.setState({ redirectToList: true });
            }
        });
 }

    render(){
        if (this.state.redirectToList) {

            return <Redirect to={{ pathname: "/jobtitlelist", state: "2222" }} />
        }
        return(
            <div className="row">
                    <form id="formjobtitle" className="col-6">
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className="form-control" value={this.state.Jobtitle}
                         onChange={(event) => {
                            this.setState({
                                Jobtitle: event.target.value
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
                    <button onClick={() => this.savejobtitle()} type="button" className="btn btn-success mr-5" >
                        Save
                    </button>
                    <button className="btn btn-danger">Clear</button>
                 
                </form>
            </div>
        )
    }
}
export default Jobtitle;