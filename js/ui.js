/* 

La Cuentita
-----------

Martín Ochoa
2017-07-17


*/


var lacuentita = window.lacuentita || {};

lacuentita.ui = (function($){
    
  var $secciones, $subsecciones,
      $dialogosDiv;
      
  var $celdasCargas;
  
  var ui = {
    
    iniciar : function(){
      trace("---");
      trace('iniciamos la UI');
      
      $secciones = $( ".seccion" );
      $subsecciones = $( ".subseccion" );
      $dialogosDiv = $( "#dialogos_div" );
      
      trace("secciones: "+$secciones.length);
      trace("subsecciones: "+$subsecciones.length);
      
      $celdasCargas = $("table.listado tr > *");
      trace("celdasCargas ="+$celdasCargas.length);
      
    } /* iniciar */
    , 

    ocultarDialogos : function (){
      trace('ocultarDialogos');
    //  $(".dialogo").fadeOut(300);
    }
    ,
    mostrarDialogoConfirmar : function (p){
      trace("mostrarDialogoConfirmar");
      var $dialogo = ui.crearDialogo({
        classCss: "confirmar",
        botones: [{
            classCss: "dialogo_si",
            etiqueta: "SI",
            callback: p.callbackSi
          },{
            classCss: "dialogo_no",
            etiqueta: "NO",
            callback: p.callbackNo,
            terminar: true
          }]
      });
      trace("$dialogo id="+$dialogo.attr("id"));
      $(".mensaje",$dialogo).html(p.mensaje);
      $dialogosDiv.fadeIn(100);
      $dialogo.fadeIn(300);
    } /* /mostrarDialogoConfirmar */
    ,
    mostrarDialogoResultado: function (p){
      trace("mostrarDialogoResultado");
      var $dialogo = ui.crearDialogo({
        classCss: "resultado",
        botones: [{
          classCss: "dialogo_ok",
          etiqueta: "OK",
          callback: p.callbackOk,
          terminar: true
        }]
      });
      trace("$dialogo id="+$dialogo.attr("id"));
      $(".mensaje",$dialogo).html(p.mensaje);
      $dialogosDiv.fadeIn(100);
      $dialogo.fadeIn(300);
    } /* /mostrarDialogoResultado */
    ,
    crearDialogo : function (p){
      var botones = p.botones;
      
      var id = "dialogo_"+p.classCss;
      trace("crearDialogo id="+id);
      var popup;
      popup = '<div id="'+id+'" ';
          popup+= 'class="dialogo" >';
          popup+= '<div data-role="header" data-theme="a">';
          popup+= '<h1>Confirmar</h1>';
          popup+= '</div>';
          popup+= '<div role="main" class="ui-content">';
          popup+= '<h3 class="mensaje ui-title">(mensaje)</h3>';
      for ( b in botones ){
        popup+= '<button class="'+botones[b]["class"]+' ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" data-rel="back">'+botones[b]["etiqueta"]+'</button>'; 
      }
      popup+= '</div>';
      popup+= '</div><!-- -->';
            
      trace("");
      //trace(popup);
      $(popup).appendTo( $dialogosDiv );
      var $popup = $("#"+id);
      $popup.hide();
      // agrega los eventos y callback a cada  botón
      for ( b in botones ){
        $("."+botones[b]["class"],$popup)
          .bind(
            "click.misEventos",
            {
              $dialogo: $popup,
              callback: botones[b]["callback"],
              terminar: botones[b]["terminar"]
            },
            ui.cerrarDialogo
          );
      }
      return $popup;
    } /* /crearDialogo */
    ,
    cerrarDialogo: function (p){
      p.data.callback();
      trace("cerrarDialogo "+p.data.$dialogo.attr("id"));
      p.data.$dialogo.fadeOut(300).remove();
      if (p.data.terminar == true ){
        $dialogosDiv.fadeOut(100);
      }
    }
    ,
    eliminarDialogo: function (p){
      trace("eliminarDialogo "+p.$dialogo.attr("id"));
          /*
          $( document ).on( 
            "popupafterclose", 
            e.data.$dialogo, 
            function() {
              $( this ).remove();
            }
          );*/
      p.$dialogo.remove();
      $dialogosDiv.fadeOut(100);
    } /* /eliminarDialogo */
    ,
    
    /* --- MANEJO DE SECCIONES --- */
    
    mostrarSeccion : function (seccion){
      trace('UI: mostrarSeccion '+seccion);
      ui.ocultarSecciones();

      $secciones
        .filter($("#"+seccion))
        .fadeIn(300)
        .addClass("actual");
        
      $("#menu_principal a" )
        .removeClass("actual")
        .filter("#m_"+seccion)
        .addClass("actual");
        
    } /* /mostrarSeccion */
    ,
    
    ocultarSecciones : function (){
      trace('UI: ocultarSecciones');
      $secciones
        .hide()
        .removeClass("actual");
    } /* /ocultarSecciones */
    ,
    
    habilitarSeccion : function (seccion){
      seccion = listar(seccion);
      for ( s in seccion ){
        $("#m_"+seccion[s])
          .removeClass("deshabilitada")
          .show();
      }      
    } /* /habilitarSeccion */
    ,
    deshabilitarSeccion : function (seccion){
      seccion = listar(seccion);
      for ( s in seccion ){
        $("#m_"+seccion[s])
          .addClass("deshabilitada")
          .hide();
      }      
    } /* /deshabilitarSeccion */
    ,
    
    /* --- Manejo de SUBSECCIONES --- */
    
    mostrarSubseccion : function (subseccion){
      trace('UI: mostrarSubseccion '+subseccion);
      
      ui.ocultarSubsecciones();
      
      var prop = ui.subseccionProp(subseccion);
      
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
        ui.mostrarSeccion(prop.seccion);
      }
    } /* / mostrarSubseccion */
    ,
    
    ocultarSubsecciones : function (){
      trace('UI: ocultarSubsecciones');
      
      $subsecciones
        .hide()
        .removeClass("actual");
    } /* /ocultarSubsecciones */
    ,
    
    habilitarSubseccion : function (subseccion){
      trace( "UI: habilitarSubseccion "+subseccion);
      /*
      modo jQM 
      establecemos propiedad enabled del botón
      y mostramos el <a>
      *
      var prop = this.subseccionProp(subseccion);
      var $seccion = prop.$seccion;
      var indice = prop.indice;
      $( "[data-role='tabs']",$seccion ).tabs("option","enabled",[indice]);
      */
      
      $( "#a_"+subseccion).show();
      
    } /* /habilitarSubseccion */
    ,
    deshabilitarSubseccion : function (subseccion){
      /*
      subseccion puede ser un STRING o ARRAY de STRINGS
      */
      trace("UI: deshabilitarSubseccion "+subseccion);
      
      subseccion = listar(subseccion);
      var prop, $seccion, indice;
      for ( s in subseccion) {
        trace("..."+subseccion[s]);
        /*
        prop = this.subseccionProp(subseccion[s]);
        $seccion = prop.$seccion;
        indice = prop.indice;
        $( "[data-role='tabs']",$seccion ).tabs("option","disabled",[indice]);
        $( "#"+subseccion[s], $seccion ).hide();
        */
        
        $( "#a_"+subseccion[s], $seccion ).hide();
      }
    } /* /deshabilitarSubseccion */
    ,
     
    subseccionProp : function(subseccion){
      /* devuelve el indice y seccion */
      var $seccion = $("#"+subseccion).parents(".seccion");
      trace("UI: subseccionProp seccion ="+ $seccion.attr("id"));
      var $subsecciones = $(".subseccion",$seccion);
      var indice = ($subsecciones.filter("#"+subseccion).index())-1;
      //trace(subseccion+" indice= "+indice);
      return {
        $seccion: $seccion,
        seccion: $seccion.attr( "id" ),
        indice: indice,
        subseccion: subseccion
      }
    } /* /subseccionProp */
    ,
    
    subseccionActivada: function(p){
      trace("subseccionActivada en seccion "+p.seccion);
      return $( ".activada", $("#"+p.seccion) ).attr("id");
    }
    ,
    
    aplicarPlantilla : function (p){
      /*
      Aplica una plantilla html, por lo general
      un formulario que se repite, a una subsección
      que tiene una acción diferente sobre
      un mismo conjunto de datos. Ej. ABM CARGAS
      
      aplicarPlantilla({
        $subseccion: jQuery
      });
      
      */
      var salida,
          $miPlantilla,
          $enviar;
      trace("aplicarPlantilla $subseccion"+p.$subseccion.attr("id"));
      
      $miPlantilla = $( "[data-plantilla-id='"+p.$subseccion.attr( "data-plantilla" )+"']" ).clone();
      $miPlantilla.
        removeAttr("data-plantilla-id").
        removeClass("plantilla_html");
      $enviar = $( ".enviar", $miPlantilla );
      $enviar.text(
        p.$subseccion.attr("data-plantilla-enviar")
      );
      p.$subseccion.append($miPlantilla);
            
      salida = $miPlantilla;
      
      return (p.callback) ? p.callback( salida ) : salida;
    } /* /aplicarPlantilla */
    ,
    
    mostrarMensajeSeccion : function (div,m){
      $(".mensaje",$(div)).hide();
      $("."+m,$(div)).show();
    } /* /mostrarMensajeSeccion */
    ,
    
    verPreferencias : function (p){
      trace('UI: verPreferencias '+p);
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
      
    } /* verPreferencias */
    ,
    
    ponerDatos : function ( p ){
      trace('UI: ponerDatos '+p);
      return populateForm (p); // Asset externo
    } /* ponerDatos */
    ,
    crearHtmlItemCarga: function(p){
      //var $modeloFila = $("[data-plantilla-id='filaCarga']").clone;
      var filaHtml = ""; // <tr>
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
        filaHtml += "<td data-id=\""+v+"\" class=\""+v+"\" >";
        filaHtml += p.carga[v];
        filaHtml += "</td>";
      }
      //filaHtml += "</tr>";
      return filaHtml;
    } /* /crearHtmlItemCarga */
    ,
    listarCargas : function(p){
    
      trace("UI listarCargas");
      var datos = p.datos;
      var subseccion = p.subseccion;
      var $subseccion = $subsecciones.filter("#"+subseccion);
      var filasHtml, filaHtml, filaHead;
      var $tbody = $("tbody",$subseccion);
      var $thead = $("thead",$subseccion);
      filasHtml = "";
      trace("filas de datos: "+contar(datos));
      for( d in datos ){
        trace("d = "+d);
        filaHtml = ui.crearHtmlItemCarga({
          carga: datos[d]
        });
        filaHtml = '<tr><td class="acciones"><button class="modificarCarga">M</button></td>' + filaHtml;
        filaHtml +='<td class="acciones"><button class="borrarCarga">X</button></td></tr>';
        
        filasHtml += filaHtml;
      }
      $tbody.append(filasHtml);
      trace("fila cabecera");
      filaHead =  ui.crearHtmlItemCarga({
        carga: p.texto.carga
      });
      filaHead = replaceAll(filaHead, "<td","<th");
      filaHead = replaceAll(filaHead, "</td","</th");
      filaHead = '<tr><th class="acciones">M</th>' + filaHead;
      filaHead +='<th class="acciones">X</th></tr>';

      $thead.append(filaHead);
      
      
      /**/
      trace("listo");
    } /* /listarCargas */
    ,
    filtrarListado: function(p){
      trace( "UI: filtrarListado" );
      $celdasCargas = $("table.listado tr > *");
      var vista = p.vista;
      $celdasCargas.each(function(e){
        if( vista[ $(this).attr("data-id") ] == false )
        {
          $(this).hide();
        } 
        else
        {
          $(this).show();
        }
      });
    } /* /filtrarListado */
  };
  
  return ui;

})(jQuery);

trace("cargado ui.js");
/* fin js */