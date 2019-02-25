import React,{Component} from 'react';

class Dashboard extends Component{
    render(){
        debugger;
        return(
            <div>
                <h1>Welcome To Dashboard {localStorage.getItem('firstName')} </h1>
      
            </div>
        )
    }
}
export default Dashboard;