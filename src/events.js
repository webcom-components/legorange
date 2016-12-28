var mode = "draw",
	color = "white",
	panel = $('#overlayPanel'),
	drawspace = $('.drawspace');

module.exports.mode = mode;
module.exports.color = color;


/* Disable the scroll of the drawspace when the panel is open */
module.exports.disableScroll = function(sc) {
	if (panel.hasClass('ui-panel-open') === false) {
		$('html').removeClass('showOverflow').addClass('hideOverflow');
		drawspace.removeClass('showOverflow').addClass('hideOverflow');
		$('#btn_dezoom').hide();
	} else {
		$('html').removeClass('hideOverflow').addClass('showOverflow');
		drawspace.removeClass('hideOverflow').addClass('showOverflow');
		if (sc === 2) {
			$('#btn_dezoom').show();
		}
	}
};

/* Manage the display mode in the off-canvas menu */
module.exports.change_mode = function(new_mode) {
	mode = new_mode;
	if (new_mode === "draw" || new_mode === "eraseAll") {
	    $(".ul-drawTools").attr("style", "height: 200px");
	    $(".drawTools-buttons-container").css("height", "50%");
	    $(".color-container").show();
  	}
  	else {
  	 	hide_colors();  // Hide the color section inside the panel
  	} 
  	module.exports.mode = new_mode;
  	return new_mode;
};

/* Hide the color section inside the panel */
hide_colors = function() {
	if (mode === "erase") {
	    $(".ul-drawTools").attr("style", "height: 100px");
	    $(".drawTools-buttons-container").css("height", "100%");
	    $(".color-list").hide();
    }
};
module.exports.hide_colors = hide_colors;

/* Highlight the active color inside the color section */
module.exports.color_active = function(elem) {
	$(".brickMenu").removeClass("active");
	elem.addClass("active");
	color = elem.attr('class').replace(/\s*(brickMenu|active)\s*/g, '');
	module.exports.color = color;
};

/* Function to trigger when the orientation is changed */
/* TODO : handle the display of orientation changing on all devices */

// module.exports.doOnOrientationChange = function() {
//     switch(window.orientation) {  
//       case -90:
//       case 90:
//         $(window).trigger('resize');
//         console.log('orientationchanged');
//         $('#overlayPanel').css('position', 'fixed');
//         break; 
//       default:
//         break; 
//     }
//  };
