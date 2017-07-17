        var populateForm = function(p){
          //log(JSON.stringify(p));
          var form = p.form;
          var data = p.data;
          var z = p.z==undefined ? 0: p.z;
          //log("z = "+z);
          var d;
          var target;
          var $elemento;
          for ( d in data){
            target = z==0 ? String(d) : p.target+"["+String(d)+"]";
            //log("target = "+target);
            if (typeof data[d] === "object" ){
              /* recursiva */
              //log("objet");
              z++;
              populateForm({
                form: form,
                data: data[d],
                z: z,
                target: target
              });
            } else {
              /* poner valor */
              //log("d = "+data[d]);
              
              $elemento = $("[name='"+target+"']", $(form));
              
              /*
              aqui se puede poner un detectorm de data-type tambien
              */
              //log("type "+$elemento.attr("type"));
              switch($elemento.attr("type"))  
              {  
                case "text":
                case "hidden":
                case "textarea":
                case "number":
                  $elemento.val(data[d]);   
                break;   
                case "checkbox":
                    $elemento.attr("checked",data[d]);
                    $elemento.val(data[d]);
                break;
                case "radio":
                  $elemento.each( function (){
                    if($(this).attr('value') == data[d]) {
                      $elemento.attr("checked",data[d]); 
                    }
                    $elemento.attr('value',data[d]);
                  });
                break;
              } 
            }
          }
          return true;
        }; /* populateForm */
        // usando variante: https://stackoverflow.com/a/21023179
        // ver otra opcion: https://stackoverflow.com/a/29241028
        /*
        
        populateForm({
          form: "#preferencias",
          data: pre
        });
        */
