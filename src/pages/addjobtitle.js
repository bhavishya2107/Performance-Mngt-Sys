import React, { Component } from 'react';
//import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Redirect } from 'react-router-dom';
const $ = require('jquery');
class Jobtitle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            jobtitleName:"",
            description:"",
            redirectToList: false
        }
    }
    savejobtitle() {

        var _this=this;
        
        var formData ={
            "jobtitleName" : this.state.jobtitleName,
            "description":this.state.description
        }
       $.ajax({
            url: "http://192.168.10.109:3000/api/jobtitle_master",
            type: "POST",
            data: formData,           
            success:function(resultData)
            { 
                _this.setState({ redirectToList: true });
                toast.success("Success Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        });
 }
 getjobtitleDetilsApi() {

    const endpoint = `http://192.168.10.109:3000/api/jobtitle_master/${this.state.id}`;
    return $.ajax({
        url: endpoint,
        type: "GET",

    })
}
updateDetailsApi(data) {
        
    var body =
    {
        "jobtitleName" : data.jobtitleName,
            "description":data.description

      }
    debugger;
    
    return $.ajax({
        url:`http://192.168.10.109:3000/api/jobtitle_master/${data.id}`,
        type: "PATCH",
        headers: {
            "content-type": "application/json",
            "x-requested-with": "XMLHttpRequest"
          
          },
        data: JSON.stringify(body)
    });
}
UpdatejobtitleDetails(data) {
       
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

    render(){
        if (this.state.redirectToList === true) {

            return <Redirect to={{ pathname: "/jobtitle" }} />
        }
        return(
            <div className="row">
             {this.state.id !== undefined ? <div>Edit</div> : <div>Add</div>}
                    <form id="formjobtitle" className="col-6">
                    <div className="form-group">
                        <label>Name</label>
                        <input className="form-control" value={this.state.jobtitleName}
                         onChange={(event) => {
                            this.setState({
                                jobtitleName: event.target.value
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
                            this.UpdatejobtitleDetails(this.state);
                        }}>Save</button>
                        : <button type="button" onClick={() => {
                            this.savejobtitle(this.state);
                        }}>ADD</button>}

                    {/* <button onClick={() => this.savejobtitle()} type="button" className="btn btn-success mr-5" >
                        Save
                    </button>
                    <button className="btn btn-danger">Clear</button> */}
                   
                </form>
            </div>
        )
    }
}
export default Jobtitle;