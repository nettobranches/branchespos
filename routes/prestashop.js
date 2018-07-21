var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');

var Promise = require('bluebird');

var _ = require('lodash');
var db = require('../controllers/sqlite.controller');

var url = "";
var propertiesObject = { ws_key:'', display:'full', output_format: 'JSON' };

/* GET users listing. */
router.get('/sync/prods', function(req, res, next) {


});

/* GET users listing. */
router.get('/sync', function(req, res, next) {
  // sync_product_option_values();
  createTables()
  .then(sync_product_option_values)
  .then(function(body){
    var objBody = JSON.parse(body);
    console.log(objBody);
    return Promise.each(objBody.product_option_values, formatOptionsEach);
  })
  .then(sync_combinations)
  .then(function(body){
    var objBody = JSON.parse(body);
    console.log(objBody);
    return Promise.each(objBody.combinations, formatCombinationsEach);
  })
  .then(sync_stock)
  .then(function(body){
    var objBody = JSON.parse(body);
    console.log(objBody);
    return Promise.each(objBody.stock_availables, formatStockEach);
  })
  .then(sync_products)
  .then(function(body){
    var objBody = JSON.parse(body);
    console.log(objBody);
    return Promise.each(objBody.products, formatProductsEach);
  })
  .then(function(){
    res.send('respond with a resource');
  })
});

module.exports = router;

function createTables(){
  return new Promise(function(resolve, reject){
    db.serialize(function() {
       db.run("DROP TABLE IF EXISTS productos");
       db.run("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, manufacturer_name TEXT, name TEXT, ean13 TEXT, isbn TEXT, upc TEXT, price REAL )");
       console.log("La tabla productos ha sido correctamente creada");
       db.run("DROP TABLE IF EXISTS product_option_values");
       db.run("CREATE TABLE IF NOT EXISTS product_option_values (id INTEGER PRIMARY KEY AUTOINCREMENT, id_attribute_group INTEGER , color INTEGER, name TEXT, position INTEGER )");
       console.log("La tabla product_option_values ha sido correctamente creada");
       db.run("DROP TABLE IF EXISTS combinations");
       db.run("CREATE TABLE IF NOT EXISTS combinations (product_id INTEGER, option_id INTEGER, ean13 TEXT, isbn TEXT, upc TEXT )");
       console.log("La tabla combinations ha sido correctamente creada");
       db.run("DROP TABLE IF EXISTS stock_availables");
       db.run("CREATE TABLE IF NOT EXISTS stock_availables (id INTEGER PRIMARY KEY AUTOINCREMENT, id_product INTEGER, id_product_attribute INTEGER, quantity INTEGER )");
       console.log("La tabla stock_availables ha sido correctamente creada");
       resolve();
     });
  });
}

function _createTables(){
  return new Promise(function(resolve, reject){
   resolve();
  });
}

function sync_product_option_values(){
  var rurl = url+"product_option_values";
  return new Promise(function(resolve, reject){
    request({url:rurl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); res.send('err'); }

      resolve(body);

    });
  });
} // sync_product_option_values

function formatOptionsEach(iItem){

      var nItem = {
        id: iItem.id,
        id_attribute_group: iItem.id_attribute_group,
        color: iItem.color,
        name: iItem.name
        // name: iItem.name[0].value
      }
      var qry = util.format('INSERT INTO product_option_values (id, id_attribute_group, color, name) VALUES( %s, %s, \'%s\' , \'%s\'  )',
          nItem.id, nItem.id_attribute_group, nItem.color, nItem.name);
        console.log('qry', qry);
        db.run(qry);
      // console.log(nItem);
      // saveOptions(nItem);

} // formatOptionsEach

function saveOptions(item){

  return db.run(qry);
}

function sync_combinations(){
  var rurl = url+"combinations";
  return new Promise(function(resolve, reject){
    request({url:rurl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); res.send('err'); }

      resolve(body);

    });
  });
} // sync_combinations

