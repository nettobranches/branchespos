var db = require('../controllers/sqlite.controller');
var util = require('util');
var table = 'productos';
var Promise = require('bluebird');

var model = {
  list: function(){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var qry = "SELECT P.*,SUM(S.quantity) quantity , SUM(S2.quantity) quantity2\
      FROM productos P\
      LEFT JOIN stock_availables S ON P.id = S.id_product AND S.id_product_attribute = 0\
	  LEFT JOIN stock_availables S2 ON P.id = S2.id_product AND S2.id_product_attribute > 0\
	GROUP BY P.id"
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // list
  ,stock: function(id){
    var clean_id = id;
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT S.id, P.name, S.quantity, O.color, GROUP_CONCAT(O.name) AS des FROM productos P\
      JOIN stock_availables S ON P.id = S.id_product AND S.id_product_attribute > 0\
      JOIN combinations C ON S.id_product_attribute = C.product_id\
      JOIN product_option_values O ON O.id = C.option_id\
      WHERE P.id = %s\
      GROUP BY S.id";
      var qry = util.format(sqry, clean_id);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // stock
  ,search: function(searchFld){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT P.* FROM productos P\
      WHERE P.name LIKE '%s' OR P.upc = '%s'";
      var qry = util.format(sqry, "%"+searchFld+"%", searchFld);
      console.log('qey', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
  ,save: function(item){
    return new Promise(function(resolve, reject){
      var qry = util.format('INSERT INTO productos (name, price, tipo, origen ) VALUES ("%s", "%s", "%s", "%s")',
        item.name.toUpperCase(), item.price, item.type, "pos");
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // search
}

module.exports = model;
