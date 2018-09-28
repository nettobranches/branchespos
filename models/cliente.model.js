var db = require('../controllers/sqlite.controller');
var util = require('util');
var table = 'clientes';
var Promise = require('bluebird');

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
  ,getClienteClave: function(clave){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT * FROM cliente_clave CC \
      JOIN clientes C ON CC.cliente_id = C.id \
      WHERE clave = '%s'";
      var qry = util.format(sqry, clave);
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
  ,save: function(item){
    return new Promise(function(resolve, reject){
      var qry = util.format('INSERT INTO clientes (nombre, telefono, email ) VALUES ("%s", "%s", "%s")',
        String(item.nombre || '' ).toUpperCase(), item.telefono || '', item.email || '');
      console.log('qry', qry);
      db.run(qry, function(err) {
          console.log("last id", this.lastID);
          // resolve(rows);
          return model.saveClientCode({cliente_id:this.lastID, clave: item.clave})
      });
    })// promise
  } // save
  ,saveClientCode: function(params){
    return new Promise(function(resolve, reject){
      var qry = util.format('INSERT INTO cliente_clave (clave, cliente_id) VALUES ("%s", %s)',
        String(params.clave || '' ).toUpperCase(), params.cliente_id || '');
      console.log('qry', qry);
      db.run(qry, function(err) {
          resolve(true);
      });
    })// promise
  }
  ,getLastInsert: function(){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var qry = "SELECT * FROM sqlite_sequence WHERE name = 'clientes'";
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // getLastInsert
}

module.exports = model;
