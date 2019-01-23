import React, { Component } from 'react';
//import logo from './logo.svg';
//import './app.css';


class innerpage extends Component {
    render() {
        return (
            <div className="">
                <div className="page-header">
                    <h1>Buttons Large</h1>
                </div>
                <div className="d-flex row">
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-primary">btn-primary</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-success">btn-success</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-info">btn-info</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-warning">btn-warning</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-danger">btn-danger</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-lalji">btn-lalji</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-custom-color">btn-custom</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lg btn-link">btn-link</button>
                    </div>
                </div>
                <div className="page-header">
                    <h1>Buttons Default</h1>
                </div>
                <div className="d-flex row">
                    <div className="col">
                        <button type="button" className="btn btn-block btn-primary">btn-primary</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-success">btn-success</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-info">btn-info</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-warning">btn-warning</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-danger">btn-danger</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-lalji">btn-lalji</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-custom-color">btn-custom</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-link">btn-link</button>
                    </div>
                </div>
                <div className="page-header">
                    <h1>Buttons Small</h1>
                </div>
                <div className="d-flex row">
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-primary">btn-primary</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-success">btn-success</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-info">btn-info</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-warning">btn-warning</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-danger">btn-danger</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-lalji">btn-lalji</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-custom-color">btn-custom</button>
                    </div>
                    <div className="col">
                        <button type="button" className="btn btn-block btn-sm btn-link">btn-link</button>
                    </div>
                </div>
                <div className="page-header">
                    <h1>Table</h1>
                </div>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">First</th>
                            <th scope="col">Last</th>
                            <th scope="col">Handle</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th scope="row">1</th>
                            <td>Mark</td>
                            <td>Otto</td>
                            <td>@mdo</td>
                        </tr>
                        <tr>
                            <th scope="row">2</th>
                            <td>Jacob</td>
                            <td>Thornton</td>
                            <td>@fat</td>
                        </tr>
                        <tr>
                            <th scope="row">3</th>
                            <td>Larry the Bird</td>
                            <td>Thornton</td>
                            <td>@twitter</td>
                        </tr>
                    </tbody>
                </table>
                <div className="page-header">
                    <h1>Badges</h1>
                </div>
                <h1>Example heading <span className="badge badge-secondary">New</span></h1>
                <h2>Example heading <span className="badge badge-primary">New</span></h2>
                <h3>Example heading <span className="badge badge-success">New</span></h3>
                <h4>Example heading <span className="badge badge-info">New</span></h4>
                <h5>Example heading <span className="badge badge-warning">New</span></h5>
                <h6>Example heading <span className="badge badge-danger">New</span></h6>


                <div className="page-header">
                    <h1>Dropdown menus</h1>
                </div>
                <div className="btn-group">
                    <button type="button" className="btn btn-danger">Action</button>
                    <button type="button" className="btn btn-danger dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu">
                        <a className="dropdown-item" href="lalji">Action</a>
                        <a className="dropdown-item" href="lalji">Another action</a>
                        <a className="dropdown-item" href="lalji">Something else here</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="lalji">Separated link</a>
                    </div>
                </div>


                <div className="page-header">
                    <h1>Navs</h1>
                </div>
                <ul className="nav">
                    <li className="nav-item">
                        <a className="nav-link active" href="lalji">Active</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="lalji">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="lalji">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="lalji">Disabled</a>
                    </li>
                </ul>


                <div className="page-header">
                    <h1>Navbars</h1>
                </div>

                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <a className="navbar-brand" href="lalji">Navbar</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item active">
                                <a className="nav-link" href="lalji">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="lalji">Features</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="lalji">Pricing</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="lalji">Disabled</a>
                            </li>
                        </ul>
                    </div>
                </nav>

                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand" href="lalji">Hidden brand</a>
                        <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                            <li className="nav-item active">
                                <a className="nav-link" href="lalji">Home <span className="sr-only">(current)</span></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="lalji">Link</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link disabled" href="lalji">Disabled</a>
                            </li>
                        </ul>
                        <form className="form-inline my-2 my-lg-0">
                            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
                        </form>
                    </div>
                </nav>


                <div className="page-header">
                    <h1>Alerts</h1>
                </div>
                <div className="alert alert-success" role="alert">
                    <strong>Well done!</strong> You successfully read this important alert message.
      </div>
                <div className="alert alert-info" role="alert">
                    <strong>Heads up!</strong> This alert needs your attention, but it's not super important.
      </div>
                <div className="alert alert-warning" role="alert">
                    <strong>Warning!</strong> Best check yo self, you're not looking too good.
      </div>
                <div className="alert alert-danger" role="alert">
                    <strong>Oh snap!</strong> Change a few things up and try submitting again.
      </div>


                <div className="page-header">
                    <h1>Progress bars</h1>
                </div>



                <div className="page-header">
                    <h1>List groups</h1>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <ul className="list-group">
                            <li className="list-group-item">Cras justo odio</li>
                            <li className="list-group-item">Dapibus ac facilisis in</li>
                            <li className="list-group-item">Morbi leo risus</li>
                            <li className="list-group-item">Porta ac consectetur ac</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                        </ul>
                    </div>
                    <div className="col-sm-4">
                        <div className="list-group">
                            <a href="lalji" className="list-group-item active">
                                Cras justo odio
            </a>
                            <a href="lalji" className="list-group-item">Dapibus ac facilisis in</a>
                            <a href="lalji" className="list-group-item">Morbi leo risus</a>
                            <a href="lalji" className="list-group-item">Porta ac consectetur ac</a>
                            <a href="lalji" className="list-group-item">Vestibulum at eros</a>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="list-group">
                            <a href="lalji" className="list-group-item active">
                                <h4 className="list-group-item-heading">List group item heading</h4>
                                <p className="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                            </a>
                            <a href="lalji" className="list-group-item">
                                <h4 className="list-group-item-heading">List group item heading</h4>
                                <p className="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                            </a>
                            <a href="lalji" className="list-group-item">
                                <h4 className="list-group-item-heading">List group item heading</h4>
                                <p className="list-group-item-text">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
                            </a>
                        </div>
                    </div>
                </div>


                <div className="page-header">
                    <h1>Panels</h1>
                </div>
                <div className="row">
                    <div className="col-sm-4">
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                        <div className="card mb-3">
                            <img className="card-img-top" alt="" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20400%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_167824dad7d%20text%20%7B%20fill%3A%23555%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A40pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_167824dad7d%22%3E%3Crect%20width%3D%22800%22%20height%3D%22400%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22285.921875%22%20y%3D%22217.7%22%3EFirst%20slide%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" />
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                                <a href="lalji" className="btn btn-primary">Go somewhere</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="page-header">
                    <h1>Wells</h1>
                </div>
                <div className="well">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed diam eget risus varius blandit sit amet non magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Cras mattis consectetur purus sit amet fermentum. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Aenean lacinia bibendum nulla sed consectetur.</p>
                </div>
            </div>

        );
    }
}

export default innerpage;

