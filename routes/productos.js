var express = require('express');
var router = express.Router();
var model = require('../models/producto.model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  model.list().then(function(mres){
    console.log('mres', mres);
    res.send({items:mres, success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })

});

router.get('/:id', function(req, res, next) {
  model.stock(req.params.id).then(function(mres){
    console.log('mres', mres);
    res.send({items:mres, success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })
});

router.post('/search', function(req, res, next) {
  console.log("body",req.body);
  model.search(req.body.search_fld).then(function(mres){
    console.log('mres', mres);
    res.send({items:mres, success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })
});

router.post('/save', function(req, res, next) {
  console.log("body",req.body);
  // res.send({items:[], success: false});
  model.save(req.body.nItem).then(function(mres){
    console.log('mres', mres);
    res.send({items:[req.body.nItem], success: true});
  }).catch(function(err){
    res.send({items:[], success: false});
  })
});

module.exports = router;
