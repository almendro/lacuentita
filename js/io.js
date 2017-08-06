/* 

La Cuentita
-----------

Martín Ochoa
2017-07-17


*/



var lacuentita = window.lacuentita || {};

lacuentita.io = (function($){
    
  var storage, 
      soy_io,
      apl  // prefijo de aplicacion
      ;
  
  var io = //function(){
    {
    //trace('creamos el objeto IO');
    iniciar: function (p){
      soy_io = this;
      trace('iniciar la IO (input/output data)');
      $.alwaysUseJsonInStorage(true);
      storage = $.localStorage;
			apl = p.aplicacion_prefijo;
    }
    ,
    borrar_todo : function(){
       trace('IO: borrar_todo');
       storage.remove(apl);  
       return true;
    }
    ,
    borrar_objeto : function (objeto){
        trace("IO: borrar_objeto "+objeto);
        trace("existe? "+storage.isSet(apl + '.'+objeto));
        if (storage.isSet(apl + '.'+objeto)){
          storage.remove(apl + '.'+objeto);
          trace(objeto+"? "+storage.isSet(apl + '.'+objeto));
          trace("borrado ok");
          return true;
        } else {
          trace("no existe para borrar");
          return false;
        }
    }
    ,
    cargar_perfil : function(){

       trace('IO: cargar_perfil');
       var perfil;
       if ( storage.isSet(apl+'.perfil')){
         trace('hay datos de perfil');
         perfil = storage.get(apl+'.perfil');
         trace('perfil='+JSON.stringify(perfil));
       } else {
         trace('NO hay datos de perfil guardados');
         perfil = false;
       }
    
       return perfil;
    }
    ,
    cargar_configuracion : function(perfil_id){

       trace('IO: cargar_configuracion');
       trace( 'perfil_id = ' + perfil_id );

       var configuracion;
       if ( storage.isSet( apl + '.' + perfil_id + '.configuracion' ) ) {
         trace('hay datos de configuracion');
         configuracion = storage.get( apl + '.' + perfil_id + '.configuracion' );
       } else {
         trace('NO hay datos de configuracion guardados');
         configuracion = false;
       }
       return configuracion; // tmp
     }
     ,
     cargar_datos : function (perfil_id){
       trace('IO: cargar_datos');
       trace( 'perfil_id = ' + perfil_id );

       var salida;
       if ( storage.isSet( apl + '.' + perfil_id + '.datos' ) ) {
         trace('HAY DATOS');
         salida = storage.get( apl + '.' + perfil_id + '.datos' );
         trace( "datos: "+JSON.stringify(salida) );
         trace("cargas.length: "+contar(salida.cargas));
       } else {
         trace('NO hay datos guardados');
         salida = false;
       }
       //return ( callback )? callback( salida ) : salida;
       return salida;
     } /* /cargar_datos */
     ,
    obtener_datos_formulario : function ( p ){
      trace('IO: obtener_datos_formulario (serializeJSON)' + p.$subseccion.attr("id"));
      var salida = {};
      salida["datos"] = $("form",p.$subseccion).serializeJSON({checkboxUncheckedValue: false});
      salida["$subseccion"] = p.$subseccion;
      return ( p.callback )? p.callback( salida ) : salida;
    } /* obtener_datos_formulario */
    ,
    salvar_datos : function (p) {
      //datos , objetoStorage , callback
      trace('IO: salvar_datos datos ' + JSON.stringify(p.datos) );
      trace('IO: salvar_datos objetoStorage ' + JSON.stringify(p.objetoStorage) );
      var salida;
      var datos = listar(p.datos);
      var objetoStorage = listar(p.objetoStorage);
      for (d in datos){
        storage.set(apl + '.'+objetoStorage[d] , datos[d] );
        trace( "... salvado "+objetoStorage[d]+" ..." );
      }
      return (p.callback ) ? p.callback( salida ) : salida;
    } /* salvar_datos */
    
  }; /* var io */

  return io;

})(jQuery);

trace("cargado oi.js");

/* fin js */
