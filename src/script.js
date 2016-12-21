/*                ORIGINAL WebApp
 https://io.datasync.orange.com/samples/legorange/ */
require('../assets/styles/app.scss');
require('../assets/styles/style.css');

require('../assets/images/icons/icon-128x128.png');
require('../assets/images/icons/icon-144x144.png');
require('../assets/images/icons/icon-152x152.png');
require('../assets/images/icons/icon-192x192.png');
require('../assets/images/icons/icon-72x72.png');
require('../assets/images/icons/icon-96x96.png');
require('../assets/images/bricks/orangeBrick.png');

var webcom  = require('./webcom_fct.js'),
    init    = require('./init.js'),
    ev      = require('./events.js');

var drawspace = $(".drawspace"),
    btn_dezoom = $("#btn_dezoom"),
    eraseAll = $("#eraseAll"),
    btn_panel = $('#btn_panel'),
    panel = $('#overlayPanel'),
    mode = "draw",
    topHeight,
    smartphone,
    scale = 0.5,
    myScroll;



module.exports.mode = mode;

var bricksize = webcom.bricksize;
//var mode = webcom.mode;

$(window).on('beforeunload', function(){
  $(window).scrollTop(0);
  $(window).scrollLeft(0);
});

$(window).on("load", function (){
  $(document).foundation();

  // Initialisation du contexte global
  globalInit();

  // drawspace scale from 1 to 0.5
  btn_dezoom.on('click', function(){
    var offX, offY, scale; 

    offY = ($('body').scrollTop()/4) - (window.innerHeight/2);
    offX = ($('body').scrollLeft()/4) - (window.innerWidth/2);
    scale = 0.5;
    dezoom(offX, offY, scale);
  });

  // remove all bricks from the drawspace 
  eraseAll.click(function() {
    webcom.eraseAll();
  });

  // Handle the continuous drawing on the computer
  drawspace.on('mousedown', function(e){
    if (smartphone === 0) {
      if (e.defaultPrevented ) return;
      var new_move,
          last_move="",
          handlers = {
        mousemove : function(e){
          if (e.defaultPrevented ) return;
          console.log('pageY= '+e.pageY +'     offset= '+ drawspace.offset().top);
          x=parseInt((e.pageX - drawspace.offset().left) / bricksize);
          y=parseInt((e.pageY - drawspace.offset().top) / bricksize);

          new_move = x + "-" + y;

          // Disable brick overflow outside drawspace
          if (new_move!=last_move && e.pageX < drawspace.width() && e.pageY < (drawspace.height() + topHeight) && e.pageX > 0 && e.pageY > 0) {
            webcom.updatePos(x, y, mode);
          }
          last_move=new_move;
          console.log('last_move= '+last_move);
        },
        mouseup : function(e){
          $(this).off(handlers);   
        }
      };
      $(document).on(handlers);
    }
  });

  // handle the simple click (addition/deletion of bricks) on the drawspace 
  drawspace.bind("click", function(e){
    var x,y;
    var clickX = e.pageX;
    var clickY = e.pageY;


var topDoc  = window.pageYOffset || document.documentElement.scrollTop,
    leftDoc = window.pageXOffset || document.documentElement.scrollLeft;

var topDraw  = $('.drawspace').scrollTop(),
    leftDraw = $('.drawspace').scrollLeft();    

var topBody  = $('body').scrollTop(),
    leftBody = $('body').scrollLeft(); 

var topHtml  = $('html').scrollTop(),
    leftHtml = $('html').scrollLeft();

console.log('topDoc= '+topDoc+' - leftDoc= '+leftDoc);
console.log('topDraw= '+topDraw+' - leftDraw= '+leftDraw);
console.log('topBody= '+topBody+' - leftBody= '+leftBody);
console.log('topHtml= '+topHtml+' - leftHtml= '+leftHtml);




    // mobile device == false
    if (smartphone === 0) {
      x=parseInt((clickX - drawspace.offset().left) / bricksize);
      y=parseInt((clickY - drawspace.offset().top) / bricksize);
      webcom.updatePos(x,y);
    } else { // mobile device == true
      if (panel.hasClass('ui-panel-open') === true) {
        if (e.defaultPrevented ) return;
        panel.panel("close");
        btn_dezoom.show();
        $('html').removeClass('hideOverflow').addClass('showOverflow');
      } else {
        // Add brick if draw mode
        if (scale === 2) {
          x=parseInt(((clickX - drawspace.offset().left) / bricksize)/2);
          y=parseInt(((clickY - drawspace.offset().top) / bricksize)/2);
          webcom.updatePos(x,y);
        }
        // Zoom if navigation mode
        if (scale === 0.5) {
          scale = 2;

          var scrollX,
              scrollY,
              viewpWidth = window.innerWidth/3.5,
              viewpHeight = window.innerHeight/3.5,
              overflowX = e.clientX - viewpWidth,
              overflowY = e.clientY - viewpHeight,
              offX = $('body').scrollLeft(),
              offY = $('body').scrollTop() ;

          scrollX = (clickX + overflowX + offX)*2;
          scrollY = (clickY + overflowY + offY)*2;    

          btn_dezoom.show();
          transcale(scrollX, scrollY, scale);
        }
      }
    }
  });
 });

