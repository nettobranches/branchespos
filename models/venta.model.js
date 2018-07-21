var db = require('../controllers/sqlite.controller');
var util = require('util');
var table = 'venta';
var Promise = require('bluebird');

var model = {
    list: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT * FROM ventas  ORDER BY id DESC";
            db.all(qry, function(err, rows) {
                // console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // list
    ,export: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT * FROM ventas";
            db.all(qry, function(err, rows) {
                // console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // export
    ,save: function(item){
        return new Promise(function(resolve, reject){
            var fecha = new Date();
            var qry = util.format('INSERT INTO ventas (json, fecha, vendedor_id, total, recibido, cambio) VALUES( \'%s\', \'%s\', %s, %s, %s, %s  )',
            item.json, fecha, item.vendedor_id, item.total, item.recibido, item.cambio);
            console.log('qry', qry);
            db.run(qry, function(err){
                console.log('err', err);
                if(err){
                    reject(err);
                }else{
                    resolve(item);
                }
            });
        })// promise
    } // save
    ,getFolio: function(item){
        return new Promise(function(resolve, reject){
            var fecha = new Date();
            var qry = 'select seq from sqlite_sequence where name="ventas"';
            // console.log('qry', qry);
            db.get(qry, {}, function(err, row){
                console.log('err', err);
                if(err){
                    reject(err);
                }else{
                    console.log('row', row);
                    resolve({folio: row.seq, item: item});
                }
            });
        })// promise
    } // getFolio
    ,ventasHoy: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT COUNT(id) as num FROM ventas WHERE strftime('%Y-%m-%d', fecha) = strftime('%Y-%m-%d')";
            db.all(qry, function(err, rows) {
                // console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // ventasHoy
    ,ventasSemana: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT COUNT(id) as num FROM ventas WHERE strftime('%Y-%W', fecha) = strftime('%Y-%W')";
            db.all(qry, function(err, rows) {
                // console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // ventasSemana
    ,ventasMes: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT COUNT(id) as num FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m')";
            db.all(qry, function(err, rows) {
                // console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // ventasMes
    ,ventasResumen: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT 'dia' as tipo, COUNT(id) as num FROM ventas WHERE strftime('%Y-%m-%d', fecha) = strftime('%Y-%m-%d')\
UNION \
SELECT 'semana' as tipo, COUNT(id) as num FROM ventas WHERE strftime('%Y-%W', fecha) = strftime('%Y-%W')\
UNION \
SELECT 'mes' as tipo, COUNT(id) as num FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m')";
            db.all(qry, function(err, rows) {
                console.log('err', err);
                console.log('rows', rows);
                resolve(rows);
            });
        })// promise
    } // ventasResumen
    ,updateFecha: function(id, fecha){
        return new Promise(function(resolve, reject){
            var qry = util.format('UPDATE ventas SET fecha = \'%s\' WHERE id = %s;', fecha, id);
            console.log('qry', qry);
            db.run(qry, function(err){
                console.log('err', err);
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        })// promise
    } // updateFecha
}

module.exports = model;
