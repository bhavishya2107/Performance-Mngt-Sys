function navigation() {
    var topOffset = 56;
    var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
    if (width < 991.85) {
        $('div.navbar-collapse').addClass('collapse');
        //topOffset = 100; // 2-row-menu
    } else {
        $('div.navbar-collapse').removeClass('collapse');
    }

    var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
    height = height - topOffset;
    if (height < 1) height = 1;
    if (height > topOffset) {
        $("#page-wrapper").css("min-height", (height) + "px");
    }

}

//...For Form validation
function formValidation(form) {
    jQuery.validator.setDefaults({
      debug: true,
      success: "valid"
    });
    $(form).validate(
        {
            rules:{
                kraName:{
                    required:true,
                    minlength:2,

                },
                kraDescription:{
                    required:true,
                   
                    minlength:2
                },
                rolename:{
                    required:true,
                    minlength:2
                },
                messages:{
                    kraName:{
                        required:'required, Enter minimum 2 characters',
                    },
                    kraDescription:{
                        required:'required max 50 character',
                    },
                    rolename:{
                        required:'required,Enter minimum 2 characters',
                    }
                }
            }
        }
    );
    return $(form).valid();
  }
function smallTable(){
    var headertext = [],
    headers = document.querySelectorAll(".customDataTable th"),
    tablerows = document.querySelectorAll(".customDataTable th"),
    tablebody = document.querySelector(".customDataTable tbody");

        for (var i = 0; i < headers.length; i++) {
            var current = headers[i];
            headertext.push(current.textContent.replace(/\r?\n|\r/, ""));
        }
        for (var i = 0, row; row = tablebody.rows[i]; i++) {
            for (var j = 0, col; col = row.cells[j]; j++) {
                col.setAttribute("data-th", headertext[j]);
            }
        }     
}

$(document).ready(function () {
    navigation();

    $(".navbar-nav li a").click(function () {
        if ($('.navbar-collapse').hasClass("show")) {
            $('.navbar-collapse').addClass("collapse");
            $('.navbar-collapse').removeClass("show");
            $('.navbar-collapse').css('height', 'auto');
        }
        else {
            $('.navbar-collapse').removeClass("collapse");
            $('.navbar-collapse').addClass("in");
            $('.navbar-collapse').css('show', '0');
        }

        $('.navbar-collapse').css('height', '0');
    });
    $(document).on("click", ".confirm", function(e) {
        bootbox.confirm({
            message: "This is a confirm with custom button text and color! Do you like it?",
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
            callback: function (result) {
                console.log('This was logged in the callback: ' + result);
            }
        });
    });
})
$(window).resize(function () {
    navigation();
})