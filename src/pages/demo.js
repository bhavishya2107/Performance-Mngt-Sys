import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import bootbox from 'bootbox';

const baseURL = 'http://192.168.10.109:3000/api/department_master/';

//import logo from './logo.svg';
//import './app.css';


class demo extends Component {
    success = () => {
        toast.success("Success Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    error = () => {
        toast.error("Error Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    warn = () => {
        toast.warn("Warning Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    };
    info = () => {
        toast.info("Info Notification !", {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            RedirectToDept: false,
            depId: 0,
            depName: "",
            description: "",
            isAdd: false
            // createdBy: 2,
            // createdOn: "null",
            // modifiedBy: 2,
            // modifiedOn: "null"
        }
    }
    replaceModelItem(id) {
        this.setState({
            isAdd: false,

        })
        $.ajax({
            url: baseURL + id,
            type: "get",
            success: (resultData) => {
                this.setState({
                    depId: resultData[0].depId,
                    depName: resultData[0].depName,
                    description: resultData[0].description
                })
            },
            error: function (error) {
                
            },
        });

    }
    editData(data) {
        var result = window.formValidation("#addDepartmentform");
        if (result) {
            var deptList =
            {
                "depId": data.depId,
                "depName": data.depName,
                "description": data.description,
            }
            $.ajax({
                url: baseURL + data.depId,
                type: "post",
                data: JSON.stringify(deptList),
                success: (data) => {
                    toast.success("Data Update Successfully !", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    $('.modal').modal('hide')
                    this.$el.DataTable().ajax.reload()
                },
                error: function (error) {
                    console.log(error)
                    toast.error("Error !", {
                        position: toast.POSITION.TOP_RIGHT
                    });

                },
            });
        } else {
            return false;
        }
    }

    deleteData(Id) {
        $.ajax({
            url: baseURL + Id,
            type: "DELETE",
            success: (data) => {
                toast.info("Data Delete Successfully !", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.$el.DataTable().ajax.reload()
            },
            error: function (error) {
                console.log(error)
                toast.error("Error !", {
                    position: toast.POSITION.TOP_RIGHT
                });

            },
        });

    }

 DeleteAlbum() {
    $("#tblAlbumList input:checkbox:checked").each((e, item) => {
      this.state.selectedIds.push(item.value);
    });
    if (this.state.selectedIds.length > 0) {
      this.state.selectedIds.map(item => {
        var res = this.DeleteAlbumApi(item);
        res.done(response => {
          alert("data deleted Successfully.");
        });
        res.fail(error => {});
      });
    } else {
      alert("please select atleast one record!");
    }
  }

  checkall(e) {
    $("#tblAlbumList input:checkbox").each((index, item) => {
      if ($(e.currentTarget).is(":checked") === true) {
        $(item).prop("checked", true);
      } else {
        $(item).prop("checked", false);
      }
    });
  }


    addData(data) {
        var result = window.formValidation("#addDepartmentform");
        if (result) {
            var deptList =
            {
                "depName": data.depName,
                "description": data.description,
            }
            $.ajax({
                url: baseURL,
                type: "POST",
                data: deptList,
                success: (result) => {
                    $('.modal').modal('hide')
                    toast.success("Data Add Successfully !", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.$el.DataTable().ajax.reload()
                }

            });
        } else {
            return false;
        }





    }
    validationDemo() {
        var result = window.formValidation("#validationDemo");
        if (result) {
            alert("Success")
        } else {
            return false;
        }
    }
    componentDidMount() {

        $(document).on("click", ".confirmDelete", (e) => {
            var id = e.currentTarget.id;
            bootbox.confirm({
                message: "Delete this record ?",
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-success'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-danger'
                    }
                },
                callback: (result) => {
                    if (result === true) {
                        this.deleteData(id);
                    }
                    else {

                    }
                }
            });
        });

        this.$el = $(this.el);
        this.$el.DataTable({
            "autoWidth": false,
            aaSorting: [[1, 'asc']],
            ajax: {
                url: baseURL,
                type: "get",
                dataSrc: "",
                error: function (xhr, status, error) {

                },

            },
            columns: [
                {
                    data: "",
                    "orderable": false, "targets": 0,
                    render: (data, type, row) => {
                        return (
                            '<input type="checkbox" id="' + row.depId + '" />'
                        )
                    },
                },
                {
                    data: "depName",
                    targets: 1,
                },

                {
                    data: "description",
                    targets: 2,
                },
                {
                    data: "depId",
                    "orderable": false,
                    targets: 3,
                    render: (data, type, row) => {
                        return (
                            '<button data-toggle="modal" class="btn mr-2 btn-edit btn-info btn-sm" data-target="#editModal" id="' + row.depId + '">' + '<i class="fa fa-pencil" aria-hidden="true"></i>' + "</button>" +
                            '<a class="btn mr-2 delete btn-danger btn-sm confirmDelete" href="javascript:void(0);" id="' + row.depId + '">' + '<i class="fa fa-trash" aria-hidden="true"></i>' + "</a>"
                        )

                    },
                }
            ],
            // "infoCallback": ( settings, json ) =>{
            //     $('.btn-edit').on('click', (e) => {
            //         this.replaceModelItem(e.currentTarget.id);
            //     })
            //   },
            "initComplete": (settings, json) => {
                $('.btn-edit').on('click', (e) => {
                    this.replaceModelItem(e.currentTarget.id);
                })
            },

        })

    }
    render() {
        return (
            <div className="clearfix">
                <div className="text-right mb-2">
                    <a href="#editModal" data-toggle="modal" onClick={() => {
                        this.setState({
                            isAdd: true,
                            depName: "",
                            description: "",
                        })
                    }} className="btn btn-primary btn-sm">Add</a>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">

                        <table className="table table-striped table-bordered table-hover"
                            ref={el => (this.el = el)}>
                            <thead>
                                <tr>
                                    <th width="25"><input type="checkbox" id="deleteAll" /></th>
                                    <th>Department Name</th>
                                    <th>description</th>
                                    <th width="90">Action</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                    <div id="editModal" className="modal" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    {this.state.isAdd ? <h5 className="modal-title">Add model</h5> : <h5 className="modal-title">Edit modal</h5>}
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form id="addDepartmentform">
                                        <div className="form-group">
                                            <label className="required">Department Name</label>
                                            <input className="form-control" type="text" name="departmrntName" required value={this.state.depName} onChange={(e) => {
                                                this.setState({
                                                    depName: e.currentTarget.value
                                                })
                                            }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="required">Description</label>
                                            <textarea className="form-control" cols="3" name="description" required value={this.state.description} onChange={(e) => {
                                                this.setState({
                                                    description: e.currentTarget.value
                                                })
                                            }}></textarea>
                                        </div>
                                    </form>
                                </div>

                                <div className="modal-footer">
                                    {this.state.isAdd ? <button type="button" className="btn btn-primary" onClick={() => { this.addData(this.state) }}>Save changes</button> :
                                        <button type="button" className="btn btn-primary" onClick={() => { this.editData(this.state) }}>Edit changes</button>}
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-3">
                        <h3>Form Group</h3>
                        <form id="validationDemo">
                            <div className="form-group">
                                <label className="required">Example label</label>
                                <input type="text" name="Example" className="form-control" minLength="3" placeholder="Example input" required />
                            </div>
                            <div className="form-group">
                                <label className="required">Another label</label>
                                <input type="text" name="another" className="form-control" placeholder="Another input" required />
                            </div>
                            <div className="form-group">
                                <label className="required">Select</label>
                                <select className="form-control" required name="select">
                                    <option value="">Select</option>
                                    <option value="1">Select</option>
                                    <option value="2">Select</option>
                                </select>
                            </div>
                        </form>
                        <button className="btn btn-primary" onClick={() => { this.validationDemo() }}>Check validation</button>
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
                        <ul className="list-group">
                            <li className="list-group-item">Cras justo odio</li>
                            <li className="list-group-item">Dapibus ac facilisis in</li>
                            <li className="list-group-item">Morbi leo risus</li>
                            <li className="list-group-item">Porta ac consectetur ac</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h3>Modal</h3>
                        <a href="#editModal" data-toggle="modal" className="btn btn-primary btn-sm">Modal</a>
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <div className="col-xl-5 col-lg-6 col-md-5 col-sm-8">
                        <h3>Form Center Align</h3>
                        <form>
                            <div className="form-group">
                                <label>Example label</label>
                                <input type="text" className="form-control" placeholder="Example input" />
                            </div>
                            <div className="form-group">
                                <label>Another label</label>
                                <input type="text" className="form-control" placeholder="Another input" />
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
                <div className="d-flex justify-content-between mb-5">
                    <div className="col">1</div>
                    <div className="col">2</div>
                    <div className="col">
                        <button className="btn btn-danger confirm">confirm</button>
                        <button onClick={this.success} className="btn btn-success ml-2">Success</button>
                        <button onClick={this.error} className="btn btn-danger ml-2">Error</button>
                        <button onClick={this.warn} className="btn btn-warning ml-2">Warning</button>
                        <button onClick={this.info} className="btn btn-info ml-2">Info</button>
                        <ToastContainer />
                    </div>
                </div>
            </div>
        )
    }
}

export default demo;