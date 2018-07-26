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
      var sqry = "SELECT S.id, C.product_id, C.option_id, P.name, C.upc, O.color, O.name AS des FROM productos P\
      JOIN stock_availables S ON P.id = S.id_product AND S.id_product_attribute > 0\
      JOIN combinations C ON S.id_product_attribute = C.product_id\
      JOIN product_option_values O ON O.id = C.option_id AND O.id_attribute_group = 7\
      WHERE P.id = %s\
      GROUP BY C.option_id, O.id_attribute_group";
      var qry = util.format(sqry, clean_id);
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // stock
  ,colores: function(){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var qry = "SELECT id, color, name from product_option_values WHERE id_attribute_group = 7";
      console.log('qry', qry);
      db.all(qry, function(err, rows) {
          // console.log('rows', rows);
          resolve(rows);
      });
    })// promise
  } // stock
  ,search: function(searchFld){
    return new Promise(function(resolve, reject){
      // var qry = util.format('SELECT * FROM %s ', table);
      var sqry = "SELECT P.id, name, upc, price, tipo, origen, '' as color FROM productos P\
      WHERE P.name LIKE '%s' OR P.upc = '%s'\
      UNION \
      SELECT P.id, P.name, C.upc, P.price, P.tipo, P.origen, O.name as color FROM productos P\
      JOIN stock_availables S ON P.id = S.id_product AND S.id_product_attribute > 0\
      JOIN combinations C ON S.id_product_attribute = C.product_id\
      JOIN product_option_values O ON O.id = C.option_id AND O.id_attribute_group = 7\
    	WHERE C.upc = '%s'\
      GROUP BY C.option_id, O.id_attribute_group";
      var qry = util.format(sqry, "%"+searchFld+"%", searchFld, searchFld);
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
  ,updateCodeParent:function(item){
      return new Promise(function(resolve, reject){
          var sqry ='UPDATE productos \
                    SET upc = "%s" \
                    WHERE id = %s'
          var qry = util.format(sqry, item.upc, item.id);
          console.log('qry', qry);
          db.all(qry, function(err, rows) {
              console.log('rows', rows);
              resolve(rows);
          });
      })// promise
  }
  ,updateCodeColor:function(item){
      return new Promise(function(resolve, reject){
          var sqry ='UPDATE combinations \
                    SET upc = "%s" \
                    WHERE product_id = %s AND option_id = %s'
          var qry = util.format(sqry, item.upc, item.product_id, item.option_id);
          console.log('qry', qry);
          db.all(qry, function(err, rows) {
              console.log('rows', rows);
              resolve(rows);
          });
      })// promise
  }
  ,saveCombination: function(item){
      return new Promise(function(resolve, reject){
        var qry = util.format('INSERT INTO combinations (product_id, option_id, upc ) VALUES (%s, %s, "%s")',
          item.id, item.option_id, item.upc);
        console.log('qry', qry);
        db.all(qry, function(err, rows) {
            console.log('rows', rows);
            resolve(rows);
        });
      })// promise
  }
}

module.exports = model;
