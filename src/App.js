import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

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
import kraHome from './pages/add-kra';
import kraListPage from './pages/kra';
import UserRolePMS from './pages/role';
import UserRoleForm from './pages/addRole';

import UserManagement from './pages/User Management';
import AddUser from './pages/AddUser'
import Department from './pages/Department';
import AddDept from './pages/AddDept'
import Projects from './pages/Projects';
import AddProject from './pages/AddProject';
import AddKpi from './pages/AddKpi';
import KPI from './pages/KPI';

import ProjectComplexity from './pages/ProjectComplexity';
import AddProjectComplexity from './pages/AddProjectComplexity';
import '../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css';
import Templatelist from './pages/Template/templateList';
import Scaleset from './pages/Scale-set/addscaleset';
import Scalesetlist from './pages/Scale-set/scale-set';
import Jobtitlelist from './pages/Job-title/job-title';
import Jobtitle from './pages/Job-title/addjobtitle';
import Addtemplate from './pages/Template/addtemplate';
import MyProfile from './pages/myProfile';

class App extends Component {

  render() {
    var urlData = window.location.pathname;
    if (urlData === "/") {
      return (
        <Router>
          <div className="container-fluid h-100 bg-light">
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="col-lg-4 col-md-6 col-sm-8 col-12 mt-2 mb-2">
                <Switch>
                  <Route exact path="/" component={Login} />
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
                <Sidebar />
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
                        <Route  path="/KPI" component={KPI}/>
                        <Route exact path="/EditKpi/id=:id" component={AddKpi} />
                        <Route exact path="/AddKpi" component={AddKpi} />

                        <Route path="/ProjectComplexity" component={ProjectComplexity}/>
                         <Route exact path="/EditProjectComplexity/id=:id" component={AddProjectComplexity} />
                        <Route exact path="/AddProjectComplexity" component={AddProjectComplexity} />
                        
                        <Route path="/Projects" component={Projects} />
                        <Route exact path="/EditProject/id=:id" component={AddProject} />
                        <Route exact path="/AddProject" component={AddProject} />
                      


                      
                      
                        <Route
                          path="/UserManagement"
                          component={UserManagement}
                        />
                        <Route
                          path="/demo"
                          component={Demo}
                        />

                        <Route
                          path="/AddUser"
                          component={AddUser}
                        />
                        <Route
                          path="/Department"
                          component={Department}
                        />
                        <Route
                          path="/AddDept"
                          component={AddDept}
                        />
                        
                        <Route path="/user-management" component={UserManagement} />
                        <Route path="/Add-User" component={AddUser} />
                        <Route path="/EditUser/userId=:userId" component={AddUser} />
                        <Route path="/Department" component={Department} />
                        <Route path="/EditDept/depId=:depId" component={AddDept} />
                        <Route path="/Add-Dept" component={AddDept} />

                        <Route path="/AddProject" component={AddProject} />
                        
                        
                        <Route path="/innerpage" component={innerpage} />
                        <Route path="/add-kra" component={kraHome}></Route>
                        <Route path="/kra" component={kraListPage}></Route>
                        <Route path="/role" component={UserRolePMS}></Route>
                        <Route path="/addRole" component={UserRoleForm}></Route>
                        <Route path="/templateList" component={Templatelist}></Route>
                        <Route path="/Editkra/id=:id" component={kraHome}></Route>
                        <Route path="/EditRoleForm/id=:id" component={UserRoleForm}></Route>
                        <Route exact path="/myProfile" component={MyProfile} />


                        <Route exact path="/scale-set/add" component={Scaleset} />
                        <Route exact path="/scale-set" component={Scalesetlist} />
                        <Route exact path="/job-title" component={Jobtitlelist} />
                        <Route exact path="/job-title/add" component={Jobtitle} />
                        <Route exact path="/addtemplate" component={Addtemplate} />
                        <Route exact path="/scale-set/edit/id=:id" component={Scaleset} />
                        <Route exact path="/job-title/edit/id=:id" component={Jobtitle} />        
                        <Route exact path="/Edittemplate/id=:id" component={Addtemplate} />
                       

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
}

export default App;
