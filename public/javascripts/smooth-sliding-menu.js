$(function() {
	$(document).bind("click",function(e){
		$('.nav li').each(function(){
			if(e.target != this){
				$(this).removeClass("open");
			}
		});
	});
	$('.nav li').on('click', function () {
		$(this).addClass("open");
	});
});
