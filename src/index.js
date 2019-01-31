import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import "../node_modules/jquery/dist/jquery";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle";
import '../node_modules/bootbox/bootbox.js'
import $ from 'jquery';
import bootbox from 'bootbox';


import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
window.jQuery = $;
window.$ = $;
window.bootbox = bootbox;

//import "./js/custom";
//import './js/custom.js';


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
