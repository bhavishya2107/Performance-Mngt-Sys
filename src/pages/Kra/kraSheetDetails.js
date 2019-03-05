import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { environment, moduleUrls, Type, Notification, ModuleNames } from '../Environment';
const $ = require('jquery');
$.DataTable = require('datatables.net-bs4');

class KraSheet extends Component{
    constructor(props){
        super(props);
        this.state={
          name:"",
          kraName:"",
          projectName:"",
          startDate:"",
          endDate:"",
          departmentName:"",
          comments:"",
          selfRating:"",
          quaterName:"",
          assignId:""
        }
    }

    getUserDetailsApi() {
      var endpoint = environment.dynamicUrl + 'dynamic';
      var kraSheet = {
                      query: `SELECT um.userid,UM.firstName,Um.lastname, PM.projectName,PM.startDate,PM.endDate, d.departmentName, k.kraname,q.quatername from  project_master as PM  JOIN user_master as UM ON UM.userId = PM.manageBy JOIN department_master as d ON d.departmentId = UM.userId JOIN kra_master as k ON k.kraid = um.userid JOIN quater_master q ON q.quaterid=um.userid where um.userid=${this.state.assignId}`
                    }

      // const endpoint = "http://180.211.103.189:3000/dynamic";
  
      return $.ajax({
        url: endpoint,
        type: Type.post,
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(kraSheet),
        
  
      });
    }
    commentsAndRating=(event)=>{
      this.setState(({
        comments:event.target.value,
        selfRating:event.target.value
      }));
    }

    
    componentDidMount() {
   debugger;
      // if (this.state.userId ) {
        var res = this.getUserDetailsApi();
        res.done(response => {
          console.log(response)
          this.setState({

            firstName: response[0].firstName,
            lastName: response[0].lastname,
            projectName:response[0].projectName,
            departmentName: response[0].departmentName,
            kraName:response[0].kraname,
            startDate:response[0].startDate,
            endDate:response[0].endDate,
            quaterName:response[0].quatername
    
          });
        });
        res.fail(error => { });
      // }
        //*********************************************************//
        const endpointGET = environment.dynamicUrl + 'dynamic' 
        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            "searching": false,
            "lengthChange": false,
            "paging": false,
            "bInfo" : false,
     
            ajax: {
                url: endpointGET,
                type: "POST",
                dataSrc: "",
                data: {
                    query: "select Kpi_Master.kpiId, Kpi_Master.kpiTitle,Kpi_Master.target, Kpi_Master.weightage, scale_set_master.scalesetName FROM Kpi_Master left join scale_set_master On Kpi_master.scalesetid = scale_set_master.scalesetId order by kpiId desc"
                },
            },
            columns: [
              
                {
                    data: "kpiTitle",
                    targets: 0
                },
                {
                  data: "target",
                  targets: 1
              },
                {
                    data: "weightage",
                    targets: 2
                },
                  {
                    data: "selfRating",
                    targets: 0,
                    render: (data, type, row) => {
                        return (
                            '<input type="number" name="selfRating" min="0" max="10" width="100px" value=' + `${this.commentsAndRating}`+ ' />'
                        )
                    },
   
                },
                {
                  data: "comments",
                  targets: 0,
                  render: (data, type, row) => {
                      return (
                          '<textarea rows="4" cols="75" name="kpiId" value=' + `${this.commentsAndRating}` + ' >'
                      )
                  },
        
              },
             
            
            
            ],
            
            //#endregion
            drawCallback: (settings) => {
                window.smallTable();
                $(".btnDelete").on("click", e => {
                    this.SingleDeleteConfirm(e.currentTarget.id);
                });
            }
        });
    }
    
    render(){
        return(
            
                  <div className="container-fluid " >
                  <h5 style={{textAlign:"center",marginTop:"10px"}}>KRA-{this.state.quaterName}-{this.state.kraName}-{this.state.startDate}-{this.state.endDate}_{this.state.projectName}_{this.state.firstName} </h5>
        <div className="clearfix  align-items-center row page-title">
      
          <div className="col text-right" />
        </div>

        <form action="" style={{margin:"auto",border:"black 1px solid"}}>
     
            <div className="col-md-12 order-md-first">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="Name">
                    <b>Name</b>
                    </label>
                    <div>
                      <input
                        id="userName"
                        type="text"
                        className="form-control"
                        readOnly
                        value={this.state.firstName +' '+ this.state.lastName}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="kraName">
                      <b>KRA Name</b>
                    </label>
                    <div>
                      <input
                        id="kraName"
                        type="text"
                        className="form-control "
                        readOnly
                        value={this.state.kraName}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="projectName">
                      <b>Project Name</b>
                    </label>
                    <div>
                      <input
                        id="projectName"
                        type="text"
                        className="form-control "
                        readOnly
                        value={this.state.projectName}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userEmail">
                     <b> Start Date</b>
                    </label>
                    <div>
                      <input
                        id="userEmail"
                        type="email"
                        className="form-control"
                        readOnly
                        value={this.state.startDate}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userAddress">
                     <b> End Date</b>
                    </label>
                    <div>
                      <input
                        id="userAddress"
                        type="text"
                        className="form-control"
                        readOnly
                        value={this.state.endDate}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="" htmlFor="userImage">
                     <b> Department Name</b>
                    </label>
                    <div>
                      <input
                        id="userLastName"
                        type="text"
                        className="form-control "
                        readOnly
                        value={this.state.departmentName}
                      />
                    </div>
                  </div>
                </div>
              </div>
             </div>
        </form>
        <br/>
        <h5><p style={{textAlign:"center"}}> KRA {this.state.kraName}</p></h5>
        <div className="clearfix d-flex align-items-center row page-title">
            {/* <h2 className="col">{ModuleNames.Role}</h2> */}
            {/* <div className="col text-right">
                <Link to={{ pathname: '/addRole', state: {} }} className="btn btn-primary"><i className="fa fa-plus" aria-hidden="true"></i></Link>
            </div> */}
            {/* <button type="button"
                className="btn btn-danger btn-multi-delete"
                onClick={() => {
                    this.multiRoleDeleteConfirm();
                }}><i className="fa fa-trash" aria-hidden="true"></i></button> */}

       


        <table className="table table-striped table-bordered table-hover customDataTable" 
            id="kraSheet"
            ref={el => (this.el = el)}>
            <thead>
                <tr>
                    <th width="300px">KPI</th>
                    <th width="300px">Target</th>
                    <th width="150px">Weightage</th>
                    <th width="150px">Self Rating</th>
                    <th width="500px">Comments</th>
         
                </tr>
            </thead>
            <tbody></tbody>
        </table>

        </div>
    
            </div>
            //dataTable
           
        )
    }
}

export default KraSheet;