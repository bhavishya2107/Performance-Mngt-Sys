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
        var res = window.formValidation("#kraAddForm");
        if (res) {
            alert("Success")
        } else  {
          
            return false;
        }
       
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
     

       

    }
    getKraDetailsApi() {
        var _this = this;
        const endpoint = `http://192.168.10.109:3000/api/kra_master/${this.state.id}`;
        return $.ajax({
          url: endpoint,
          type: "GET",
        
        })
      }
      kraFormClear(){
          this.setState({
            description: "",
            kraName: "",
          });
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
                            toast.success("KRA Updated Successfully", {
                                position: toast.POSITION.TOP_RIGHT
                            });
                        });
                        res.fail((error) => {
                
                        })
                        var res = window.formValidation("#kraAddForm");
                        if (res) {    
                       
                        } else  {  
                          
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
            return <Redirect to={{ pathname: "/kraListPage", state: "2222" }} />
        }

        return (
    
            
            <div className="container-fluid">
            {this.state.id !== undefined ? <div></div> : <div></div>}
                <form id="kraAddForm" action="" >
           
                <div className="form-group">
                <label className=" required" for="kraName">Name</label>
                <div className="">
                    <input id="kraName" type="text" className="form-control col-6" name="kraName" minlength="2"
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
                    <div className="form-group">
                    <label className=" required" for="kraDescription">Description</label>
                    <div className="">
                    <textarea name="kraDescription" className="form-control col-6" 
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
                    {this.state.id !== undefined ?
          <button className="btn btn-success" type="button" onClick={() => {
            this.UpdateKraDetails(this.state);
          }}>Save</button>
          : <button className="btn btn-success" type="button" onClick={() => {
            this.submitDataFromKra(this.state);
          }}>ADD</button>}&nbsp;
                <button type="clear" className="btn btn-info" onClick={()=>{this.kraFormClear()}}>Clear</button>&nbsp;
                <Link to="/kraListPage" className="btn btn-danger" type="button" >Cancel</Link><br/>
                </form>

            </div>
        )
    }
}
export default kraHome;