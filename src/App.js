import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Scrollbars } from 'react-custom-scrollbars';

//import logo from './logo.svg';
//import './app.css';
import '../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import PrimaryHeader from './common/header';
import Sidebar from './common/sidebar';
import Breadcrumb from './common/breadcrumb';
import innerpage from './pages/innerpage';
import Login from './pages/login';
import Demo from './pages/demo';
import kraHome from './pages/Kra/add-kra';
import kraListPage from './pages/Kra/kra';
import UserRolePMS from './pages/Role/role';
import UserRoleForm from './pages/Role/addRole';

import UserManagement from './pages/user management/User Management';
import AddUser from './pages/user management/AddUser'
import Department from './pages/Department/Department';
import AddDept from './pages/Department/AddDept'
import Projects from './pages/Project/Projects';
import AddProject from './pages/Project/AddProject';
import AddKpi from './pages/KPI/AddKpi';
import KPI from './pages/KPI/KPI';

import ComplexityMaster from './pages/Complexity-Master/ComplexityMaster';
import AddComplexityMaster from './pages/Complexity-Master/AddComplexityMaster';
import Templatelist from './pages/Template/templateList';
import Scaleset from './pages/Scale-set/addscaleset';
import Scalesetlist from './pages/Scale-set/scale-set';
import Designationlist from './pages/Designation/designation';
import Designation from './pages/Designation/adddesignation';
import Addtemplate from './pages/Template/addtemplate';
import MyProfile from './pages/My-Profile/myProfile';



import '../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css';
import Dashboard from './pages/dashboard';
import ForgotPW from './pages/forgotPassword';
import ResetPW from './pages/resetPassword';
import ChangePW from './pages/changePassword';
import Quater from './pages/Quater/quater';
import ADDQuater from './pages/Quater/add-quater';

import Template from './pages/Assign-Template/Template';
import addAssignTemplate from './pages/Assign-Template/addAssignTemplate';
import Myteam from './pages/myteam';
import KraSheet from './pages/Kra/kraSheetDetails';


class App extends Component {
constructor(props){
super(props)

}
render() {
if(localStorage.getItem('isAuthenticated')){
    var urlData = window.location.pathname;
    if (urlData === "/" || urlData === "/forgotPassword" || urlData === "/resetPassword" || urlData === "/changePassword") {
      return (
        <Router>
          <div className="container-fluid h-100 bg-light">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-4 col-md-6 col-sm-8 col-12 mt-2 mb-2">
                <Switch>
                  <Route exact path="/" component={Login} />
                  <Route exact path="/forgotPassword" component={ForgotPW} />
                  <Route exact path="/resetPassword" component={ResetPW} />
                  <Route exact path="/changePassword" component={ChangePW} />
                </Switch>
              </div>
            </div>

          </div>
        </Router>
      );
    }
    else {
      return (
        <Router>
          <div className="">
            <PrimaryHeader />
            <div className="wrapper">
              <div className="left-sidebar navbar-collapse" id="navbarSupportedContent">
                <Scrollbars className="sidebar-custom-scroll"
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={200}>
                  <Sidebar />
                </Scrollbars>
              </div>
              <div className="content-block" id="page-wrapper">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-12 col-lg-12 col-md-12">
                      {/* <Breadcrumb /> */}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <Switch>
                        <Route
                          path="/innerpage"
                          component={innerpage}
                        />
                        <Route
                          path="/demo"
                          component={Demo}
                        />
                        <Route exact path="/KPI" component={KPI} />
                        <Route exact path="/KPI/editkpi/id=:id" component={AddKpi} />
                        <Route exact path="/KPI/add" component={AddKpi} />

                        <Route exact path="/complexity-master" component={ComplexityMaster} />
                        <Route exact path="/complexity-master/edit/id=:id" component={AddComplexityMaster} />
                        <Route exact path="/complexity-master/add" component={AddComplexityMaster} />

                        <Route exact path="/Projects" component={Projects} />
                        <Route exact path="/Project/editproject/id=:id" component={AddProject} />
                        <Route exact path="/Projects/add" component={AddProject} />

                        <Route path="/user-management" component={UserManagement} />
                        <Route path="/user-managemnet/add" component={AddUser} />
                        <Route path="/EditUser/userId=:userId" component={AddUser} />
                        <Route path="/Department" component={Department} />
                        <Route  path="/EditDept/departmentId=:departmentId" component={AddDept} />
                        {/* <Route exact path="/Department/add" component={AddDept} /> */}
                        <Route path="/AddDept" component={AddDept} />
                        <Route path="/AddProject" component={AddProject} />

                        <Route exact path="/Template" component={Template} />
                        <Route path="/addAssignTemplate" component={addAssignTemplate} />
                        <Route  path="/EditTemplate/assignId=:assignId" component={addAssignTemplate} />
                       


                        


                        <Route path="/innerpage" component={innerpage} />
                        <Route exact path="/kra/add" component={kraHome}></Route>
                        <Route path="/kra" component={kraListPage}></Route>
                        <Route path="/kraSheetDetails" component={KraSheet}></Route>
                        <Route path="/role" component={UserRolePMS}></Route>
                        <Route path="/addRole" component={UserRoleForm}></Route>
                        <Route path="/quater" component={Quater}></Route>
                        <Route path="/add-quater" component={ADDQuater}></Route>
                        <Route path="/EditQuaterForm/id=:id" component={ADDQuater}></Route>
                    
                        <Route path="/templateList" component={Templatelist}></Route>
                        <Route path="/Editkra/id=:id" component={kraHome}></Route>
                        <Route path="/EditRoleForm/id=:id" component={UserRoleForm}></Route>
                        <Route exact path="/myProfile" component={MyProfile} />
                        <Route path="/dashboard" component={Dashboard} />              
                     


                        <Route exact path="/scale-set/add" component={Scaleset} />
                        <Route exact path="/scale-set" component={Scalesetlist} />
                        <Route exact path="/designation" component={Designationlist} />
                        <Route exact path="/designation/add" component={Designation} />
                        <Route exact path="/addtemplate" component={Addtemplate} />
                        <Route exact path="/scale-set/edit/id=:id" component={Scaleset} />
                        <Route exact path="/designation/edit/id=:id" component={Designation} />
                        <Route exact path="/Edittemplate/id=:id" component={Addtemplate} />
                        <Route exact path="/myteam" component={Myteam}></Route>
                      </Switch>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </Router>
      );
    }
  }
    else{
      return(
      <Router>
      <div className="container-fluid h-100 bg-light">
        <div className="d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-4 col-md-6 col-sm-8 col-12 mt-2 mb-2">
            <Switch>
            <Route exact path="/forgotPassword" component={ForgotPW} />
            <Route exact path="/resetPassword" component={ResetPW} />
            <Login/>
            </Switch>
        

          </div>
        </div>
      </div>
    </Router>
      )
    }
  }
}
export default App;
