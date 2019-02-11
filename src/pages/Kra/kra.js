import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { environment } from "../Environment";
import bootbox from "bootbox";
const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");

class kraListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.match.params.id,
      kraId: "",
      selectedIds: []
    };
  }
  //#region delete kra on click delete icon
  SingleKraDelete(kraId) {
    var res = this.DeleteKraApi(kraId);
    res.done(response => {
      if (response.affectedRows > 0) {
        toast.success("Role Deleted Successfully", {
          position: toast.POSITION.TOP_RIGHT
        });
        this.$el.DataTable().ajax.reload();
      }
    });
    res.fail(error => {
      toast.error("KRA Not Deleted !", {
        position: toast.POSITION.TOP_RIGHT
      });
    });
  }

  DeleteKraApi(kraId) {
    // const endpoint = `http://192.168.10.109:3000/api/kra_master/${kraId}`;
    const endpoint = environment.apiUrl + "kra_master/" + `${kraId}`;
    return $.ajax({
      url: endpoint,
      type: "DELETE",
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      }
    });
  }
  //#endregion

  checkall(e) {
    $("#kraDataList input:checkbox").each((index, item) => {
      if ($(e.currentTarget).is(":checked") === true) {
        $(item).prop("checked", true);
      } else {
        $(item).prop("checked", false);
      }
    });
  }

  DeleteAllKra() {
    $("#kraDataList input:checkbox:checked").each((e, item) => {
      this.state.selectedIds.push(item.value);
    });
    var res = "";

    if (this.state.selectedIds.length > 0) {
            this.state.selectedIds.map(item => {
              res = this.DeleteKraApi(item);
            });
            res.done(response => {
              toast.success("Kra Deleted Successfully !", {
                position: toast.POSITION.TOP_RIGHT
              });
              this.$el.DataTable().ajax.reload();
            });
            res.fail(error => {

            });
          
    } else {
      toast.info("please select atleast one record!");
    
    }
  }

  SingleDeleteConfirm(id) {
    if (id !== undefined) {
      bootbox.confirm({
        message: "Delete this record ?",
        buttons: {
          confirm: {
            label: "Yes",
            className: "btn-success"
          },
          cancel: {
            label: "No",
            className: "btn-danger"
          }
        },
        callback: result => {
          if (result === true) {
            this.SingleKraDelete(id);
          } else {
          }
        }
      });
    }
  }
  multiKraDeleteConfirm(id) {
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
              this.DeleteAllKra(id);
          }
      }
  });
  }

  componentDidMount() {
    this.$el = $(this.el);
    const endpointGET = environment.apiUrl + "kra_master/";
    this.$el.DataTable({
      autoWidth: false,
      aaSorting: [[1, "asc"]],
      aaSorting: [[2, "asc"]],
      ajax: {
        url: endpointGET,
        // url: "http://180.211.103.189:3000/api/kra_master/",
        type: "GET",
        dataSrc: "",
        error: function(xhr, status, error) {}
      },
      columns: [
        {
          data: "kraId",
          orderable: false,
          targets: 0,
          render: function(data, type, row) {
            return (
              '<input type="checkbox" name="kraId" value=' + row.kraId + ">"
            );
          }
        },
        {
          data: null,
          targets: 1,
          orderable: false
        },
        {
          data: "kraName",
          targets: 2
        },
        {
          data: "description",
          targets: 3
        },

        {
          data: "action",
          orderable: false,
          targets: 4,
          render: function(data, type, row) {
            return (
              '<a href="/Editkra/id=' +
              row.kraId +
              '"class="btn mr-2 btn-edit btn-info btn-sm">' +
              '<i class="fa fa-pencil" aria-hidden="true"></i>' +
              "&nbsp" +
              '<a href="#" id="' +
              row.kraId +
              '" class="btn mr-2 delete btn-danger btn-sm btnDelete">' +
              '<i class="fa fa-trash" aria-hidden="true"></i>' +
              "</a>"
            );
          }
        }
      ],
      fnRowCallback: function(nRow, aData, iDisplayIndex) {
        $("td:eq(1)", nRow).html(iDisplayIndex + 1);
        return nRow;
      },
      initComplete: (settings, json) => {
        //debugger;
        // $(".btnDelete").on("click", e => {
        //     this.SingleDeleteConfirm(e.currentTarget.id);
        // });
      },
      drawCallback: settings => {
        window.smallTable();
        $(".btnDelete").on("click", e => {
          this.SingleDeleteConfirm(e.currentTarget.id);
        });
      }
    });
  }
  render() {
    return (
      //#region list table kra
      <div>
        <div className="clearfix d-flex align-items-center row page-title">
          <h2 className="col">Kra</h2>
          <div className="col text-right">
            <Link
              to={{ pathname: "/kra/add", state: {} }}
              className="btn btn-primary "
            >
              <i className="fa fa-plus" aria-hidden="true" />
            </Link>
          </div>
          <button
            className="btn btn-danger btn-multi-delete btnDeleteAll"
            onClick={() => {
              this.multiKraDeleteConfirm();
            }}
          >
            <i className="fa fa-trash" aria-hidden="true" />
          </button>
        </div>
        <table
          className="table table-striped table-bordered table-hover customDataTable"
          id="kraDataList"
          ref={el => (this.el = el)}
        >
          <thead>
            <tr>
              <th width="20">
                <input
                  type="checkbox"
                  name="checkAll"
                  onClick={e => {
                    this.checkall(e);
                  }}
                />
              </th>
              <th width="50">Sr.No</th>
              <th>Name</th>
              <th>Description</th>
              <th width="90">Action</th>
            </tr>
          </thead>
        </table>
        <ToastContainer />
      </div>
      //#endregion
    );
  }
}

export default kraListPage;
