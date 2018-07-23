var express = require('express');
var router = express.Router();

var title ="Pjjeans POS";
var menu = {};
function menuClear(){
  menu = {
      dashboard: '',
      venta: '',
      cambios: '',
      clientes: '',
      inventario: '',
      historial: ''
  };
}
/* GET home page. */
router.get('/', function(req, res, next) {
  menuClear();
  menu.dashboard = 'active';
  res.render('index', { title: title, view: 'dashboard', id: 0, menu: menu });
});

router.get('/inventario', function(req, res, next) {
  menuClear();
  menu.inventario = 'active';
  res.render('index', { title: title, view: 'inventario', id: 0, menu: menu  });
});

router.get('/inventario/:id', function(req, res, next) {
  res.render('index', { title: title, view: 'inventario_item', id: req.params.id, menu: menu  });
});

router.get('/venta', function(req, res, next) {
  menuClear();
  menu.venta = 'active';
  res.render('index', { title: title, view: 'venta', id: 0, menu: menu  });
});

router.get('/cambios', function(req, res, next) {
  menuClear();
  menu.cambios = 'active';
  res.render('index', { title: title, view: 'cambios', id: 0, menu: menu  });
});

router.get('/historial', function(req, res, next) {
  menuClear();
  menu.historial = 'active';
  res.render('index', { title: title, view: 'historial', id: 0, menu: menu  });
});

router.get('/apartados', function(req, res, next) {
  menuClear();
  menu.apartados = 'active';
  res.render('index', { title: title, view: 'apartados', id: 0, menu: menu  });
});

router.get('/clientes', function(req, res, next) {
  menuClear();
  menu.clientes = 'active';
  res.render('index', { title: title, view: 'clientes', id: 0, menu: menu  });
});

module.exports = router;
