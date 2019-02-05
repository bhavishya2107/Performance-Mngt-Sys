// import React, { Component } from 'react';
// const $ = require('jquery');
// var templateData = []

// class AddProject extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             RedirectToSample: false,
//             displayProjectComplexity: "",
//             displayProjectStatus: "",
//             selectProjectComplexity: "",
//             selectProjectStatus: "",
//             templateDataTable: []
//         };
//     }
//     onChangeProjectComplexity(event) {
//         debugger;
//         this.setState({
//             selectProjectComplexity: event.target.value
//         })
//     }
//     onChangeProjectStatus(event) {
//         debugger;
//         this.setState({
//             selectProjectStatus: event.target.value
//         })
//     }
//     addtemplate() {
//         debugger;
//         var templateDataapi = {
//             "ProjectName": this.state.selectProjectComplexity,
//             "status": this.state.selectProjectStatus

//         }
//         templateData.push(templateDataapi)

//         this.setState({
//             templateDataTable: templateData
//         })
//         this.$el = $(this.el);
//         this.$el.DataTable({
//             datasrc: templateData,
//             data: templateData,
//             columns: [
//                 {
//                     data: "ProjectName",
//                     target: 0
//                 },
//                 {
//                     data: "status",
//                     target: 1
//                 },
//             ]

//         })
//     }
//     getProjectComplexityData() {
//         $.ajax({
//             type: 'GET',
//             url: 'http://192.168.10.109:3000/api/project_master/describe',
//             complete: (temp) => {
//                 console.log(temp);
//                 var temp = temp.responseJSON;
//                 var displayDataReturn = temp.map((i) => {
//                     return (
//                         <option value={i.ProjectName}>{i.ProjectName}</option>
//                     )
//                 });
//                 this.setState({
//                     displayProjectComplexity: displayDataReturn
//                 })
//             },
//         });
//     }
//     getProjectStatusData() {
//         $.ajax({
//             type: 'GET',
//             url: 'http://192.168.10.109:3000/api/project_master/describe',
//             complete: (temp) => {
//                 console.log(temp);
//                 var temp = temp.responseJSON;
//                 var displayDataReturn = temp.map((i) => {
//                     return (
//                         <option value={i.status}>{i.status}</option>
//                     )
//                 });
//                 this.setState({
//                     displayProjectStatus: displayDataReturn
//                 })
//             },
//         });
//     }

//     componentWillMount() {
//         this.getProjectComplexityData();
//         this.getProjectStatusData();

//     }
//     render() {
//         return (
//             <div>
//                 <form>
//                     <div className="form-group">
//                         <label>Project Name</label>
//                         <input className="form-control" value={this.state.projectTypeName}
//                             onChange={(event) => {
//                                 this.setState({
//                                     projectTypeName: event.target.value
//                                 })
//                             }} />
//                     </div>
//                     <div className="form-group">
//                         <label>Start Date</label>
//                         <input type="date" className="form-control" />
//                     </div>
//                     <div className="form-group">
//                         <label>End Date</label>
//                         <input type="date" className="form-control" />
//                     </div>
//                     <div className="dropdown">
//                         <label className="mr-2">Project Complexity:</label>
//                         <select onChange={(e) => { this.onChangeProjectComplexity(e) }} className="btn btn-info dropdown-toggle md mr-3">
//                             <option>select</option>
//                             {this.state.displayProjectComplexity}
//                         </select>
//                         <br /><br/>
//                         <label className="mr-2">Project Status:</label>
//                         <select onChange={(e) => { this.onChangeProjectStatus(e) }} className="btn btn-info dropdown-toggle md mr-3">
//                             <option>select</option>
//                             {this.state.displayProjectStatus}
//                         </select>
//                     </div>
//                 </form>
//             </div >
//         )
//     }
// }
// export default AddProject;
