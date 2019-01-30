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
            size: "small",
            title: "Your Title",
            message: "Your message here…", 
            callback: function(){ /* your callback code */ }
          })
    });
})
$(window).resize(function () {
    navigation();
})