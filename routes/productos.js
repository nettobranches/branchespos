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

router.get('/get_colors', function(req, res, next) {
  console.log('getcolors');
  model.colores().then(function(mres){
    // console.log('mres', mres);
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

router.post('/save_color', function(req, res, next) {
  console.log("body",req.body);
  // res.send({items:[], success: false});
  model.saveColor(req.body.nItem).then(function(mres){
    console.log('mres', mres);
    res.send({success: true});
  }).catch(function(err){
    res.send({success: false});
  })
});

router.post('/update_upc', function(req, res, next) {
    console.log("body",req.body);
    var nItem = req.body;
    model.updateCodeParent(nItem).then(function(){
        res.send({ success: true});
    }).catch(function(err){
        res.send({ success: false});
    })
});

router.post('/update_color_upc', function(req, res, next) {
    console.log("body",req.body);
    var nItem = req.body;
    model.updateCodeColor(nItem).then(function(){
        res.send({ success: true});
    }).catch(function(err){
        res.send({ success: false});
    })
});



module.exports = router;
