var db = require('../controllers/sqlite.controller');
var util = require('util');
var table = 'venta';
var Promise = require('bluebird');
var moment = require('moment');

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
        console.log('saveitem', item);
        return new Promise(function(resolve, reject){
            var fecha = new Date();
            var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
            var qry = util.format('INSERT INTO ventas (json, fecha, vendedor_id, total, recibido, cambio, cliente_clave) VALUES( \'%s\', \'%s\', %s, %s, %s, %s, \'%s\'  )',
            item.json, nFecha, item.vendedor_id, item.total, item.recibido, item.cambio, item.cliente_clave || '' );
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
    ,clearProd: function(){
        return new Promise(function(resolve, reject){
            var qry = "DELETE FROM ventas_productos"
            // resolve(item);
            db.run(qry, function(err){
                console.log('clear err', err);
                if(err){
                    reject(err);
                }else{
                    resolve();
                }
            });
        })// promise
    } // saveProd
    ,saveProd: function(item){
        return new Promise(function(resolve, reject){
            var fecha = new Date();
            var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
            var qry = util.format('INSERT INTO ventas_productos (venta_id, codigo, nombre, talla, color, cantidad, p_u, descuento) VALUES( %s, \'%s\', \'%s\', \'%s\', \'%s\', %s, %s, %s)',
            item.venta_id, item.codigo, item.nombre.toUpperCase(), item.talla || '', item.color || '', item.cantidad, item.p_u, item.descuento || 0);
            console.log('qry', qry);
            // resolve(item);
            db.run(qry, function(err){
                console.log('err', err);
                if(err){
                    reject(err);
                }else{
                    resolve(item);
                }
            });
        })// promise
    } // saveProd
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
    ,ventasResumen: function(){
        return new Promise(function(resolve, reject){
            // var qry = util.format('SELECT * FROM %s ', table);
            var qry = "SELECT * FROM (SELECT 0 ord, 'dia' as tipo, COUNT(id) as num, SUM(total) as tot FROM ventas WHERE strftime('%Y-%m-%d', fecha) = strftime('%Y-%m-%d', date('now','-6 hours'))\
UNION \
SELECT 1 ord, 'semana' as tipo, COUNT(id) as num, SUM(total) as tot FROM ventas WHERE strftime('%Y-%W', fecha) = strftime('%Y-%W', date('now','-6 hours'))\
UNION \
SELECT 2 ord, 'mes' as tipo, COUNT(id) as num, SUM(total) as tot FROM ventas WHERE strftime('%Y-%m', fecha) = strftime('%Y-%m', date('now','-6 hours'))) ORDER BY ord";
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
    ,getTicket: function(id){
        return new Promise(function(resolve, reject){
            var qry = util.format('SELECT * FROM ventas WHERE id = %s;', id);
            console.log('qry', qry);
            db.all(qry, function(err, rows){
                console.log('err', err);
                console.log('rows', rows);
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            });
        })// promise
    } // updateFecha
}

module.exports = model;
