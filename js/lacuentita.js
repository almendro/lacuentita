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
    
    var forms_json; // aca se definen los esquemas de formularios.
    
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
        
        // Referenciar los módulos e inicializarlos
        
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
        
        forms_json = {
					"perfil" : {
						"schema": {
							"nombre": {
								"type": "string",
								"title": "Nombre",
								"required": true
							},
							"alias": {
								"type": "string",
								"title": "Alias o apodo"
							},
							"email": {
								"type": "string",
								"title": "Email",
								"required": true
							},
							"id": {
								"type": "string",
								"title": "Id"
							}
						} // schema
						,
						"form": [
							{
								"key": "nombre"
							},
							{
								"key": "alias"
							},
							{
								"key": "email",
								"type": "email"
							},
							{
								"key": "id",
								"readonly": true
							},
							{
								"type": "submit",
								"title": "Enviar"
							}
						] // form
						,
						onSubmit: enviar_form_perfil
					} // perfil
					,
					"herramientas": {
						"convertir_csv_qif": {
							"cargar_csv": {
								"schema": {
									"archivo": {
										"type": "file",
										"title": "Seleccione el archivo CSV"
									}
								},
								"form": [
									{
										"key": "archivo",
										"title": "Seleccione CSV",
										"onChange": function (evt) {
											var value = $(evt.target).val();
											if (value) trace("onChange: "+value);
										}
									},
									{
										"type": "submit",
										"title": "Enviar CSV"
									}
								] // form
								,
								onSubmit: enviar_form_convertir_csv_qif_cargar_csv
							} // cargar_archivo
						} // convertir
					} // herramientas
				}; // forms_json
					
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
                empresa: 0, //ID key
                local: 0 //ID key
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
              pv: 0, // punto de venta
              ticket: 0, // tickets nro.
              hora: "HHMMSS",
              productos: [{
                id: 0, // el codigo que figura en el ticket: puede ser el interno del comercio o el EAN/UCC13
                cantidad: 0,
                precio: 0, // unitario
                monto: 0, // se calcula solo
                etiquetas_personales: []
              }], // productos
              descuentos: [{
								id_producto: 0, // id del producto asociado
								tipo: "2x1 | 70% 2da unidad, etc", // texto descriptivo 2x1, 70% segunda unidad, promo club, precio especial, etc
								monto: 0
								}],
              total_descuentos: 0, // se calcula en base a los "tipo"
              total: 0, // monto total
              total_a_pagar: 0
              
            }], // cuentitas
            etiquetas_personales: [],
            etiquetas_mapa: [] // para relacionar las etiquetas personales y las generales
          } // usuario
        }; // datos
        
        /* FIN ESTRUCTURA DE DATOS */
        
        hoy = moment().format("YYYYMMDD");
        
        /*
        $secciones = $( ".seccion" );
        $subsecciones = $( ".subseccion" );
        $botones_enviar = $( ".enviar" );
        */
        
        $("#agregar_perfiles form").empty().jsonForm(forms_json.perfil);
        //$("#convertir_csv_qif #cargar_csv").jsonForm(forms_json.herramientas.convertir_csv_qif.cargar_csv);
        
        //$("#enviar_archivo_csv").click(eventData, enviar_form_convertir_csv_qif_cargar_csv);
        
        document.getElementById('archivo_csv').addEventListener('change', handleFileSelect, false);
        
    }; /* this.iniciar */

    
    var enviar_form_perfil = function (errors, values) {
			if (errors) {
				$('#agregar_perfiles').append('<p>Falta algo</p>');
			}
			else {
				$('#agregar_perfiles').append('<p>Hola ' + values.nombre + '</p>');
			}
		}
		
		// https://www.html5rocks.com/en/tutorials/file/dndfiles/
		
		function handleFileSelect(evt) {
			var files = evt.target.files; // FileList object

			// files is a FileList of File objects. List some properties.
			var output = [];
			for (var i = 0, f; f = files[i]; i++) {
				output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					f.size, ' bytes, last modified: ',
					f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
					'</li>');
					
				var reader = new FileReader();

				// Closure to capture the file information.
				reader.onload = (function(theFile) {
					return function(e) {
						// Render thumbnail.
						var span = document.createElement('span');
						span.innerHTML = e.target.result;
						document.getElementById('list').insertBefore(span, null);
					};
				})(f);

				// Read in the image file as a data URL.
				reader.readAsText(f);
			}
			document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
		}
		
		var enviar_form_convertir_csv_qif_cargar_csv = function (eventData) {
			if (errors) {
				$('#convertir_csv_qif').append('<p>Falta algo</p>');
			}
			else {
				trace("values ="+JSON.stringify(values));
				$('#convertir_csv_qif').append('<p>ARCHIVO CSV ' + values.archivo + '</p>');
			}
		}
		
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
