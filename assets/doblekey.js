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
  /*
  // --- --- --- EVENTOS DE TECLADO --- --- ---
  
  // doblekey intercepta que se haya pulsado dos veces una tecla y ejecuta una acción.

  var doblekey_ultima = null,   // timeStamp de la ultima vez que se presionó una tecla
      doblekey_diferencia = 0,  // diferencia de tiempo
      doblekey_tecla = null,     // ultima tecla presionada
      doblekey_tecla_actual,    // tecla actual
      agisnaciones = [];        // mapa de teclas y funciones

      // test 
      //asignaciones[32]= function (){console.log("doble key 32")};
      //asignaciones[77]= function (){console.log("doble key 77")};
  */
  var doblekey = {
       
    iniciar : function(){
      
      trace("iniciar doblekey");
    /*  
      jQuery('html').keyup(function(e) {
        
        console.log("html keyup "+e.which);
        
        doblekey_tecla_actual = e.which;

        // comprobamos si ya se habia pulsado antes la misma tecla
        if ( doblekey_ultima!=null && doblekey_tecla == doblekey_tecla_actual ) {
        
          // calculamos la diferencia tomando el timeStamp del evento, ver la variable (e) en la llamada a la function (esto lo genera jQuery automaticamente)
          doblekey_diferencia = e.timeStamp - doblekey_ultima;
          console.log('doblekey_diferencia '+doblekey_diferencia);
          
          // umbral de activacion para el doblekey
          if ( doblekey_diferencia > 100 && doblekey_diferencia < 400 ){

            // comprobamos si la tecla se encuentra
            // registrada y llamamos a la funcion
            for (var t in agisnaciones){
							console.log("t = "+t+" "+agisnaciones[t]);
						}
            // activaciones del teclado que funcionan en todo momento
            /*
            switch (doblekey_tecla_actual)
            {
            
              case 77: // M
                jQuery('#btn_mega_gui').click(); // activa o desactiva MEGAGUI
              break;
              
              case 82: // R - muestra/oculta las reglas
                
                if($rules.css('visibility')=='visible'){
                  $rules.css('visibility','hidden');
                } else {
                  $rules.css('visibility','visible');
                }
                
              break;

            }// switch
            
            // activaciones del teclado que sólo funcionan si MEGA_GUI está ACTIVADO
            
            if ( $mega_gui.attr('id') == 'mega_gui' ) {

              switch (doblekey_tecla_actual)
              {
              
                case 16: // SHIFT - abre o cierra el menu en circular
                 if (jQuery('#tools_top').hasClass('circle_menu')) {
                    jQuery('#tools_top .item_primero').click();
                  }
                break;
              
                case 32: // SPACEBAR - muestra oculta la barra superior de menu
                
                  if ( tools_top.abierta ) {
                    tools_top.abierta = false;
                    $tools_top.stop().animate({
                      top: '-70px'
                    },
                    {
                      duration: 'slow',
                      easing: 'swing',
                      //queue: false,
                      complete: function(){
                        $tools_top.attr('style',' '); // limpiamos los estilos en linea para que funcione el CSS
                      }
                    });
                  } else {
                    tools_top.abierta = true;
                    $tools_top.stop().animate({
                      top: '0px'
                    },
                    {
                      duration: 'fast',
                      easing: 'swing',
                      //queue: false,
                      complete: function(){
                        //$tools_top.attr('style',' ');
                      }
                    });
                  }// <<< else
                  
                break; // <<< case 32
                
              }// switch        
            
            }
            else
            {
              // aca pueden ir las activaciones del teclado que sólo funcionan si MEGA_GUI está DESACTIVADO
              /*
              switch (doblekey_tecla_actual)
              {
              }
              * /
            }
            * /
            
          } // if dif > 100 < 400
          
        }// if doblekey_ultima
        
        // capturamos la pulsación actual
        doblekey_ultima = e.timeStamp;
        doblekey_tecla = doblekey_tecla_actual;
        
        console.log ("doblekey_tecla "+doblekey_tecla);
        
      }); // html.keyup
      */
    } //* iniciar * /
    /*
    ,
    parar: function(){
    },
    estalecerTecla: function(p){
    },
    borrarTecla: function (p){
    },
    borrarTeclas:function (){
    }
    */
  };/* /doblekey */
	trace("doblekey return");
  return doblekey;

})(jQuery);

trace("cargado doblekey.js");
/* fin js */
