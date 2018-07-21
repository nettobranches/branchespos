var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('index', { title: 'Express', view: 'dashboard' });
});

router.get('/inventario', function(req, res, next) {
  res.render('index', { title: 'Express', view: 'inventario' });
});

module.exports = router;
