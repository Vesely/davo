/*
  Old browser notification
  http://browser-update.org/
*/
var $buoop = {}; 
	$buoop.ol = window.onload; 
window.onload=function(){ 
	try {if ($buoop.ol) $buoop.ol();}catch (e) {} 
 	var e = document.createElement("script"); 
 		e.setAttribute("type", "text/javascript"); 
 		e.setAttribute("src", "http://browser-update.org/update.js"); 
 	document.body.appendChild(e); 
} 


$(function(){
  var onClass = "on";
  var showClass = "show";
  
  $("input").bind("checkval",function(){
    var label = $(this).prev("label");
    if(this.value !== ""){
      label.addClass(showClass);
    } else {
      label.removeClass(showClass);
    }
  }).on("keyup",function(){
    $(this).trigger("checkval");
  }).on("focus",function(){
    $(this).prev("label").addClass(onClass);
  }).on("blur",function(){
      $(this).prev("label").removeClass(onClass);
  }).trigger("checkval");
});
