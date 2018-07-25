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
    var fecha = new Date();
    var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
    return new Promise(function(resolve, reject){
      var qry = util.format("INSERT INTO apartados (created, cliente_id, json_productos, json_abonos ) VALUES ('%s', %s, '%s', '%s')",
        nFecha, item.cliente_id, JSON.stringify(item.productos), JSON.stringify(item.abonos || {}) );
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
}

module.exports = model;
