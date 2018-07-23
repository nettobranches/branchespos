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
  ,search: function(searchFld){
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
    return new Promise(function(resolve, reject){
      var qry = util.format('INSERT INTO clientes (nombre, telefono, email ) VALUES ("%s", "%s", "%s")',
        item.nombre.toUpperCase(), item.telefono, item.email);
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
}

module.exports = model;
