/* 

La Cuentita
-----------

Martín Ochoa (almendro)
2017-07-17


*/


var lacuentita = window.lacuentita || {};
var archivo = 'lacuentita';

lacuentita.aplicacion = (function($,moment){

  var aplicacion = function(){

    trace('instancia: aplicación');
    trace('variables y objetos');
    
    /* principales */
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
        io.iniciar();
        
        
        /* fin iniciar módulos */
        
        trace("*** cargamos configuracion guardada ***");
  
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
								categorias_personales: []
							}], // productos
							total: 0
						}], // cuentitas
						etiquetas_personales: [],
						etiquetas_mapa: []
					} // usuario
        }; // datos
        
        hoy = moment().format("YYYYMMDD");
        
        $secciones = $( ".seccion" );
        $subsecciones = $( ".subseccion" );
        $botones_enviar = $( ".enviar" );
        //ui.ocultarSeccion(); /* CAMBIAR a ocultarSecciones */

        // *** PREPROCESOS ***
       
        trace( "Preprocesamos las subsecciones ..." );
        $subsecciones.each(function(e){
          var $soy = $(this);
          var $mi_plantilla;
          var $enviar;
          trace("subseccion: "+$soy.attr("id"));
          if ( $soy.attr("data-plantilla") ){
           trace( "hay plantilla" );
            $mi_plantilla = ui.aplicar_plantilla({
              $subseccion: $soy
            });
          }
          /*
          $enviar = $( ".enviar", $mi_plantilla );
          $enviar.bind
          */
          if( $("form", $soy).length > 0 ){
            trace("hay form...");
            habilitar_formulario({
              $subseccion: $soy
            });
          } else {
            trace("sin form. Siguiente...");
          }
        });
        
        trace("---");
        trace( "Procesamos las barras de navegacion..." );
        trace("");
        
        $( "a", $( ".barra" )).each( function(i){
          var $a = $(this);
          var $barra = $a.parents( ".barra" );
          var tipo_objetivo = $barra.attr( "data-tipo-objetivo" );
          
          $a.bind("click.mis_eventos", function(){
            /* obtenemos el id del destino */
            var id = $a.attr("href").replace("#","");
            ir_a({
              id: id,
              tipo: tipo_objetivo,
              preprocesar_ir_a: preprocesar_ir_a[id] 
              /* referenciamos a la funcion dentro de preprocesar_ir_a */
            }); /* ir_a */
          }); /* $a.bind */
        }); /* .each */
        
        $("#dev_borrar_todo").bind(
          "click.mis_eventos",
          borrar_todo
        );
        
        $("#dev_borrar_cargas").bind(
          "click.mis_eventos",
          borrar_cargas
        );
        
        
        /* Interaccion con el usuario */
        trace(" *** ACA COMIENZA LA POSTA *** ");
        
        perfil = io.cargar_perfil();
        estado( perfil==false ? "SIN_PERFIL" : "PERFIL" );
        
        if ( estado() == "SIN_PERFIL" )
        {
          /*
          En este punto no hay definido un perfil 
          por lo cual iniciamos la configuracion de uno 
          y luego ofrecemos la posibilidad de
          establecer las preferencias generales
          o iniciar con los valores por defecto
          */
          trace("crear perfil");
          
          estoy_en = ir_a("perfil");
          
          /* dehabilitamos cualquier otra opcion */
          ui.deshabilitarSubseccion([
            "preferencias",
            "otras"
          ]);
          
          ui.deshabilitarSeccion([
            "ver_cargas",
            "ver_jornada",
            "ver_grilla"
          ]);
          
          return true;
          
          ui.mostrarMensajeSeccion( "#bienvenida", estado() );
                   
          habilitar_formulario({
            formulario: estoy_en.subseccion,
            callback: function(){
              estado( "SIN_CONFIGURACION" );
            }
          }); /* /habilitar_formulario */
          
        } 
        else 
        {
          /*
          En este punto hay definido un perfil,
          pero comprobamos si están definidas
          las preferencias generales de tiempo.
          Si hay preferencias arrancamos normal.
          Populamos los formularios con los datos.
          */
          trace( "presentamos el perfil: " + perfil.id + " " + perfil.nombre + " " + perfil.alias + " " + perfil.email );
          
          configuracion = io.cargarConfiguracion( perfil.id );
          
          estado( configuracion==false ? "SIN_CONFIGURACION" : "CONFIGURADO" );
          
          configuracion = $.extend(
            {},
            valores_por_defecto.configuracion,
            configuracion
          );
          trace( "configuracion = " + JSON.stringify(configuracion) );
          
          trace( "Popular formularios ..." );
          ui.ponerDatos ({
            form: "#perfil",
            data: perfil 
          });
          ui.ponerDatos ({
            form: "#preferencias",
            data: configuracion['preferencias']
          });
          ui.ponerDatos ({
            form: "#otras",
            data: configuracion['otras']
          });
          
          datos = io.cargarDatos( perfil.id );
          
          if( datos == false )
          {
            trace( "... generar datos por defecto..." );
            datos = $.extend(
              {},
              valores_por_defecto.datos,
              datos
            );
            io.salvarDatos({
              datos: datos,
              objetoStorage: perfil.id+".datos" ,
              callback: function(p){
                trace("DATOS iniciales salvados...");
              } /* /callback */
            }); /* /io.salvarDatos */
            carga = $.extend(
              {},
              valores_por_defecto.carga,
              {
                id: idCargaSiguiente(),
                cantidad: configuracion.tiempoMinimo,
                fechaIni: hoy,
                fechaFin: hoy,
                resto: configuracion.tiempoMinimo,
              }
            );
          }
          else
          {
            trace( "Actualizamos estado con los datos cargados..." );
            // aquí plantillas preferidas.
            carga = $.extend(
              {},
              valores_por_defecto.carga,
              {
                id: datos.idClaveCarga,
                cantidad: configuracion.tiempoMinimo,
                fechaIni: hoy,
                fechaFin: hoy,
                resto: configuracion.tiempoMinimo,
              }
            );
          }
          
          
          
          if ( contar(datos.cargas) > 0 )
          {
            trace("popular listado de cargas");
            ui.listarCargas({
              datos: datos.cargas,
              subseccion: "listarCargas",
              texto: texto
            });
            
            ui.filtrarListado({
              vista: configuracion.vista.cargas
            });
            
          }
          
          
          if ( estado()=="SIN_CONFIGURACION" ){
            trace('mostrar aviso de SIN_CONFIGURACION');
            bienvenida();
          }        
          else
          {
            comenzar();
          }
        }
    }; /* this.iniciar */
    
    var estado = function(p) {
      if (p==undefined) {
        trace ("consulta estado: "+miEstado);
        return miEstado;
      }
      if ( typeof p === "string" ){
        miEstado = p;
        trace ("establece estado: "+miEstado);
        return;
      }
      trace("estado: ¡¡¡Fruta!!!");
      return false;
    }; /* /estado */
    
    var ir_a = function(p){
      /*
      actualiza la pantalla cambiando entre secciones
      y subsecciones.
      Puede recibir un string con el id de la DIV
      o un object con el id, tipo y preprocesar_ir_a
      id: string
      tipo: string, indica si se trata de una seccion
      preprocesar_ir_a: string, por lo general igual a id
      */
      trace("ir_a :"+p.id);
      var tipo, id;
      trace("typeof p: "+typeof(p));
      if (typeof(p)==="string"){
        id=p;
        tipo = $secciones.filter("#"+id).length == 1 ?
          "seccion" : "subseccion"; 
          /* 
          determina el tipo si existe en los objetos de 
          seccion, de lo contrario se trata de una subseccion
           */
      } else {
        id = p.id;
        tipo = p.tipo;
      }
      /*
      Determina si antes de cambiar de seccion se debe
      pre procesar algun datos o estado llamando a la funcion
      dentro del objeto preprosesarIrA genneral referenciado
      en el parametro.
      */
      if( p.preprocesar_ir_a != undefined ){
        trace( "preprocesar_ir_a ...");
        var tmp = p.preprocesar_ir_a();
        trace( "tmp="+tmp);
      }
      
      var uiMetodo = ui.mostrarSubseccion; 
      if (tipo=="seccion"){
        uiMetodo = ui.mostrarSeccion;
      }
      uiMetodo(id);
      
      var salida;
      /*
      if(p.tipo=="seccion"){
        salida["seccion"] = id;
        salida["subseccion"] = ui.subseccionActivada({seccion:id});
      } else {
        salida = ui.subseccionProp(id);
        salida["subseccion"] = id;
      }
      */
      salida = true;
      
      return (p.callback ) ? p.callback( salida ) : salida;
    }; /* /ir_a */
    
    var generar_id = function ( datosPerfil ) {
      var id = datosPerfil.email;
      id = replaceAll( id, "." , "_dot_" );
      id = replaceAll( id, "@" , "_at_" );
      trace(" generar_id: "+id);
      datosPerfil[ "id" ] = id;
      return datosPerfil;
    }; /* /generar_id */

    var idCargaSiguiente = function(){
      trace( "idCargaSiguiente: ");
      datos["idClaveCarga"]++;
      trace( "datos.idClaveCarga= "+datos.idClaveCarga);
      return datos.idClaveCarga;
    }; /* /idCargaSiguiente */
    /* control de pantallas */
    
    var bienvenida = function () {

      trace("");
      trace(" --- LA BIENVENIDA ---");
      trace("");
      
      estoy_en = ir_a( "bienvenida" );
      
      $( '.valor.perfil.nombre' ).text( perfil.nombre );
      $( '.valor.perfil.id' ).text( perfil.id );
      
      $( '#btn_comenzar_ya' ).bind( 'click.mis_eventos' , comenzarYa );
      //$( '#btn_configurar_preferencias' ).bind( 'click.mis_eventos' , configurarPreferencias );
      /*
      ui.verPreferencias ({
        datos: valores_por_defecto.preferencias,
        div: "#valores_defecto",
        prefijo: "valor_"
      });
      */
      ui.mostrarMensajeSeccion("#bienvenida", estado() );
    }; /* bienvenida */

    var comenzarYa = function () {
      trace("comenzarYa: ");
    }; /* comenzarYa */
 
    var comenzar = function () {
      trace("comenzar: ");
    }; /* comenzar */

       
    var configurarPreferencias = function () {
       
       trace("configurarPreferencias: ");
       estoy_en = ir_a( "preferencias" );
       //ui.mostrarSeccion( "configuracion" );
       /*
       ui.ponerDatos ({
           form: "#preferencias",
           data: 
             configuracion['preferencias'] == false ? 
             valores_por_defecto.preferencias : configuracion['preferencias'] 
       });
       * /
       habilitar_formulario({
         formulario: "preferencias" ,
         seccion: "configuracion" ,
         callback: function( datosPreferencias ){
           /*
           datosPreferencias es la devolucion
           del formulario cuando el usuario
           presiona el boton de ENVIAR
           
           salvamos los datos en el objeto del 
           id del perfil actual.
           * /
           configuracion["preferencias"] = datosPreferencias;
           //configuracion["otras"] = io.obtenerDatosFormulario( "otras" );
         
           io.salvarDatos({
             datos: datosPreferencias , 
             objetoStorage: perfil.id+".configuracion.preferencias" ,
             callback: function(){ 
              /*
              Mostrar pantalla de inicio
              * /
              
              trace("mostrar pantalla de inicio" );
              ui.mostrarSeccion ( "inicio" );
              /*
              ui.mostrarSubseccion ( "bienvenida" );
              $( '#btn_comenzar_ya' ).bind( 'click.mis_eventos' , comenzarYa );
              $( '#btn_configurar_preferencias' ).bind( 'click.mis_eventos' , configurarPreferencias );
              ui.verPreferencias ({
                datos: valores_por_defecto.preferencias,
                div: "#valores_defecto",
                prefijo: "valor_"
              });
              * /
            }/* /callback * /
          }); /* io.salvarDatos * /
        }/* /callback * /
      }); /* habilitar_formulario */
    }; /* configurarPreferencias */
    
    
    var habilitar_formulario = function(p){
      /*
      Establece las acciones del boton enviar,
      recibe el objeto jQuery de subseccion
      y el callback de la funcion
      para cuando el botón es presionado
      */
      trace('habilitar_formulario: '+p.$subseccion.attr("id"));
      var salida;
      var enviar_callback = 
            (p.enviar_callback) ? 
              p.enviar_callback :
              habilitar_formularioCallbackGeneral;
      $( ".enviar", p.$subseccion )
      .bind( 
        'click.mis_eventos',
        function (){
          trace( "enviarDatos: " + p.$subseccion.attr("id") );
          io.obtenerDatosFormulario({
            $subseccion: p.$subseccion,
            callback: enviar_callback
          });
        } /* /function */
      ); /* /.bind */
      
      return (p.callback ) ? p.callback( salida ) : salida;
      
    }; /* /habilitar_formulario */
    
    var habilitar_formularioCallbackGeneral = function( datosDelFormulario ){
      /* 
      Recibimos de io.obtenerDatosFormulario
      los datos para ser ingresados y salvados         
      (habría que poner un control 
      para que no llegue vacio)
      */
      var datosASalvar;
      
      /* preprocesa segun la subseccion */
      datosASalvar = preprocesarDatosASalvar({
        datos: datosDelFormulario.datos,
        subseccion: datosDelFormulario.$subseccion.attr("id")
      });
      trace("...");
      trace(JSON.stringify(datosASalvar));
      trace("...");
      io.salvarDatos({
        datos: datosASalvar.datos , 
        objetoStorage: datosASalvar.objetoStorage ,
        callback: function(p){ 
          /*
          Mostrar resultado de salvar y subseccionSiguente
          */
          trace("DATOS salvados...");
          resultadoPostSalvarFormulario ({
            subseccion: datosDelFormulario.$subseccion.attr("id")
          });
        } /* /callback */
      }); /* /io.salvarDatos */
    } /* /habilitar_formularioCallback */

    var preprocesarDatosASalvar = function(p){
      trace( "preprocesarDatosASalvar "+p.subseccion);
      var salida ={
        datos: {},
        objetoStorage: {}
      };
      
      // ATENCION AQUI PROCESAR X SECTOR
      switch( p.subseccion ){
        case "perfil" :
          salida["datos"][0] = generar_id(p.datos);
          salida["objetoStorage"][0]= "perfil";
          break;
        case "preferencias" :
          salida["datos"][0] = p.datos;
          salida["objetoStorage"][0]= perfil.id+".configuracion.preferencias";
          break;
        case "otras" :
          salida["datos"][0] = p.datos;
          salida["objetoStorage"][0]= perfil.id+".configuracion.otras";
          break;
        case "agregarCarga" :
          salida["datos"][0] = $.extend(
            {},
            carga,
            p.datos
          );
          salida["objetoStorage"][0] = perfil.id+".datos.cargas."+p.datos.id;
          salida["datos"][1] = idCargaSiguiente();
          salida["objetoStorage"][1] = perfil.id+".datos.idClaveCarga";
          break;
        case "modificarCarga" :
          salida["datos"][0] = p.datos;
          salida["objetoStorage"][0] = perfil.id+".datos.cargas."+p.datos.id;
          break;
        default:
          break;
      }
      return ( p.callback )? p.callback( salida ) : salida;
    }; /* /preprocesarDatosASalvar */
    
    var resultadoPostSalvarFormulario = function(p){
      trace( "resultadoPostSalvarFormulario: subseccion "+p.subseccion );
      ui.mostrarDialogoResultado({
        target: p.subseccion,
        mensaje: "Los datos del formulario <strong>"+p.subseccion+"</strong> fueron salvados.",
        callbackOk: function(e){
          trace("callbackOk");
          if ( estado()=="SIN_CONFIGURACION" && p.subseccion=="perfil" ){
            trace('mostrar aviso de SIN_CONFIGURACION');
            bienvenida();
          }
        } /* /callbackOk */
      });
    }; /* /resultadoPostSalvarFormulario */
    
    var deshabilitarbotones_enviar = function(){
      trace("deshabilitarbotones_enviar");
      //$botones_enviar.unbind("click.mis_eventos");
    };
    
    var preprocesar_ir_a = {
      /*
      prepara las diferentes secciones y subsecciones
      antes de visualizar el cambio, como rellernar
      los forms con datos
      */
      verGrilla : function(){
        trace("preprocesar_ir_a :verGrilla");
        return "verGrilla";
      }
      ,
      agregarCarga : function(){
        trace("preprocesar_ir_a: agregarCarga");
        ui.ponerDatos ({
          form: "#agregarCarga",
          data: carga
        });
        return "agregarCarga";
      }
    };
    
    var callbacksPorDefecto = {
      /*
      se ejecutan al final la accion de enviar datos
      de los formularios
      */
      verGrilla : function(){
        trace("callbacksPorDefecto: verGrilla");
      }
      ,
      agregarCarga : function(){
        trace("callbacksPorDefecto: agregarCarga");
        trace("(nada por ahora)");
      }
    };
    
    borrar_todo = function(e){
      trace( "borrar_todo "+e);
      ui.mostrar_dialogo_confirmar({
        mensaje: "Borrar todos los datos ¿Estás MUY seguro? ¡Esto no se puede deshacer!",
        callbackSi: function(e){
          trace("Si");
          io.borrar_todo();          
          ui.mostrarDialogoResultado({
            mensaje: "Todos los datos locales fueron borrados.",
            callbackOk: function(e){
              trace("callbackOk");
            } /* /callbackOk */
          })
        } /* /callbackSi */
        ,
        callbackNo: function(e){
          trace("Cancelar");
        }
      }); /* /mostrar_dialogo_confirmar */
    }; /* /borrar_todo */
    
    borrar_cargas = function(e){
      trace( "DEV: borrar_cargas "+e.data.soy );
      var target = e.data.soy;
      lacuentita.ui.mostrar_dialogo_confirmar({
        target: target,
        mensaje: "Borrar todas las cargas y reiniciar el contador de IDs ¿Estás MUY seguro? ¡Esto no se puede deshacer!",
        callbackSi: function(e){
          trace("Si");
          /*
                    lacuentita["datos"]["cargas"] = {};
          lacuentita["datos"]["idClaveCarga"] = 0;
          trace('lacuentita["datos"]["cargas"] = '+lacuentita["datos"]["cargas"]);
          lacuentita.io.salvarDatos({
            datos: [ 
              lacuentita.datos.cargas,
              lacuentita.datos.idClaveCarga
            ],
            objetoStorage: [
              lacuentita.perfil.id+".datos.cargas",
              lacuentita.perfil.id+".datos.idClaveCargas"
            ]
          }); 
          lacuentita.io.borrar_cargas();
          */
          
          lacuentita.ui.mostrarDialogoResultado({
            target: target,
            mensaje: "Todos las datos locales de las cargas fueron borrados y se reinició el contador de IDs.",
            callbackOk: function(e){
              trace("callbackOk");
            } /* /callbackOk */
          })
        } /* /callbackSi */
        ,
        callbackNo: function(e){
          trace("Cancelar");
        }
      }); /* /mostrar_dialogo_confirmar */
    }; /* /borrar_todo */
    
    borrarObjeto = function (e){
      // var tmp = io.borrarObjeto(perfil.id+".preferencias");  
    }; /* /borrarObjeto */

  };/* /aplicacion */

  return aplicacion;

})(jQuery,moment);

trace("cargado "+archivo+".js");
/* fin js */
