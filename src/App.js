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
import kraHome from './pages/kraHome';
import kraListPage from './pages/kraListPage';
import UserRolePMS from './pages/userRolePMS';
import UserRoleForm from './pages/userRoleForm';

import UserManagement from './pages/UserManagement';
import AddUser from './pages/AddUser'
import Department from './pages/Department';
import AddDept from './pages/AddDept'

import KPI from './KPI';
import AddKpi from './AddKpi';
import ProjectComplexityHome from './ProjectComplexityHome';
import AddProjectComplexity from './AddProjectComplexity';
import '../node_modules/datatables.net-bs4/css/dataTables.bootstrap4.css';
import TemplateList from './pages/templateList';




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
                      <Breadcrumb />
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
                        <Route
                          path="/AddKpi"
                          component={AddKpi}
                        />
                        <Route
                          path="/ProjectComplexityHome"
                          component={ProjectComplexityHome}
                        />
                        <Route
                          path="/AddProjectComplexity"
                          component={AddProjectComplexity}
                          component={Demo}/>
                          <Route
                          path="/UserManagement"
                          component={UserManagement}
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
                        <Route path="/innerpage" component={innerpage} />
                        <Route  path="/kraHome" component={kraHome}></Route>  
                        <Route  path="/kraListPage" component={kraListPage}></Route>  
                        <Route  path="/userRolePMS" component={UserRolePMS}></Route>  
                        <Route  path="/userRoleForm" component={UserRoleForm}></Route>  
                        <Route  path="/templateList" component={TemplateList}></Route>  
                        <Route  path="/Edit/id=:id" component={kraHome}></Route>
                        <Route  path="/EditForm/id=:id" component={UserRoleForm}></Route>

                        
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
