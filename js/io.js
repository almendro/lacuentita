/* 

La Cuentita
-----------

Martín Ochoa
2017-07-17


*/



var lacuentita = window.lacuentita || {};

lacuentita.io = (function($){
    
  var storage, 
      soyIo,
      apl  // prefijo de aplicacion
      ;
  
  var io = //function(){
    {
    //trace('creamos el objeto IO');
    iniciar: function (){
      soyIo = this;
      trace('iniciar la IO (input/output data)');
      $.alwaysUseJsonInStorage(true);
      storage = $.localStorage;
      apl = "la_cuentita";
    }
    ,
    borrarTodo : function(){
       trace('IO: borrarTodo');
       storage.removeAll();  
       return true;
    }
    ,
    borrarObjeto : function (objeto){
        trace("IO: borrarObjeto "+objeto);
        trace("existe? "+storage.isSet("tf."+objeto));
        if (storage.isSet("tf."+objeto)){
          storage.remove("tf."+objeto);
          trace(objeto+"? "+storage.isSet("tf."+objeto));
          trace("borrado ok");
          return true;
        } else {
          trace("no existe para borrar");
          return false;
        }
    }
    ,
    cargarPerfil : function(){

       trace('IO: cargarPerfil');
       var perfil;
       if ( storage.isSet('tf.perfil')){
         trace('hay datos de perfil');
         perfil = storage.get('tf.perfil');
         trace('perfil='+JSON.stringify(perfil));
       } else {
         trace('NO hay datos de perfil guardados');
         perfil = false;
       }
    
       return perfil;
    }
    ,
    cargarConfiguracion : function(perfilId){

       trace('IO: cargarConfiguracion');
       trace( 'perfilId = ' + perfilId );

       var configuracion;
       if ( storage.isSet( 'tf.' + perfilId + '.configuracion' ) ) {
         trace('hay datos de configuracion');
         configuracion = storage.get( 'tf.' + perfilId + '.configuracion' );
       } else {
         trace('NO hay datos de configuracion guardados');
         configuracion = false;
       }
       return configuracion; // tmp
     }
     ,
     cargarDatos : function (perfilId){
       trace('IO: cargarDatos');
       trace( 'perfilId = ' + perfilId );

       var salida;
       if ( storage.isSet( 'tf.' + perfilId + '.datos' ) ) {
         trace('HAY DATOS');
         salida = storage.get( 'tf.' + perfilId + '.datos' );
         trace( "datos: "+JSON.stringify(salida) );
         trace("cargas.length: "+contar(salida.cargas));
       } else {
         trace('NO hay datos guardados');
         salida = false;
       }
       //return ( callback )? callback( salida ) : salida;
       return salida;
     } /* /cargarDatos */
     ,
     obtenerDatosFormulario : function ( formulario , callback ){
      trace('IO: obtenerDatosFormulario ' + formulario);
      var datos = $("."+formulario+".propiedad" , $( "#" + formulario ));
      var salida = {};
      datos.each(function(evento){
        var soy = $(this);
        var id_propiedad = soy.attr("id");
        
        var propiedad = id_propiedad.replace( formulario + "_" , "" );
        /* poner aqui la recursiva para procesar grupis array */
        if( soy.hasClass("objeto") ) {
          trace ("objeto");
          salida[propiedad] = soyIo.obtenerDatosFormulario ( id_propiedad );
        } else {
          salida[propiedad] = soy.val();
          /* aqui para procesar segun el tipo de datos checkbox radio, etc
          http://api.jquery.com/val/
          http://www.wastedpotential.com/html-multi-checkbox-set-the-correct-way-to-group-checkboxes/
          http://stackoverflow.com/questions/9533081/get-value-of-checked-checkbox-list-in-array-in-jquery
          */
          
          trace("type "+soy.attr("type"));
          if( soy.attr("type")=="checkbox"){
              salida[propiedad] = soy.is(":checked"); /* gracias Marcelo! */
          }
          
        }
        trace ( propiedad + " = " + salida[propiedad]);
      }); /* datos.each */ 
      return ( callback )? callback( salida ) : salida;
    } /* obtenerDatosFormulario */
    ,
    obtenerDatosFormulario : function ( p ){
      trace('IO: obtenerDatosFormulario (serializeJSON)' + p.$subseccion.attr("id"));
      var salida = {};
      salida["datos"] = $("form",p.$subseccion).serializeJSON({checkboxUncheckedValue: false});
      salida["$subseccion"] = p.$subseccion;
      return ( p.callback )? p.callback( salida ) : salida;
    } /* obtenerDatosFormulario */
    ,
    salvarDatos : function (p) {
      //datos , objetoStorage , callback
      trace('IO: salvarDatos datos ' + JSON.stringify(p.datos) );
      trace('IO: salvarDatos objetoStorage ' + JSON.stringify(p.objetoStorage) );
      var salida;
      var datos = listar(p.datos);
      var objetoStorage = listar(p.objetoStorage);
      for (d in datos){
        storage.set('tf.'+objetoStorage[d] , datos[d] );
        trace( "... salvado "+objetoStorage[d]+" ..." );
      }
      return (p.callback ) ? p.callback( salida ) : salida;
    } /* salvarDatos */
    
  }; /* var io */

  return io;

})(jQuery);

trace("cargado oi.js");

/* fin js */