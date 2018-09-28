var db = require('../controllers/sqlite.controller');
var util = require('util');
var table = 'apartados';
var Promise = require('bluebird');
var moment = require('moment');

var model = {
  list: function(){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var qry = ""
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // list
  ,get: function(searchFld){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT A.*, CC.*, C.nombre, C.telefono, C.email FROM apartados A \
      JOIN cliente_clave CC ON A.cliente_clave = CC.clave\
     JOIN clientes C ON CC.cliente_id = C.id \
      WHERE C.nombre LIKE '%s' OR C.telefono = '%s' OR A.cliente_clave = '%s'";
      var qry = util.format(sqry, "%"+searchFld+"%", searchFld, searchFld);
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
  ,getCliente: function(searchFld){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT C.* FROM clientes C \
      WHERE C.nombre LIKE '%s' OR C.telefono = '%s'";
      var qry = util.format(sqry, "%"+searchFld+"%", searchFld);
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
  ,save: function(item){
    console.log('save apartado', item);
    var fecha = new Date();
    var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
    return new Promise(function(resolve, reject){
      var qry = util.format("INSERT INTO apartados (created, cliente_clave, json_productos, json_abonos ) VALUES ('%s', '%s', '%s', '%s')",
        nFecha, item.cliente.clave, JSON.stringify(item.productos), JSON.stringify(item.abonos || {}) );
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // save
  ,abono: function(item){
    console.log('abono apartado', item);
    var fecha = new Date();
    var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
    return new Promise(function(resolve, reject){
      var sqry ="UPDATE apartados \
                SET json_abonos = '%s' \
                WHERE id = %s"
      var qry = util.format(sqry, JSON.stringify(item.abonos || {}), item.apartado.id );
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // abono
}

module.exports = model;
