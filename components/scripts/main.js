$( document ).ready(function() {
	$(".toggle-panel").click(function(){
		var panelId= $(this).attr('href');
		var parentAccordian = $(this).attr('data-parent');
		console.log(parentAccordian);
		$(parentAccordian+" > .panel").removeClass("expand");
		if($(panelId).hasClass("in")){
			$(panelId).parent().removeClass("expand");
		}else{
			$(panelId).parent().addClass("expand");
		}
	})

    $("#connection-list-1 .next-btn").click(function(){
    	var header = $("#connection-list .header-2");
    	header.addClass("activated");
    	header.parent().removeClass("not-active");
    	$("#connection-list-1").parent().removeClass("expand");
    	$("#connection-list-2").parent().addClass("expand");
    })

    $("#connection-list-2 .next-btn").click(function(){
    	var header = $("#connection-list .header-3");
    	header.addClass("activated");
    	header.parent().removeClass("not-active");
    	$("#connection-list-2").parent().removeClass("expand");
    	$("#connection-list-3").parent().addClass("expand");
    })

    $("#connection-list-3 .done-btn").click(function(){
    	var header = $("#connection-list .header-3");
    	header.addClass("activated");
    	header.parent().removeClass("not-active");
    	$("#connection-list-3").parent().removeClass("expand");
    	$(".connection").removeClass("not-active");
    })

    $('.steps').tooltip()
    $('input[type=file]').bootstrapFileInput();
});
