var express = require('express');
var router = express.Router();
var model = require('../models/cliente.model');
var _ = require('lodash');
var moment = require('moment');
var Promise = require('bluebird');



router.post('/save', function(req, res, next) {
    console.log("body",req.body);
    var nCliente = req.body.nItem;

    model.save(nCliente)
    .then(function(){
        res.send({ success: true});
    }).catch(function(err){
        res.send({ success: false, err: err});
    })
}); // end save

router.post('/search', function(req, res, next){
    var search = req.body;
    model.getCliente(search.search_fld).then(function(rCliente){
      console.log('rCliente', rCliente);
      res.send({items:rCliente, success: true});
    }).catch(function(err){
      res.send({items:[], success: false});
    });
}); // search

module.exports = router;
