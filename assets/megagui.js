/* 

MEGA-GUI
--------

Martín Ochoa (almendro)
2012
Basado en funciones para MEGA GUI EXTENSION para SVG EDIT
https://github.com/almendro/megasvg
*/


var megagui = window.megagui || {};

megagui.tools = (function($){

  var tools = function(){
    
    var doblekey;
    var soy = this;
    soy.iniciar = function(){
      
      trace("iniciar megagui");
			soy.doblekey = megagui.doblekey;
			soy.doblekey.iniciar();
      
    }; //* iniciar * /
    
  };/* /tools */

  trace("megagui tools return");
  return tools;

})(jQuery);

trace("cargado megagui.js");
/* fin js */
