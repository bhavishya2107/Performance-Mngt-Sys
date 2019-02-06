import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
       
        var _this = this;

        var kraFormData =
        {
            "kraName": this.state.kraName,
            "description": this.state.description,
        };

      

        $.ajax({
            url: "http://192.168.10.109:3000/api/kra_master",
            type: "POST",
            data: kraFormData,
            // dataType: "text",
            success: function (resultData) {
               
                _this.setState({ RedirectToSample: true });
                toast.success("Added Record Successfully!", {
                    position: toast.POSITION.TOP_RIGHT
                })
            },
            error: function(error){
                _this.setState({RedirectToSample:true});
                toast.error("Error Notification !", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
       
        });
        var res = window.formValidation("#kraAddForm");
        if (res) {    
            alert("Success")
        } else  {  
          
            return false;
        }

       

    }
    getKraDetailsApi() {
        var _this = this;
        const endpoint = `http://192.168.10.109:3000/api/kra_master/${this.state.id}`;
        return $.ajax({
          url: endpoint,
          type: "GET",
        //   success: function(res){
        //     _this.setState({ RedirectToSample: true });
        //     toast.info("Record Updated Successfully", {
        //         position: toast.POSITION.TOP_RIGHT
        //     })

        //   },
        
        })
      }

    updatekraDetailsApi(data) {
        debugger;
 
                var body =
                {
                    "kraName": data.kraName,
                    "description": data.description,
                }
                return $.ajax({
                    url: `http://192.168.10.109:3000/api/kra_master/${data.id}`,
                    type: "PATCH",
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
                            toast.info("Info Notification !", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        });
                        res.fail((error) => {
                
                        })
                        var res = window.formValidation("#kraAddForm");
                        if (res) {    
                            alert("Success")
                        } else  {  
                          
                            return false;
                        }
                    }
                    componentDidMount() {
                        debugger;
                     
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
            return <Redirect to={{ pathname: "/kraListPage", state: "2222" }} />
        }

        return (
    
            
            <div className="container">
            {this.state.id !== undefined ? <div>Edit</div> : <div>ADD</div>}
                <form id="kraAddForm" action="" style={{ textAlign: "center", paddingTop: "100px" }}>
                <div className="jumbotron">
                <div className="form-group row">
                <label className="col-sm-2 col-form-label" for="kraName">Name</label>
                <div className="col-sm-10">
                    <input id="kraName" type="text" className="form-control" name="kraName" minlength="2"
                        value={this.state.kraName}
                        onChange={(event) => {
                            this.setState(
                                {
                                    kraName: event.target.value
                                }
                            )
                        }} required/><br />
                        </div>
                        </div>
                    <div className="form-group row">
                    <label className="col-sm-2 col-form-label" for="kraDescription">Description</label>
                    <div className="col-sm-10">
                    <textarea name="kraDescription" maxLength="100" rows="7" className="form-control" 
                        value={this.state.description}
                        onChange={(event) => {
                            this.setState(
                                {
                                    description: event.target.value
                                }
                            )
                        }} required></textarea><br/>
                    </div>
                    </div>
                    {/* <button type="button" className="btn btn-success btn-sm" onClick={() =>  this.submitDataFromKra() }>Save</button>&nbsp; */}
                    {this.state.id !== undefined ?
          <button className="btn btn-success btn-sm" type="button" onClick={() => {
            this.UpdateKraDetails(this.state);
          }}>Save</button>
          : <button className="btn btn-success btn-sm" type="button" onClick={() => {
            this.submitDataFromKra(this.state);
          }}>ADD</button>}&nbsp;
                <button className="btn btn-success btn-sm">Clear</button>
     </div>
     <br/>
  
                
                </form>

            </div>
        )
    }
}
export default kraHome;