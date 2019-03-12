
$(document).ready(function() {
  setInterval('animacionTitulo()', 4500);
});


function animacionTitulo() {
  console.log('Ejecución de Animación Titulo');
  var tiempo = [250, 250, 250, 1000, 1000]
  for (var i = 0; i < tiempo.length; i++) {
      $('.main-titulo').animate({ color: '#FFFFFF' }, tiempo[i]);
      $('.main-titulo').animate({ color: '#DCFF0E' }, tiempo[i]);
  }
  $('.main-titulo').animate({ color: '#DCFF0E' }, 2000);
}

var horizontales=0;
var verticales=0;
var aux=0;
var columns=["","","","","","",""];
var rows=["","","","","","",""];
var max=0;
var matriz=0;
var intervalo=0; 
var t_eliminar=0; 
var nuevo_elementos=0; 
var tiempo=0;  
var i=0;
var cont=0;  
var conc1=0;   
var pos_inicial;
var espera=0;
var score=0;
var mov=0;
var min=2;
var seg=0;

$(".btn-reinicio").click(function(){
  i=0;
  score=0;
  mov=0;
  $(".panel-score").css("width","25%");
  $(".panel-tablero").show();
  $(".time").show();
  $("#score-text").html("0")
  $("#movimientos-text").html("0")
  $(this).html("Reiniciar")
  clearInterval(intervalo);
  clearInterval(t_eliminar);
  clearInterval(nuevo_elementos);
  clearInterval(tiempo);
  min=2; 
  seg=0;
  limpiar()
  intervalo=setInterval(function(){desplazamiento()},600)
  tiempo=setInterval(function(){timer()},1000)
})

function timer(){
  if(seg!=0){
    seg=seg-1;
  }
  if(seg==0){
    if(min==0){
      clearInterval(t_eliminar);
      clearInterval(nuevo_elementos);
      clearInterval(intervalo);
      clearInterval(tiempo);
      $( ".panel-tablero" ).hide("drop","slow",callback);
      $( ".time" ).hide();
    }
    seg=59;
    min=min-1;
  }
  if(parseInt(seg) <=9){
    seg = "0"+seg;
  }
    
  $("#timer").html("0"+min+":"+seg);
}

function callback(){
    $( ".panel-score" ).animate({width:'100%'},4000);
}

function limpiar(){
  for(var j=1;j<8;j++){
    $(".col-"+j).children("img").detach();
  }
}

function desplazamiento(){
  i=i+1
  var numero=0;
  var imagen=0;

  $(".elemento").draggable({ disabled: true });
  if(i<8)
  {
    for(var j=1;j<8;j++)
    {
      if($(".col-"+j).children("img:nth-child("+i+")").html()==null)
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
      }
    }
  }
  if(i==8){
    clearInterval(intervalo);
    t_eliminar=setInterval(function(){t_eliminarhorver()},150) 
  }
}

function t_eliminarhorver(){
  matriz=0;
  horizontales=horizontal() 
  verticales=vertical()    

  for(var j=1;j<8;j++){
      matriz=matriz+$(".col-"+j).children().length;
  }

  if(horizontales==0 && verticales==0 && matriz!=49){
      clearInterval(t_eliminar);
      aux=0;
      nuevo_elementos=setInterval(function()
      {
        nuevosdulces();
      },600)
  }
  if(horizontales==1 || verticales==1)
  {
    $(".elemento").draggable({ disabled: true });
    $("div[class^='col']").css("justify-content","flex-end")
    $(".activo").hide("pulsate",1000,function(){
      var scoretmp=$(".activo").length *10;
      $(".activo").remove("img")
      score=score+scoretmp;
      $("#score-text").html(score);
    })
  }

  if(horizontales==0 && verticales==0 && matriz==49)
  {
    $(".elemento").draggable({
      disabled: false,
      containment: ".panel-tablero",
      revert: true,
      revertDuration: 0,
      snap: ".elemento",
      snapMode: "inner",
      snapTolerance: 40,
      start: function(event, ui){
        mov=mov+1;
        $("#movimientos-text").html(mov)
      }
    });
  }

  $(".elemento").droppable({
    drop: function (event, ui) {
      var dropped = ui.draggable;
      var droppedOn = this;
      espera=0;
      do{
        espera=dropped.swap($(droppedOn));
      }while(espera==0)
      horizontales=horizontal();
      verticales=vertical();
      if(horizontales==0 && verticales==0){
        dropped.swap($(droppedOn));
      }
      if(horizontales==1 || verticales==1){
        clearInterval(nuevo_elementos);
        clearInterval(t_eliminar);
        t_eliminar=setInterval(function(){t_eliminarhorver()},150);
      }
    },
  });
}

jQuery.fn.swap = function(b){
    b = jQuery(b)[0];
    var a = this[0];
    var t = a.parentNode.insertBefore(document.createTextNode(''), a);
    b.parentNode.insertBefore(a, b);
    t.parentNode.insertBefore(b, t);
    t.parentNode.removeChild(t);
    return this;
};


function nuevosdulces(){
  $(".elemento").draggable({ disabled: true });
  //alert("pase")
  $("div[class^='col']").css("justify-content","flex-start")
  for(var j=1;j<8;j++)
  {
      columns[j-1]=$(".col-"+j).children().length;
  }
  if(aux==0)
  {
    for(var j=0;j<7;j++)
    {
      rows[j]=(7-columns[j]);
    }
    max=Math.max.apply(null,rows);
    cont=max;
  }
  if(max!=0)
  {
    if(aux==1)
    {
      for(var j=1;j<8;j++)
      {
        if(cont>(max-rows[j-1]))
        {
          $(".col-"+j).children("img:nth-child("+(rows[j-1])+")").remove("img")
        }
      }
    }
    if(aux==0)
    {
      aux=1;
      for(var k=1;k<8;k++)
      {
        for(var j=0;j<(rows[k-1]-1);j++)
        {
            $(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>")
        }
      }
    }
    for(var j=1;j<8;j++)
    {
      if(cont>(max-rows[j-1]))
      {
        numero=Math.floor(Math.random() * 4) + 1 ;
        imagen="image/"+numero+".png";
        $(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>")
      }
    }
  }
  if(cont==1)
  {
      clearInterval(nuevo_elementos);
      t_eliminar=setInterval(function(){t_eliminarhorver()},150)
  }
  cont=cont-1;
}

function horizontal(){
  var hor=0;
  for(var j=1;j<8;j++)
  {
    for(var k=1;k<6;k++)
    {
      var res1=$(".col-"+k).children("img:nth-last-child("+j+")").attr("src")
      var res2=$(".col-"+(k+1)).children("img:nth-last-child("+j+")").attr("src")
      var res3=$(".col-"+(k+2)).children("img:nth-last-child("+j+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+1)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          $(".col-"+(k+2)).children("img:nth-last-child("+(j)+")").attr("class","elemento activo")
          hor=1;
      }
    }
  }
  return hor;
}


function vertical(){
  var ver=0;
  for(var l=1;l<6;l++)
  {
    for(var k=1;k<8;k++)
    {
      var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src")
      var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src")
      var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src")
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null))
      {
          $(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo")
          $(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo")
          ver=1;
      }
    }
  }
  return ver;
}