/* Effectue une translation et un scale sur le drawspace */
function transcale (x, y, sc) {
  console.log('transcale. scale = '+sc);
  drawspace.css('margin-top', topHeight);
  drawspace.css('transform', "scale(" + sc + ")");
  if (sc === 0.5) {
    $('div[data-role="main"]').height(2490);
    $('div[data-role="main"]').width(2490);
  } else {
    $('div[data-role="main"]').height(4980);
    $('div[data-role="main"]').width(4980);
  }
  // document.querySelector('meta[name=viewport]').setAttribute('content', "width=device-width, height=device-height, initial-scale=1, user-scalable=no");
  $('body').scrollLeft(x);
  $('body').scrollTop(y);
}

/* Initialisation du contexte global (interface) */
function globalInit() {

  //$('.topbar').css('height', '10vh');
  topHeight = $('.topbar').outerHeight();
  var panel = $('[data-role=panel]').height();
  var panelheight = topHeight - panel;
  var panelwidth = '330px';

  $('.ui-panel').css({
    'top': topHeight,
    'min-height' : 'none !important',
    'width': panelwidth,
    'background' : 'black',
    'text-shadow' : '0 0 0',
    'overflow' : 'auto'
  });

  $("div").removeClass('ui-panel-dismiss');
  $('a').removeClass('ui-link');

  // = 1 si mobile, 0 sinon
  smartphone = init.detectDevice();

  btn_dezoom.hide();
  drawspace.css('margin-top', topHeight);

  var btn_menuicon = $('.menu-icon').height();
  var menutitle = $('.top-bar-title').height();
  var margin_menuicon = ($('.topbar').height() - btn_menuicon)/2;
  var margin_menutitle = ($('.topbar').height() - menutitle)/2;
  $('.menu-icon').css('margin-top', margin_menuicon +'px');
  $('.top-bar-title').css('margin-top', margin_menutitle +'px');
  $('.ui-page-theme-a').css('text-shadow', '0 0 0');


  // Disable Ctrl+mouseWheel zoom on cross-browser 
  $(window).bind('mousewheel DOMMouseScroll', function (event) {
    if (event.ctrlKey === true) {
      if (event.defaultPrevented ) return;
    }
  });

  // Initialisation of the drawspace's brick size
  initBrickSize(bricksize+"px");

  if (smartphone === 1) {
    transcale(0, 0, 0.5);
  } else {
    transcale(0, 0, 1);
    $('#overlayPanel').panel('open');
    $('.qrcode').qrcode({text:'https://simonbaumannpro.github.io/legorange3.0/', width: 200, height:200 });
  }
}

// Dezoom the drawspace to the initial state
function dezoom(x, y, sc) {
  transcale(x, y, sc);
  scale = 0.5;
  btn_dezoom.hide();
}

// set the size of the drawspace's background 
function initBrickSize(size) {
  drawspace.css('background-size', size + " " + size);
}

// disable the scroll when the panel is open
btn_panel.click(function() {
  if (smartphone === 1)
    ev.disableScroll(scale);
});

// handle the highlighted color chosen
$(".brickMenu").click(function() {
  ev.color_active($(this));
});

// if erase mode, disable color display
$("#menu-DT").click(ev.hide_colors());

// change mode (draw or erase)
$(".mode").click(function(e){
  module.exports.mode = ev.change_mode($(this).attr("id"));
});