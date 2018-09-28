var express = require('express');
var router = express.Router();
var mApartado = require('../models/apartado.model');
var mCliente = require('../models/cliente.model');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');



router.post('/save', function(req, res, next) {
    console.log("body",req.body);
    var apartado = req.body;

    mApartado.save(apartado).then(function(){
        res.send({ success: true});
    }).catch(function(err){
        console.log('err', err);
        res.send({ success: false, err: err});
    })
}); // end save

router.post('/search', function(req, res, next){
    var search = req.body;
    mApartado.get(search.search_fld).then(function(rApartado){
      console.log('rApartado', rApartado);
      res.send({items:rApartado, success: true});
    }).catch(function(err){
      res.send({items:[], success: false});
    });
}); // search

router.post('/abono', function(req, res, next){
    var params = req.body;
    mApartado.abono(params).then(function(){
        res.send({ success: true});
    }).catch(function(err){
        console.log('err', err);
        res.send({ success: false, err: err});
    });
}); // update

module.exports = router;
