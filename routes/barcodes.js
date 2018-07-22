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
  res.render('print', { title: title, view: 'barcodes', id: 0, menu: menu });
});



module.exports = router;
