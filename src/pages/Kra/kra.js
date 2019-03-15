import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { environment, moduleUrls, Type, Notification, ModuleNames } from "../Environment";
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
        toast.success("KRA " + Notification.deleted, {
          position: toast.POSITION.TOP_RIGHT
        });
        this.$el.DataTable().ajax.reload();
      }
    });
    res.fail(error => {
      toast.error("KRA " + Notification.notdeleted, {
        position: toast.POSITION.TOP_RIGHT
      });
    });
  }

  DeleteKraApi(kraId) {
    // const endpoint = `http://192.168.10.109:3000/api/kra_master/${kraId}`;
    const deleteKra = environment.apiUrl + moduleUrls.Kra + "/" + `${kraId}`;
    return $.ajax({
      url: deleteKra,
      type: Type.deletetype,
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest"
      }
    });
  }
  multiDeleteKraApi(kraId) {
    const multiDelKra = environment.apiUrl + moduleUrls.Kra + '/bulk?_ids=' + `${kraId}`;
    return $.ajax({
      url: multiDelKra,
      type: Type.deletetype,
      headers: {
        "content-type": "application/json",
        "x-requested-with": "XMLHttpRequest",
      }
    });
  }
  checkall(e) {
    $("#kraDataList input:checkbox").each((index, item) => {
      if ($(e.currentTarget).is(":checked") === true) {
        $(item).prop("checked", true);
      } else {
        $(item).prop("checked", false);
      }
    });
  }

  DeleteAllKra(kraId) {
    var item = kraId.join(",")
    var res = this.multiDeleteKraApi(item);
    res.done((response) => {

      toast.success("Kra " + Notification.deleted, {
        position: toast.POSITION.TOP_RIGHT
      });
      this.$el.DataTable().ajax.reload();
    });
    res.fail(error => {
    });
  }

  SingleDeleteConfirm(id) {
    if (id !== undefined) {
      bootbox.confirm({
        message: Notification.deleteConfirm,
        buttons: {
          confirm: {
            label: "Ok",
            className: "btn-success"
          },
          cancel: {
            label: "Cancel",
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
  multiKraDeleteConfirm() {
    var kraId = []
    $("#kraDataList input:checkbox:checked").each((e, item) => {
      if (item.name != "checkAll") {
        kraId.push(item.value);
      }

    });
    if (kraId.length > 0) {

      bootbox.confirm({
        message: Notification.deleteConfirm,
        buttons: {
          confirm: {
            label: 'Ok',
            className: 'btn-success'
          },
          cancel: {
            label: 'Cancel',
            className: 'btn-danger'
          }
        },
        callback: (result) => {
          if (result === true) {
            this.DeleteAllKra(kraId);
          }
          else {

          }
        }
      });
    }
    else {
      toast.info(Notification.selectOneRecord);
    }


  }
  //192.168.10.109:3000/api/modulename?_sort=-fieldname
  componentDidMount() {
    this.$el = $(this.el);
    const endpointGET = environment.apiUrl + moduleUrls.Kra + '/?_size=1000' + '&_sort=-kraId'
    this.$el.DataTable({
      autoWidth: false,
      aaSorting: [[0, "asc"]],
      
      ajax: {
        url: endpointGET,
        // url: "http://180.211.103.189:3000/api/kra_master/",
        type: "GET",
        dataSrc: "",
        error: function (xhr, status, error) { }
      },

      columnDefs: [
        { width: '5%', targets: 0 },
        { width: '20%', targets: 1 },
        { width: '65%', targets: 2 },
        { width: '10%', targets: 3 },

      ],

      columns: [
        {
          data: "kraId",
          orderable: false,
          targets: 0,
          render: function (data, type, row) {
            return (
              '<label class="checkbox">' +
                  '<input type="checkbox" name="kraId" value="' + row.kraId + '" />' +
                  '<i></i> '+
                '</label>'
              
            );
          }
        },
        // {
        //   data: null,
        //   targets: 1,
        //   orderable: false
        // },
        {
          data: "kraName",
          targets: 1
        },
        {
          data: "description",
          targets: 2,
          orderable: false
        },

        {
          data: "action",
          className: "text-center",
          orderable: false,
          targets: 3,
          render: function (data, type, row) {
            return (
              '<a href="/kra/edit/id=' +
              row.kraId +
              '"class="btn mr-2 btn-edit btn-info btn-sm">' +
              '<i class="fa fa-pencil" aria-hidden="true"></i>' +

              '<a href="#" id="' +
              row.kraId +
              '"class="btn delete btn-danger btn-sm btnDelete">' +
              '<i class="fa fa-trash" aria-hidden="true"></i>' +
              "</a>"
            );
          }
        }
      ],
      //   "createdRow": function (row, data, index) {

      //     $('td', row).eq(1).html(index + 1 );
      // },

      // fnRowCallback: function (nRow, aData, iDisplayIndex) {
      //   $("td:eq(1)", nRow).html(iDisplayIndex + 1);
      //   return nRow;

      initComplete: (settings, json) => {
        //;
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
          <h2 className="col">{ModuleNames.kra}</h2>
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
            <tr className="container-fluid">
              <th width="20">
                <label className="checkbox">
                  <input type="checkbox" name="checkAll" onClick={e => { this.checkall(e); }} />
                  <i></i>
                </label>
              </th>
              <th>Name</th>
              <th>Description</th>
              <th>Action</th>
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
