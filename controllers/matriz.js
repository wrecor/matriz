var T = 0,
    N = 0,
    M = 0,
    str_mensaje,
    matriz;

function set_Datos(T1, N1, M1, str_mensaje1, matriz1){
  T = T1;
  N = N1;
  M = M1;
  str_mensaje = str_mensaje1;
  matriz = matriz1;
}

function limpiar(){
  T = 0;
  N = 0;
  M = 0;
  matriz = null;
}

function crear_matriz(N){
  var matriz = new Array(N + 1);
    for (var i = 1; i <= N; i++) {
      matriz[i] = new Array(N + 1);
    }
    for (var i = 1; i <= N; i++) {
      for (var j = 1; j <= N; j++) {
        matriz[i][j] = new Array(N + 1);
      }
    }

    for (var i = 1; i <= N; i++) {
      for (var j = 1; j <= N; j++) {
        for (var k = 1; k <= N; k++) {
          matriz[i][j][k] = 0;
        }
      }
    }

  return(matriz);
};

function val_coordenada(x, y, z, matriz){
  var n = matriz.length;
  if (((x > 0) && (x < n)) && ((y > 0) && (y < n)) && ((z > 0) && (z < n))){
    return true;
  }else{
    return false;
  }
};

function val_coordenada_2(parametros, matriz){
  var x1 = parseInt(parametros[1]);
  var y1 = parseInt(parametros[2]);
  var z1 = parseInt(parametros[3]);
  var x2 = parseInt(parametros[4]);
  var y2 = parseInt(parametros[5]);
  var z2 = parseInt(parametros[6]);
  var n = matriz.length - 1;

  if (((x1 > 0) && (x1 <= x2)) && ((y1 > 0) && (y1 <= y2)) && ((z1 > 0) && (z1 <= z2))){
    if (((x2 >= x1) && (x2 <= n)) && ((y2 >= y1) && (y2 <= n)) && ((z2 >= z1) && (z2 <= n))){
      return true;
    }
  }
  return false;
}

function suma(parametros, matriz){
  var x1 = parseInt(parametros[1]);
  var y1 = parseInt(parametros[2]);
  var z1 = parseInt(parametros[3]);
  var x2 = parseInt(parametros[4]);
  var y2 = parseInt(parametros[5]);
  var z2 = parseInt(parametros[6]);
  var total = 0;

  if ((!val_coordenada(x1, y1, z1, matriz)) || (!val_coordenada(x2, y2, z2, matriz)) || (!val_coordenada_2(parametros, matriz))){
    return (-1);
  }

  for (var i = x1; i <= x2; i++) {
    for (var j = y1; j <= y2; j++) {
      for (var k = z1; k <= z2; k++) {
        total += parseInt(matriz[i][j][k]);
      }
    }
  }
  return (total);
};

function imprimir(res, str, tipo){
  if (tipo == 1){
    str_mensaje = str;
    res.render('index.jade', {mensaje:str});
  }else if (tipo == 2){
    res.render('index.jade', {mensaje:str_mensaje, resultado:str});
  }
};

function terminar_query(){
  if ((M == 0) && (T > 0)){
    T--;
  }

  if ((M == 0) && (T != 0)){
    N = 0;
    matriz = null;
    str_mensaje = 'Ingresa el valor de N y M "N es el valor maximo de las coordenadas X, Y, Z de la Matriz" y "M es el numero de consultas QUERY que puede realizar"';
  }else if ((M == 0) && (T == 0)){
    N = 0;
    matriz = null;
    str_mensaje = 'Ingrese el valor de T "T representa el numero de veces que ingresara el valor de N y M"';
  }
}

function iniciar(req, res){
  if((T == 0)||(N == 0)||(M == 0)){
    var text = req.body.text;
    text = text.trim();
    var parametros = text.split(' ');

    if ((isNaN(req.body.text) == false) && (T == 0)){
      var numero = parseInt(req.body.text); 
      if ((T == 0) && (numero > 0) && (numero <= 50) && (N == 0) && (M == 0)){
        T = numero;
        imprimir(res, 'Ingresa el valor de N y M "N es el valor maximo de las coordenadas X, Y, Z de la Matriz" y "M es el numero de consultas QUERY que puede realizar"', 1);
      }else{
        imprimir(res, 'El valor de T se encuentra fuera del rango permitido', 2);
      }
    }else if ((parametros.length == 2) && (T != 0)){
      var numero = parseInt(parametros[0]);
      var numero2 = parseInt(parametros[1]);

      if (!((numero > 0) && (numero <= 100))){
        imprimir(res, 'El valor de N se encuentra fuera del rango permitido', 2);
        return false;
      }
      if (!((numero2 > 0) && (numero2 <= 1000))){
        imprimir(res, 'El valor de M se encuentra fuera del rango permitido', 2);
        return false;
      }

      if ((N == 0) && (T != 0) && (M == 0)){
        N = numero;
        matriz = crear_matriz(N);
      }

      if ((M == 0) && (T != 0) && (N != 0)){
        M = numero2;
        imprimir(res, 'Ingresa La consulta "QUERY x1 y1 z1 x2 y2 z2" o "UPDATE x y z valor", QUERY devuelve la suma de los valores entre las coordenadas y UPDATE actualiza el valor en la coordenada', 1);
      }
    }else if (T == 0){
      imprimir(res, 'Error de sintaxis, ingrese un valor numérico', 2);
    }else if (T != 0){
      imprimir(res, 'Error de sintaxis, ingrese dos valores numéricos separados por un espacio', 2);
    }
  }else{
    var text = req.body.text;
    if (text != undefined){
      text = text.trim();
      var parametros = text.split(' ');
      parametros[0] = parametros[0].toUpperCase();
    }else{
      var parametros = ['nada','nada'];
    }

    if((parametros[0] == 'UPDATE') && (parametros.length == 5) && (M > 0)){
      var x = parseInt(parametros[1]);
      var y = parseInt(parametros[2]);
      var z = parseInt(parametros[3]);
      var valor = parseInt(parametros[4]); 

      if (val_coordenada(x, y, z, matriz)){
        matriz[x][y][z] = valor;
        M--;
        terminar_query();
        imprimir(res, 'Se agrego el valor = ' + valor + ' en la posición X = ' + x + ' Y = ' + y + ' Z = ' + z , 2);
      }else{
        imprimir(res, 'Error, las coordenadas no se encuentran dentro de la matriz', 2);
      }
    }else if((parametros[0] == 'QUERY') && (parametros.length == 7) && (M > 0)){
      var total = suma(parametros, matriz);
      if (total == -1){
        imprimir(res, 'Las coordenadas no se encuentran dentro de la matriz', 2);
      }else{
        M--;
        terminar_query();
        imprimir(res, 'La suma es = ' + total , 2);
      }
    }else{
      imprimir(res, 'Error, tipo de consulta no valida', 2);
    }
  }
};

exports.set_Datos = set_Datos;
exports.crear_matriz = crear_matriz;
exports.val_coordenada = val_coordenada;
exports.val_coordenada_2 = val_coordenada_2;
exports.suma = suma;
exports.iniciar = iniciar;
exports.matriz = matriz;