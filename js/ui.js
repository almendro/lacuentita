/* 

La Cuentita
-----------

Martín Ochoa (almendro)
2017-07-17

https://github.com/almendro/lacuentita
*/


var lacuentita = window.lacuentita || {};

lacuentita.ui = (function($){
    
  var $secciones, 
			$subsecciones,
      $dialogos_div;
      
  var $celdas_cargas;
  
  var ui = {
    
    iniciar : function(){
      trace("---");
      trace('iniciamos la UI');
      
      $secciones = $( ".seccion" );
      $subsecciones = $( ".subseccion" );
      
      trace("secciones: "+$secciones.length);
      trace("subsecciones: "+$subsecciones.length);
    
      $('.menu-toggle').click(function() {
      
          $('#menu_principal ul').toggleClass('opening');
          $(this).toggleClass('open');
      
			});
			$('#menu_principal ul a').bind("click", function(e){
				$('.menu-toggle').click();
			});
			
    } /* iniciar */
    , 

    ocultar_dialogos : function (){
      trace('ocultar_dialogos');
    //  $(".dialogo").fadeOut(300);
    }
    ,
    mostrar_dialogo_confirmar : function (p){
      trace("mostrar_dialogo_confirmar");
      var $dialogo = ui.crear_dialogo({
        class_css: "confirmar",
        botones: [{
            class_css: "dialogo_si",
            etiqueta: "SI",
            callback: p.callback_si
          },{
            class_css: "dialogo_no",
            etiqueta: "NO",
            callback: p.callback_no,
            terminar: true
          }]
      });
      trace("$dialogo id="+$dialogo.attr("id"));
      $(".mensaje",$dialogo).html(p.mensaje);
      $dialogos_div.fadeIn(100);
      $dialogo.fadeIn(300);
    } /* /mostrar_dialogo_confirmar */
    ,
    mostrar_dialogo_resultado: function (p){
      trace("mostrar_dialogo_resultado");
    } // mostrar_dialogo_resultado
    ,
    crear_dialogo : function (p){

    } // crear_dialogo
    ,
    cerrar_dialogo: function (p){
    } // cerra_dialogo
    ,
    eliminar_dialogo: function (p){
      trace("eliminar_dialogo "+p.$dialogo.attr("id"));
          /*
          $( document ).on( 
            "popupafterclose", 
            e.data.$dialogo, 
            function() {
              $( this ).remove();
            }
          );*/
      p.$dialogo.remove();
      $dialogos_div.fadeOut(100);
    } /* /eliminar_dialogo */
    ,
    
    /* --- MANEJO DE SECCIONES --- */
    
    mostrar_seccion : function (seccion){
      trace('UI: mostrar_seccion '+seccion);
      ui.ocultar_secciones();

      $secciones
        .filter($("#"+seccion))
        /*.fadeIn(300)*/
        .addClass("actual");
        
      $("#menu_principal a" )
        .removeClass("actual")
        .filter("#m_"+seccion)
        .addClass("actual");
        
    } /* /mostrar_seccion */
    ,
    
    ocultar_secciones : function (){
      trace('UI: ocultar_secciones');
      $secciones
        /*.hide()*/
        .removeClass("actual");
    } /* /ocultar_secciones */
    ,
    
    habilitar_seccion : function (seccion){
      seccion = listar(seccion);
      for ( s in seccion ){
        $("#m_"+seccion[s])
          .removeClass("deshabilitada")
          .show();
      }      
    } /* /habilitar_seccion */
    ,
    deshabilitar_seccion : function (seccion){
      seccion = listar(seccion);
      for ( s in seccion ){
        $("#m_"+seccion[s])
          .addClass("deshabilitada")
          .hide();
      }      
    } /* /deshabilitar_seccion */
    ,
    
    /* --- Manejo de SUBSECCIONES --- */
    
    mostrar_subseccion : function (subseccion){
      trace('UI: mostrar_subseccion '+subseccion);
      
      ui.ocultar_subsecciones();
      
      var prop = ui.subseccion_propiedades(subseccion);
      
      trace("indice "+prop.indice+" de seccion "+prop.seccion);
      
      $(".subseccion", prop.$seccion)
        .removeClass("activada");

      var $subseccion =
        $subsecciones
        .filter($("#"+subseccion));
        
      $subseccion
        .fadeIn(300)
        .addClass("actual")
        .addClass("activada");      
     
      $(".barra a", prop.$seccion )
        .removeClass("actual")
        .filter("#a_"+subseccion)
        .addClass("actual");

      if( prop.seccion != $secciones.filter(".actual").attr("id") ){
        ui.mostrar_seccion(prop.seccion);
      }
    } /* / mostrar_subseccion */
    ,
    
    ocultar_subsecciones : function (){
      trace('UI: ocultar_subsecciones');
      
      $subsecciones
        .hide()
        .removeClass("actual");
    } /* /ocultar_subsecciones */
    ,
    
    habilitar_subseccion : function (subseccion){
      trace( "UI: habilitar_subseccion "+subseccion);
      /*
      modo jQM 
      establecemos propiedad enabled del botón
      y mostramos el <a>
      *
      var prop = this.subseccion_propiedades(subseccion);
      var $seccion = prop.$seccion;
      var indice = prop.indice;
      $( "[data-role='tabs']",$seccion ).tabs("option","enabled",[indice]);
      */
      
      $( "#a_"+subseccion).show();
      
    } /* /habilitar_subseccion */
    ,
    deshabilitar_subseccion : function (subseccion){
      /*
      subseccion puede ser un STRING o ARRAY de STRINGS
      */
      trace("UI: deshabilitar_subseccion "+subseccion);
      
      subseccion = listar(subseccion);
      var prop, $seccion, indice;
      for ( s in subseccion) {
        trace("..."+subseccion[s]);
        /*
        prop = this.subseccion_propiedades(subseccion[s]);
        $seccion = prop.$seccion;
        indice = prop.indice;
        $( "[data-role='tabs']",$seccion ).tabs("option","disabled",[indice]);
        $( "#"+subseccion[s], $seccion ).hide();
        */
        
        $( "#a_"+subseccion[s], $seccion ).hide();
      }
    } /* /deshabilitar_subseccion */
    ,
     
    subseccion_propiedades : function(subseccion){
      /* devuelve el indice y seccion */
      var $seccion = $("#"+subseccion).parents(".seccion");
      trace("UI: subseccion_propiedades seccion ="+ $seccion.attr("id"));
      var $subsecciones = $(".subseccion",$seccion);
      var indice = ($subsecciones.filter("#"+subseccion).index())-1;
      //trace(subseccion+" indice= "+indice);
      return {
        $seccion: $seccion,
        seccion: $seccion.attr( "id" ),
        indice: indice,
        subseccion: subseccion
      }
    } /* /subseccion_propiedades */
    ,
    
    subseccion_activada: function(p){
      trace("subseccion_activada en seccion "+p.seccion);
      return $( ".activada", $("#"+p.seccion) ).attr("id");
    }
    ,
    
    /* --- MANEJO DE PLANTILLAS HTML --- */
    
    aplicar_plantilla : function (p){
      /*
      Aplica una plantilla html, por lo general
      un formulario que se repite, a una subsección
      que tiene una acción diferente sobre
      un mismo conjunto de datos. Ej. ABM CARGAS
      
      aplicar_plantilla({
        $subseccion: jQuery
      });
      
      */
      var salida,
          $mi_plantilla,
          $enviar;
      trace("aplicar_plantilla $subseccion"+p.$subseccion.attr("id"));
      
      $mi_plantilla = $( "[data-plantilla-id='"+p.$subseccion.attr( "data-plantilla" )+"']" ).clone();
      $mi_plantilla.
        removeAttr("data-plantilla-id").
        removeClass("plantilla_html");
      $enviar = $( ".enviar", $mi_plantilla );
      $enviar.text(
        p.$subseccion.attr("data-plantilla-enviar")
      );
      p.$subseccion.append($mi_plantilla);
            
      salida = $mi_plantilla;
      
      return (p.callback) ? p.callback( salida ) : salida;
    } /* /aplicar_plantilla */
    ,
    
    mostrar_mensaje_seccion : function (div,m){
      $(".mensaje",$(div)).hide();
      $("."+m,$(div)).show();
    } /* /mostrar_mensaje_seccion */
    ,
    
    ver_preferencias : function (p){
      trace('UI: ver_preferencias '+p);
      var $div = $(p.div);
      var $propiedades = $( ".propiedad" , $div ).each( function (e) { 
        var soy = $(this);
        var $valor = $(".valor", soy);
        var id_propiedad = soy.attr("id");
        var propiedad = id_propiedad.replace(p.prefijo,"");
        //trace(propiedad+" = "+soy.val());
        $valor.text(p.datos[propiedad]);
        trace (propiedad+" = "+p.datos[propiedad]);
      });
      
    } /* ver_preferencias */
    ,
    
    poner_datos : function ( p ){
      trace('UI: poner_datos '+p);
      return populateForm (p); // Asset externo
    } /* poner_datos */
    ,
    crear_html_item_carga: function(p){
      //var $modeloFila = $("[data-plantilla-id='filaCarga']").clone;
      var fila_html = ""; // <tr>
      /*
      var opciones = $.extend(
      {},
      {  etiqueta : "td",
      p.
      });
      */
      var carga = p.carga;
      var v;
      for( v in p.carga ){
        // trace("v = "+v);
        fila_html += "<td data-id=\""+v+"\" class=\""+v+"\" >";
        fila_html += p.carga[v];
        fila_html += "</td>";
      }
      //fila_html += "</tr>";
      return fila_html;
    } /* /crear_html_item_carga */
    ,
    listar_cargas : function(p){
    
      trace("UI listar_cargas");
      var datos = p.datos;
      var subseccion = p.subseccion;
      var $subseccion = $subsecciones.filter("#"+subseccion);
      var filas_html, fila_html, fila_head;
      var $tbody = $("tbody",$subseccion);
      var $thead = $("thead",$subseccion);
      filas_html = "";
      trace("filas de datos: "+contar(datos));
      for( d in datos ){
        trace("d = "+d);
        fila_html = ui.crear_html_item_carga({
          carga: datos[d]
        });
        fila_html = '<tr><td class="acciones"><button class="modificarCarga">M</button></td>' + fila_html;
        fila_html +='<td class="acciones"><button class="borrarCarga">X</button></td></tr>';
        
        filas_html += fila_html;
      }
      $tbody.append(filas_html);
      trace("fila cabecera");
      fila_head =  ui.crear_html_item_carga({
        carga: p.texto.carga
      });
      fila_head = replaceAll(fila_head, "<td","<th");
      fila_head = replaceAll(fila_head, "</td","</th");
      fila_head = '<tr><th class="acciones">M</th>' + fila_head;
      fila_head +='<th class="acciones">X</th></tr>';

      $thead.append(fila_head);
      
      
      /**/
      trace("listo");
    } /* /listar_cargas */
    ,
    filtrar_listado: function(p){
      trace( "UI: filtrar_listado" );
      $celdas_cargas = $("table.listado tr > *");
      var vista = p.vista;
      $celdas_cargas.each(function(e){
        if( vista[ $(this).attr("data-id") ] == false )
        {
          $(this).hide();
        } 
        else
        {
          $(this).show();
        }
      });
    } /* /filtrar_listado */
  };
  
  return ui;

})(jQuery);

trace("cargado ui.js");
/* fin js */
