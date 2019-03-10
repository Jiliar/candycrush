var elementos;

$(document).ready(function() {
    setInterval('animacionTitulo()', 4500);
    llenarTablero();
    initVectores();
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

function llenarTablero() {
    console.log('Ejecución de Llenado de Tablero');
    var pos = 1;
    for (var j = 1; j <= 7; j++) {
        for (var i = 1; i <= 7; i++) {
            var id = Math.floor(Math.random() * 4) + 1;
            $('.col-' + i).append("<img src='image/" + id + ".png' alt='" + id + "'  id='" + pos + "' />");
            pos++;
        }
    }
}

function initVectores() {
    imagenes = $(".panel-tablero div[class^='col-'] img");
    elementos = new Array();
    for (var i = 0; i < imagenes.length; i++) {
        var id = "#" + imagenes[i].id;
        var coord = $(id).position();
        var posicion = { top: coord.top, left: coord.left };
        elementos[imagenes[i].id - 1] = { id: imagenes[i].id, tipo: imagenes[i].alt, coordenadas: posicion };
    }
}

function verificacionElementos() {
    var elementosVertical = new Array();
    var columna;
    var pos = 0;
    //verificación Vertical
    for (var j = 1; j <= 7; j++) {
        id = '.col-' + j + ' img';
        columna = $(id);
        size = columna.length;
        var inc = 0;
        var aux = 0;
        var id_elemento = new Array();
        for (var i = 0; i < size; i++) {
            dec = i - 1;
            inc = i + 1;
            var elemento_actual = columna[i].alt;
            var elemento_proximo = inc < size ? columna[inc].alt : null;
            var elemento_anterior = dec > 0 ? columna[dec].alt : null;
            if (elemento_actual == elemento_proximo) {
                id_elemento[aux] = columna[i].id;
                id_elemento[aux + 1] = columna[inc].id;

                if (elemento_anterior == elemento_actual && elemento_anterior != null) {
                    id_elemento[aux - 1] = columna[dec].id;
                }

                aux = aux + 1;
            } else {
                elemento_actual = null;
                aux = 0;
            }
            if (aux >= 2) {
                $.each(id_elemento, function(key, value) {
                    var elemento = '#' + value;
                    elementosVertical[pos] = value;
                    pos++;
                    $(elemento).addClass('parpadea');
                });
            }
        }
    }

    //verificación Horizontal
    var aux2 = 0;
    var pos2 = 0;
    var id_elemento2 = new Array();
    var elementosHorizontal = new Array();
    var noRegiones = [7, 8, 14, 15, 21, 22, 28, 29, 35, 36, 42, 43, 49];
    for (var z = 0; z < elementos.length; z++) {
        if (z == 0) {
            var index = parseInt(elementos[z].id) - 1;
            var limit = parseInt(elementos[z].id) + 6;
        } else {
            index = limit;
            limit = index + 6;
        }

        for (var h = index; h < elementos.length; h++) {

            dec = h - 1;
            inc = h + 1;
            var elemento_actual = elementos[h].tipo;
            var elemento_proximo = inc < limit ? elementos[inc].tipo : null;
            if (elemento_actual == elemento_proximo) {
                id_elemento2[aux2] = elementos[h].id;
                id_elemento2[aux2 + 1] = elementos[inc].id;
                aux2 = aux2 + 1;
            } else {
                aux2 = 0;
            }
            if (aux2 == 0 || aux2 == 7) {
                if (id_elemento2.length >= 3) {

                    var flag = false;
                    for (var z = 0; z < id_elemento2.length - 1; z++) {
                        var actual1 = id_elemento2[z];
                        var proximo1 = id_elemento2[z + 1];
                        for (var y = 0; y < noRegiones.length - 1; y++) {
                            var actual2 = noRegiones[y];
                            var proximo2 = noRegiones[y + 1];
                            if (actual1 == actual2 && proximo1 == proximo2) {
                                id_elemento2 = new Array();
                            }
                        }
                    }
                    $.each(id_elemento2, function(key, value) {
                        if (flag) {
                            id_elemento2 = new Array();
                        } else {
                            var elemento = '#' + value;
                            elementosHorizontal[pos2] = value;
                            $(elemento).addClass('parpadea');
                            id_elemento2 = new Array();
                        }
                        pos2++;
                    });

                }
            }
        }
    }
    var elementosFinal = $.merge(elementosVertical, elementosHorizontal);
    puntuacionMovimiento(elementosFinal);
    gestionElementos(elementosFinal);
}

function puntuacionMovimiento(vector) {
    setTimeout(function() {
        $("#score-text").fadeOut("slow", function() {
            var puntos = parseInt($(this).text());
            var acumulador = puntos + (vector.length * 10);
            $(this).text(acumulador).fadeIn();
        });
    }, 2000);
}

function gestionElementos(vector) {
    posicionesGenerar = new Array();
    setTimeout(function() {
        $.each(vector, function(key, value) {
            id = '#' + value;
            for (var i = 0; i < elementos.length; i++) {
                if(elementos[i].id == value){
                    var newId = Math.floor(Math.random() * 4) + 1;
                    $(id).remove();
                    /*var newElement = $('<img/>', {
                                        'src' : 'image/' + newId + '.png',
                                        'alt' : "'"+newId+"'",
                                        'id' : "'"+elementos[i].id +"'"
                                     });*/
                    var newElement = $("<img src='image/" + newId + ".png' alt='" + newId + "'  id='" + elementos[i].id + "' />");
                    console.log('new Element: '+newElement);
                    generarPosiciones(newElement, elementos[i].coordenadas.left, elementos[i].coordenadas.top);
                }
            }
            
        });
    }, 2000);
    console.log(posicionesGenerar);
}

function generarPosiciones(elemento, left, top){
    elemento.parent().css({position: 'relative'});
    elemento.css({top: 200, left: 200, position:'absolute'});
    /*$(elemento).animate(
      {
        left:left,
        top:"+="+top
      }, 3000 );*/
  }

$('.btn-reinicio').click(function() {
    if ($(this).text() == 'Iniciar') {
        $(this).text('Reiniciar').fadeIn();
        verificacionElementos();
        $('#timer').timer({
            countdown: true,
            duration: '2m',
            format: '%M:%S',
            callback: function() {
                alert('Time up!');
            }
        });
    } else {
        $(this).text('Iniciar').fadeIn();
        $("#score-text").text('0').fadeIn();
        $("#movimientos-text").text('0').fadeIn();
        $("#timer").text('02:00').fadeIn();

    }
});