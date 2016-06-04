$(document).ready(function() {
  $(document).on('mouseover mouseout', "a", "div", function(e) {
  	var href = $(this).attr('href');
			if (!href || href == '#') {
				return;
			}
    $("a", "div")
      .filter('[href="' + $(this).attr('href') + '"]')
      .toggleClass("hover", e.type == 'mouseover');
  });
});
