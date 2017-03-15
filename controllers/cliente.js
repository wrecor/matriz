//var matriznueva = require('./controllers/matriz');
//exports.mat = matriznueva;
var matriz;

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

exports.matriz = function(req, res){
	var n = req.body.num;
	if (n != undefined){
		matriz = crear_matriz(n);
		res.status(200).json('ok');
	}else{
		res.status(500).json('Error');
	}
};

exports.query = function(req, res){
	var text = req.params.text;
	if (text != undefined){
		text = text.trim();
	    var parametros = text.split(' ');
	    parametros[0] = parametros[0].toUpperCase();

	    if (matriz != null){
			if((parametros[0] == 'QUERY') && (parametros.length == 7)){
				
				var total = suma(parametros, matriz);
			     if (total == -1){
			       res.status(500).json('Las coordenadas no se encuentran dentro de la matriz');
			     }else{
			       res.status(200).json(total);
			     }
			}else{
				res.status(500).json('Error');
			}
	    }else{
			res.status(500).json('Error');
		}
	}else{
		res.status(500).json('Error');
	}
	
};

exports.update = function(req, res){
	var text = req.body.text;
    text = text.trim();
    var parametros = text.split(' ');
    parametros[0] = parametros[0].toUpperCase();

    if (matriz != null){
	    if((parametros[0] == 'UPDATE') && (parametros.length == 5)){

			var x = parseInt(parametros[1]);
		  	var y = parseInt(parametros[2]);
		  	var z = parseInt(parametros[3]);
		  	var valor = parseInt(parametros[4]); 

		  	if (val_coordenada(x, y, z, matriz)){
		    	matriz[x][y][z] = valor;
		    	res.status(200).json('ok');
		    }else{
		        res.status(500).json('Error');
		    }
	    }else{
			res.status(500).json('Error');
		}
    }else{
		res.status(500).json('Error');
	}
};

exports.delete = function(req, res){
	matriz = null;
	res.status(200).json('Borrado Completo');
};
