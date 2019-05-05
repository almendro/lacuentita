/* 

La Cuentita
-----------

Martín Ochoa (almendro)
2017-07-17

https://github.com/almendro/lacuentita
*/


var lacuentita = window.lacuentita || {};
var archivo = 'lacuentita';

lacuentita.aplicacion = (function($,moment){

  var aplicacion = function(){

    trace('instancia: aplicación');
    trace('variables y objetos');
    
    /* principales */
    
    var APLICACION_PREFIJO = "lacuentita";
    
    var perfil,
        configuracion,
        valores_por_defecto;
    
    var datos; /* objeto con toda la data de usuario */
    
    /* data input/output e interfaz usuario */
    var io, ui;

    /* datos */
    var hoy;
    
    /* botones enviar 
    para capturar todos los botones de los formularios
    */
    var $botones_enviar,
        $secciones,
        $subsecciones;
        
    var estoy_en,
        seccion_actual , 
        subseccion_actual;
    
    this.iniciar = function(){
      
        trace('iniciamos la aplicación');
        
        /*
        Referenciar los módulos e inicializarlos
        */
        
        ui = lacuentita.ui;
        ui.iniciar();
        
        io = lacuentita.io;
        io.iniciar({ aplicacion_prefijo: APLICACION_PREFIJO });
        
        /* fin iniciar módulos */


				/* INICIA ESTRUCTURA DE DATOS */
				
        perfil = {
          id: "",
          nombre:"",
          alias: "",
          email: ""
        };
        
        configuracion = {
          preferencias: {},
          otras: {}
        };
        
        datos = {
          /*
          Datos que se comparten en la web.
          */
          compartidos: {
            empresas: [{
              cuit: 11223334445,
              alias: "alias",
              razon_social: "Razón social",
              locales: [{
                empresa: 0,
                alias: "alias",
                localidad: 0,
                direccion: "dirección",
                coordenadas: [0,0]
              }],
              inventario: [] // key interno; value EAN/UCC13
            }],
            productos: [{ // key EAN/UCC13 code
              descripcion: "descripción",
              medidas: "peso/tamaño",
              pais: "",
              precio: [{ // historico
                precio: 1,
                fecha: "AAAAMMDD",
                empresa: 0,
                local: 0
              }],
              etiquetas: [] // listados id de etiquetas para categorías
            }], // productos
            etiquetas: [] // key es id -> valor "descripción"
          }, // compartidos
          
          /*
          Datos del usuario. los precios siempre se comparten.
          las cuentitas es opcional.
          */
          usuario : {
            cuentitas: [{
              empresa: 0,
              local: 0,
              fecha: "AAAAMMDD",
              hora: "HHMMSS",
              productos: [{
                id: 0,
                cantidad: 0,
                precio: 0,
                descuento: "tipo",
                etiquetas_personales: []
              }], // productos
              total: 0
            }], // cuentitas
            etiquetas_personales: [],
            etiquetas_mapa: []
          } // usuario
        }; // datos
        
        /* FIN ESTRUCTURA DE DATOS */
        
        hoy = moment().format("YYYYMMDD");
        
        $secciones = $( ".seccion" );
        $subsecciones = $( ".subseccion" );
        $botones_enviar = $( ".enviar" );
        
    }; /* this.iniciar */
    
    var estado = function(p) {
    }; /* /estado */
    
    var ir_a = function(p){
    }; /* /ir_a */
    
    var preprocesar_ir_a = {
    }; /* /preprocesar_ir_a */

    var generar_id = function ( datosPerfil ) {
      var id = datosPerfil.email;
      id = replaceAll( id, "." , "_dot_" );
      id = replaceAll( id, "@" , "_at_" );
      trace(" generar_id: "+id);
      datosPerfil[ "id" ] = id;
      return datosPerfil;
    }; /* /generar_id */


    /* control de pantallas */
    
    var bienvenida = function () {
    }; /* bienvenida */

    var comenzarYa = function () {
      trace("comenzarYa: ");
    }; /* comenzarYa */
 
    var comenzar = function () {
      trace("comenzar: ");
    }; /* comenzar */

       
    
  };/* /aplicacion */

  return aplicacion;

})(jQuery,moment);

trace("cargado "+archivo+".js");
/* fin js */