function formatCombinationsEach(iItem){

    // console.log('product option values', iItem.associations.product_option_values)
    // iItem.associations.product_option_values[0].id
    _.each(iItem.associations.product_option_values, function(objOption){
      var nItem = {
        id: iItem.id,
        option_id: objOption.id,
        ean13: iItem.ean13 || '',
        isbn: iItem.isbn || '',
        upc: iItem.upc || '',
      }

      // Promise.each(objBody.products, formatProductsEach);
      var qry = util.format('INSERT INTO combinations (product_id, option_id, ean13, isbn, upc) VALUES( %s, %s, \'%s\', \'%s\', \'%s\'  )',
          nItem.id, nItem.option_id, nItem.ean13, nItem.isbn, nItem.upc);
        console.log('qry', qry);
        db.run(qry);
    }); // each

      // console.log(nItem);
      // saveOptions(nItem);

} // formatCombinationsEach

function sync_stock(){
  var rurl = url+"stock_availables";
  return new Promise(function(resolve, reject){
    request({url:rurl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); res.send('err'); }

      resolve(body);

    });
  });
} // sync_combinations

function formatStockEach(iItem){
  // console.log("stock",iItem);
    // console.log('product option values', iItem.associations.product_option_values)
    // // iItem.associations.product_option_values[0].id
      var nItem = {
        id: iItem.id,
        id_product: iItem.id_product,
        id_product_attribute: iItem.id_product_attribute,
        quantity: iItem.quantity
      }
      // console.log("stock", nItem);
      var qry = util.format('INSERT INTO stock_availables (id, id_product, id_product_attribute, quantity) VALUES( %s, %s, %s, %s  )',
          nItem.id, nItem.id_product, nItem.id_product_attribute, nItem.quantity);
        console.log('qry', qry);
        db.run(qry);
      // saveOptions(nItem);

} // formatCombinationsEach


function sync_products(){
  var rurl = url+"products";
  return new Promise(function(resolve, reject){
    request({url:rurl, qs:propertiesObject}, function(err, response, body) {
      if(err) { console.log(err); res.send('err'); }

      resolve(body);

    });
  });
} // sync_combinations

function formatProductsEach(iItem){
  // console.log('prod', iItem);

    // console.log('product option values', iItem.associations.product_option_values)
    // // iItem.associations.product_option_values[0].id
      var nItem = {
        id: iItem.id,
        manufacturer_name: iItem.manufacturer_name,
        name: iItem.name,
        // name: iItem.name[0].value,
        ean13: iItem.ean13,
        isbn: iItem.isbn,
        upc: iItem.upc,
        price: iItem.price
      }
      var qry = util.format('INSERT INTO productos (id, manufacturer_name, name, ean13, isbn, upc, price) VALUES( \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', \'%s\', %s  )',
          nItem.id, nItem.manufacturer_name, nItem.name, nItem.ean13, nItem.isbn, nItem.upc, nItem.price);
          console.log('qry', qry);
          db.run(qry);
      // console.log('prod', nItem);
      // saveOptions(nItem);

} // formatCombinationsEach

function _sync_products(){
  var url = "http://shopdemo.endurango.mx/api/products";
  var propertiesObject = { ws_key:'N8Y132EEYB55GJNPY7WDMBDR2716TXRL', display:'full', output_format: 'JSON' };

  request({url:url, qs:propertiesObject}, function(err, response, body) {
    if(err) { console.log(err); res.send('err'); }

    saveProd(body);
    res.send('respond with a resource');
  });
}

function saveProd(body){
  var objBody = JSON.parse(body);
  console.log('obj body', objBody.products[0])
  console.log('obj body associations', objBody.products[0].associations)

  _.forEach(objBody.products, function(iprod) {
    // console.log('iprod', iprod);
    var nProd = {
      id: iprod.id,
      manufacturer_name: iprod.manufacturer_name,
      name: iprod.name,
      // name: iprod.name[0].value,
      ean13: iprod.ean13,
      isbn: iprod.isbn,
      upc: iprod.upc,
      price: iprod.price
    }
    console.log('new product', nProd);
    var qry = util.format('INSERT INTO productos (id, manufacturer_name, name, ean13, isbn, upc, price) VALUES( \'%s\', \'%s\', \'%s\', %s, %s, %s, %s  )',
        nProd.id, nProd.manufacturer_name, nProd.name);
    db.run(qry);
  }); // foreach

}
