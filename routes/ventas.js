var express = require('express');
var router = express.Router();
var model = require('../models/venta.model');
var printController = require('../controllers/print.controller');
var _ = require('lodash');
var csv = require('express-csv');
var moment = require('moment');
var Promise = require('bluebird');

var ticketId = 0;

/* GET users listing. */
router.get('/', function(req, res, next) {
  model.list().then(function(mres){
    console.log('mres', mres);
    res.send({items:mres, success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })

}); // end /

router.get('/export.csv', function(req, res, next) {
  model.export().then(function(mres){
    // console.log('mres', mres);
    var prods = [];
    prods.push(["FECHA" , "HORA", "NOMBRE", "TALLA", "COLOR", "CANTIDAD", "PRECIO UNITARIO", "IMPORTE"])
      mres.forEach(function(item){
          var objFecha = new Date(item.fecha);
          var fecha = moment(objFecha).format("DD-MM-YY");
          var hora = moment(objFecha).format("HH:mm");
          // console.log('item', item);
          var productos = JSON.parse(item.json);
          _.forEach(productos, function(iProd){
              // console.log('prod', iProd);
              prods.push([fecha , hora, iProd.nombre.toUpperCase(), iProd.talla || "N/A", iProd.color || "N/A", iProd.cantidad, iProd.p_u, iProd.importe])
          });
      })
    // res.send({items:[], success: true});
    // console.log('prods',prods)
    // res.csv([
    //   ["a", "b", "c"]
    // , ["d", "e", "f"]
    // ]);
    res.csv(prods);
  }).catch(function(err){
    res.send({items:[], success: false});
  })

}); // end export.csv

router.post('/save/:imprimir_ticket', function(req, res, next) {
    // console.log("body",req.body);
    var nVenta = req.body;
    var imprimir_ticket = JSON.parse(req.params.imprimir_ticket);

    // console.log('imprimir ticket', imprimir_ticket, typeof imprimir_ticket);

    nVenta.json = JSON.stringify(nVenta.cart);
    nVenta.cambio = parseInt(nVenta.recibido) - parseInt(nVenta.total);
    // console.log('nventa', nVenta);
    model.save(nVenta)
    .then(model.getFolio)
    .then(function(paramVenta){
        console.log('paramVenta', paramVenta);
        // return new Promise(function(resolve, reject){
        //     resolve(paramVenta);
        // })
        ticketId = paramVenta.folio;
        var aProds = Object.keys(nVenta.cart).map(function (key) { return nVenta.cart[key]; });
        console.log('cart', aProds);
        return Promise.each(aProds, eachVProds).then(function(){
            return new Promise(function(resolve, reject){
                resolve(paramVenta);
            });
        });
    })
    .then(function(paramVenta){
        console.log('paramVenta', paramVenta);
        if(imprimir_ticket){
            return printController.receipt(paramVenta)
        }else{
            return printController.empty()
        }
    })
    .then(function(){
        console.log('success');
        res.send({ success: true});
    }).catch(function(err){
        res.send({ success: false, err: err});
    })
}); // end save

function eachSaveProdVenta(iProd){

}

router.get('/resumen', function(req, res, next){
    model.ventasResumen().then(function(rResumen){
      console.log('rResumen', rResumen);
      res.send({items:rResumen, success: true});
    }).catch(function(err){
      res.send({items:[], success: false});
    });
});

router.get('/fixdates', function(req, res, next){
    // model.list().then(function(mres){
    //   return Promise.each(mres, function(item){
    //       var fecha = new Date(item.fecha);
    //       var nFecha = moment(fecha).format("YYYY-MM-DD HH:mm:ss");
    //       console.log('item', item.id,  nFecha);
    //       return model.updateFecha(item.id, nFecha );
    //   });
    // }).then(function(param){
    //   // console.log('param', param);
    //   res.send({items:{}, success: true});
    // }).catch(function(err){
    //   res.send({items:[], success: false});
    // })
});

router.get('/fix_ventas_productos', function(req, res, next){
  model.clearProd().then(function(){
    return model.list()
  }).then(function(mres){
    return Promise.each(mres, eachVentas);
  }).then(function(param){
    // console.log('param', param);
    res.send({items:{}, success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })
});


function eachVentas(item){
    // console.log('item', item);
    ticketId = item.id;
    var prods = JSON.parse(item.json);
    var aProds = Object.keys(prods).map(function (key) { return prods[key]; });
    // console.log('prods', aProds);
    return Promise.each(aProds, eachVProds)
}

function eachVProds(item){
    // console.log('prod', item);
    item.venta_id = ticketId;
    return model.saveProd(item)
}

router.post('/ticket', function(req, res, next){
    var search = req.body;
    model.getTicket(search.search_fld).then(function(rTicket){
      console.log('rTicket', rTicket);
      res.send({items:rTicket, success: true});
    }).catch(function(err){
      res.send({items:[], success: false});
    });
});

module.exports = router;
