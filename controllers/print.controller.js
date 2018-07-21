var escpos = require('escpos');
var Promise = require('bluebird');
var _ = require('lodash');
var moment = require('moment');
console.log(escpos.USB.findPrinter())

var device  = {};
var printer = {};

var printController = {
  test: function(){
      return new Promise(function(resolve, reject){
          // if(device && printer)
          if(device && printer)
              device.open(function(){
                  printer
                  .encode('utf8')
                  .text("hello")
                  .control("LF")
                  .feed()
                  .cut()
                  .close(function(){
                      console.log('Close');
                      resolve();
                  })
              });
          else{
              reject();
          }
      });
  } // test
  ,receipt: function(params){

    try{
        device = escpos.USB.findPrinter() ? new escpos.USB() : null;
    }catch( err ) {
        console.log('err', err);
    }


    printer = device ? new escpos.Printer(device) : null;

      var today = new Date();
      strToday = moment(today).format("DD/MM/YY HH:mm");
      folio = params.folio;
      var item = params.item;
      return new Promise(function(resolve, reject){
        if(device && printer){
            escpos.Image.load(__dirname + '/fbpjjeans.png', function(image){
                device.open(function(){
                    var prt = header(printer);

                    console.log( "cart", item.cart);

                    _.each(item.cart, function(iprod){
                        prt = setProduct(prt, iprod);
                    })

                    prt = footer(prt, item, image);

                    prt.close(function(){
                        console.log('Close');
                        resolve();
                    })
                });
            });
        }else{
            reject();
        }
      });
  } // test
  ,empty: function(){
      return new Promise(function(resolve, reject){ resolve(); });
  }
}

module.exports = printController;

function header(printer){
    return printer
    .encode('utf8')
    .font('a')
    .size(1,1)
    // .text('0123456789012345678901234567890')
    .align('CT')
    .text('')
    .text('PJJEANS DURANGO')
    .text('JORGE SAYUN FAUR')
    .text('REP. GUATEMALA 141 INT 101')
    .text('COL. CENTRO MEX, D.F.')
    .text('RFC: SAFJ740413KX6')
    .control("LF").control("LF").align('LT')
    .text(strToday)
    .text("folio: "+folio)
    .control("LF").control("LF").align('CT')
    .text('VENTA')
    .control("LF").align('LT')
 // .text('0123456789012345678901234567890')
    .text('DESC')
    .align('RT')
    .text('CANT | P/U | IMP')
    .control("LF");
}

function setProduct(printer, prod){
    console.log('prod', prod);
    return printer.align('LT').text(prod.nombre)
    .align('RT')
    .text(prod.cantidad+" X $"+prod.p_u+" $"+prod.importe);
}

function footer(printer, item, image){
    return printer.control("LF").align('RT')
    .text('TOTAL M.N. $'+item.total)
    .control("LF").align('CT')
    .text('¡Gracias por tu compra!')
    .text('')
    .control("LF")
    .text('visita pjjeans.com.mx')
    .raster(image)
    .text('')
    .control("LF").align('LT')
    .text('Cambios maximo 30 dias con su')
	.text('ticket')
    .text('La prenda debe estar en buen')
	.text('estado con sus etiquetas')
    .text('En camisas desenvueltas')
	.text('no hay cambios')
    .control("LF").control("LF").control("LF").control("LF")
    .feed()
    .cut()
}
