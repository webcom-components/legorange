/* All these functions are based on webcom.js */
var ev = require('./events.js');

var webcom_url=__WEBCOM_SERVER__+"/base/"+__NAMESPACE__,
    legobase = new Webcom(webcom_url),
    bricks={},
    bricksize = 15, //parseInt($(document).width()/100),
    noAuth=true,
    authData ="",
    domain="brick";

    module.exports.bricksize = bricksize;


// Handle the display to remove all the drawpace's bricks
module.exports.eraseAll = function() {
	$.confirm({
    icon: 'fa fa-warning',
    closeIcon:true,
    title: 'Warning !',
    content : 'Remove all bricks ?',
    buttons: {
      Okay: { action: function () { legobase.child(domain).remove(); } },
      Cancel: { action: function () {} }
    } 	
	});
};

// Callback on brick change (here, only the color is changing)
legobase.child(domain).on('child_changed', function(snapshot) {
	var brick=snapshot.val();
	bricks[brick.x+"-"+brick.y].removeClass().addClass("brick "+brick.color+" "+brick.uid.replace(":", "_"));  
});

// Callback on the addition of a new brick
legobase.child(domain).on('child_added', function(snapshot) {
	var brick=snapshot.val();
	var brick_div;
	brick_div=$('<div>', {class: "brick "+brick.color}).css('top', (bricksize*brick.y)+"px").css('left', (bricksize*brick.x)+"px").css('width', bricksize+"px").css('height', bricksize+"px").css('background-size', bricksize+"px" + " " + bricksize+"px").css('z-index',"1");

	if (brick.uid) {
	  brick_div.addClass(brick.uid.replace(":", "_"));
	}

	bricks[brick.x+"-"+brick.y]=brick_div;

	$(".drawspace").append(brick_div);
	$("#bricks_count").html(Object.keys(bricks).length);
});

// Callback on a removed brick
legobase.child(domain).on('child_removed', function(snapshot) {
	var brick=snapshot.val();
	bricks[brick.x+"-"+brick.y].remove();
	delete bricks[brick.x+"-"+brick.y];
	$("#bricks_count").html(Object.keys(bricks).length);
});

// Authentification handler
if (noAuth) {authData={uid: "anonymous", provider: "none", none: {displayName: "anonymous"}};}

// create, edit or remove a brick at the position x,y
module.exports.updatePos = function(x, y) {

  // Creation of a new brick instance 
  var brick=legobase.child(domain+"/"+x+"-"+y);

  // We check if there is already a brick at the pos x,y
  brick.once("value", function(currentData) {
  	color = ev.color;
  	mode = ev.mode;
    if (mode === "draw" || mode === "eraseAll") {
      brick.set({color: color, x: x, y: y, uid: authData.uid});
    } else if (currentData.val() != null)
      brick.set(null);
  });
};