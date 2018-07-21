var express = require('express');
var router = express.Router();
var path = require('path');

db = require('../controllers/sqlite.controller');
/* GET users listing. */
router.get('/', function(req, res, next) {
  createTables()
  res.send('respond with a resource');
});

module.exports = router;

function createTables(){

   db.run("DROP TABLE IF EXISTS productos");
   db.run("CREATE TABLE IF NOT EXISTS productos (id INTEGER PRIMARY KEY AUTOINCREMENT, manufacturer_name TEXT, name TEXT )");
   console.log("La tabla productos ha sido correctamente creada");
   db.run("DROP TABLE IF EXISTS product_option_values");
   db.run("CREATE TABLE IF NOT EXISTS product_option_values (id INTEGER PRIMARY KEY AUTOINCREMENT, id_attribute_group INTEGER , color INTEGER, name TEXT, position INTEGER )");
   console.log("La tabla product_option_values ha sido correctamente creada");
   db.run("DROP TABLE IF EXISTS combinations");
   db.run("CREATE TABLE IF NOT EXISTS combinations (product_id INTEGER, option_id INTEGER )");
   console.log("La tabla combinations ha sido correctamente creada");

   db.run("DROP TABLE IF EXISTS stock_availables");
   db.run("CREATE TABLE IF NOT EXISTS stock_availables (id INTEGER PRIMARY KEY AUTOINCREMENT, id_product INTEGER, id_product_attribute INTEGER, quantity INTEGER )");
   console.log("La tabla stock_availables ha sido correctamente creada");

}
