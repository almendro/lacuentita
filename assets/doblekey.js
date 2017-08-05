/* 

DobleKey
--------

Martín Ochoa (almendro)
2012
Basado en funciones para MEGA GUI EXTENSION para SVG EDIT
https://github.com/almendro/megasvg
*/


var megagui = window.megagui || {};

megagui.doblekey = (function($){

  // --- --- --- EVENTOS DE TECLADO --- --- ---
  
  // doblekey intercepta que se haya pulsado dos veces una tecla y ejecuta una acción.
	var doblekey_ultima = null,   // timeStamp de la ultima vez que se presionó una tecla
			doblekey_diferencia = 0,  // diferencia de tiempo
			doblekey_tecla = null,     // ultima tecla presionada
			doblekey_tecla_actual,    // tecla actual
			asignaciones = [];        // mapa de teclas y funciones

			// test 
			//
			//asignaciones[77]= function (){trace("doble key 77")};
			// 27 SCAPE ...... clear all nice alerts
			// 84 T .......... console side panel show/hide
	
  var doblekey = {
    

    iniciar : function(){
      
      trace("iniciar doblekey");
      /*
			asignaciones[27] = {
				tecla: 27,
				funcion: function(){
						trace("ESCAPE!!!");
				}
			};
			*/
			trace("asignadas funciones a teclas");
			
      $('html').keyup(function(e) {
				
        //trace("html keyup "+e.which);
        doblekey_tecla_actual = e.which;

        // comprobamos si ya se habia pulsado antes la misma tecla
        if ( doblekey_ultima!=null && doblekey_tecla == doblekey_tecla_actual ) {
        
          // calculamos la diferencia tomando el timeStamp del evento, ver la variable (e) en la llamada a la function (esto lo genera jQuery automaticamente)
          doblekey_diferencia = e.timeStamp - doblekey_ultima;
          //trace('doblekey_diferencia '+doblekey_diferencia);
          
          // umbral de activacion para el doblekey
          if ( doblekey_diferencia > 100 && doblekey_diferencia < 400 ){

            // comprobamos si la tecla se encuentra
            // registrada y llamamos a la funcion
            for (var t in asignaciones){
							//trace("t = ["+t+"] "+asignaciones[t]['tecla']);
							
							if ( asignaciones[t]['tecla'] == e.which){
								asignaciones[t]['funcion']();
							}
							
						}

          } // if dif > 100 < 400
          
        }// if doblekey_ultima
        
        // capturamos la pulsación actual
        doblekey_ultima = e.timeStamp;
        doblekey_tecla = doblekey_tecla_actual;
        
        //trace ("doblekey_tecla "+doblekey_tecla);
        
      }); // html.keyup
      /* */
    } //* iniciar * /
    
    ,
    parar: function(){
    }
    ,    
    estalecer_tecla: function(p){
			trace("doblekey: estalecer_tecla ");
			asignaciones[p.tecla] = {
				tecla: p.tecla,
				funcion: p.funcion
			};
			return true;
    }
    ,
    borrarTecla: function (p){
    }
    ,
    borrarTeclas:function (){
			asignaciones=[];
    }
    
  };/* /doblekey */
	trace("doblekey return");
  return doblekey;

})(jQuery);

trace("cargado doblekey.js");
/* fin js */
