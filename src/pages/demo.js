import React, { Component } from 'react';
//import logo from './logo.svg';
//import './app.css';


class demo extends Component {
    render() {
        return (
            <div className="clearfix">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <h3>Form Group</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput">Example label</label>
                                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Example input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput2">Another label</label>
                                <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Another input" />
                            </div>
                        </form>
                    </div>
                    <div className="col-md-5">
                        <h3>Form Inline</h3>
                        <form className="form-inline">
                            <div className="form-group mb-2">
                                <label htmlFor="staticEmail2" className="sr-only">Email</label>
                                <input type="text" readOnly className="form-control-plaintext" id="staticEmail2" value="email@example.com" />
                            </div>
                            <div className="form-group mx-sm-3 mb-2">
                                <label htmlFor="inputPassword2" className="sr-only">Password</label>
                                <input type="password" className="form-control" id="inputPassword2" placeholder="Password" />
                            </div>
                            <button type="submit" className="btn btn-primary mb-2">Confirm identity</button>
                        </form>
                    </div>
                    <div className="col-md-4">
                        <h3>Form</h3>
                        <form>
                            <div className="row">
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="First name" />
                                </div>
                                <div className="col">
                                    <input type="text" className="form-control" placeholder="Last name" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <h3>Addon Input</h3>
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">@</span>
                            </div>
                            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
                        </div>

                    </div>
                    <div className="col-md-4">
                        <h3>List</h3>
                        <ul class="list-group">
                            <li class="list-group-item">Cras justo odio</li>
                            <li class="list-group-item">Dapibus ac facilisis in</li>
                            <li class="list-group-item">Morbi leo risus</li>
                            <li class="list-group-item">Porta ac consectetur ac</li>
                            <li class="list-group-item">Vestibulum at eros</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h3>Modal</h3>
                        <a href="#basicModal" data-toggle="modal" className="btn btn-primary btn-sm">Modal</a>
                        <div id="basicModal" class="modal" tabindex="-1" role="dialog">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title">Modal title</h5>
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div class="modal-body">
                                        <p>Modal body text goes here.</p>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-primary">Save changes</button>
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="col-xl-5 col-lg-6 col-md-5 col-sm-8">
                        <h3>Form Center Align</h3>
                        <form>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput">Example label</label>
                                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Example input" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="formGroupExampleInput2">Another label</label>
                                <input type="text" className="form-control" id="formGroupExampleInput2" placeholder="Another input" />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-md-4">
                        <h3>Text Align</h3>
                        <div><code>Text Align right <kbd>.text-right</kbd></code></div>
                        <div><code>Text Align center <kbd>.text-center</kbd></code></div>
                        <div><code>Text Align left <kbd>.text-left</kbd></code></div>
                    </div>
                    <div className="col-md-4">

                        <h3>Box Align</h3>
                        <div className="clearfix">
                            <div className="float-left">
                                box Left
                            </div>
                            <div className="float-right">
                                box Right
                            </div>
                        </div>
                        <p>fdsfsdaf</p>
                    </div>
                </div>
           <div className="d-flex justify-content-between">
            <div className="col">1</div>
            
            
            <div className="col">2</div>
            <div className="col">
            <a href="javascript:void(0);" className="btn btn-danger confirm">confirm</a>
            </div>
           </div>
            </div>
        )
    }
}

export default demo;