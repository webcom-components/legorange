/* Functions allowing the global context to know the plateform and browser used */

var MobileDetect = require('mobile-detect');

var size; // bricks size
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var is_IE = navigator.appName == 'Microsoft Internet Explorer' ||  !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/));
var md = new MobileDetect(window.navigator.userAgent);

var mobile = md.mobile(),
    phone = md.phone(),
    tablet = md.tablet(),
    os = md.os();

console.log( md.mobile() );          // 'Sony'
console.log( md.phone() );           // 'Sony'
console.log( md.tablet() );          // null
console.log( md.userAgent() );       // 'Safari'
console.log( md.os() );              // 'AndroidOS'
console.log( md.is('iPhone') );      // false

// $('#btn_dezoom').removeClass().addClass('dezoom');

if (tablet) {
  console.log('tabletttttt');
  $(".topbar, .logo_txt, .logo_webcom, .menu-icon, .dezoom").addClass('tablet');
  $('.dezoom').css('height','140px').css('width','140px');
}

if (is_IE){
  console.log("IE");
  $(".colors").css('padding-top','22px');
}

// Detect if the app is running on mobile/tablet or computer 
module.exports.detectDevice = function() {
  if (phone || tablet) {
    $('.qrcode').css('display','none');
    console.log('mobile');
    return 1;
  } else {
    $('#DT').attr('aria-expanded', 'true');
    $('.ul-drawTools').css('display', 'block');
    console.log('PC'); 
    return 0;
  }
};