var lightBulb = {
  template: `
  <div class='light-bulb'>
    <p>💡Eureka!</p>
  </div>
  `
}


var vm = new Vue({
  el: '#wrapper',
  components: {
    'light-bulb': lightBulb
  },
  data:{
    resumen: [],
    inventario: [],
    ventas: [],
    searchFld: '',
    cart:{},
    a_pagar: 0,
    pago: 0,
    cambio: 0,
    pago_c_tarjeta: false,
    nitem:{},
    nitemIdx: 0,
    imprimir_ticket: true,
    cVenta: [],
    cVentaDetalle: {},
    apartado:{},
    cliente:{},
    productos:[],
    apartado_btns: false,
    apartado_nuevo: false,
    abonos: [],
    colores: [],
    prod_no_encontrado: false,

    cliente_clave: ''
  },
  methods:{
    sync_prods: function(){
      axios.get('/prestashop/sync').then(function(res){
        console.log('sync', res);
      }).catch(function(err){
        console.log('err', err);
      })
    }// sync_prods
    ,ventas_resumen: function(){
      var _this = this;
      loadDoc('/api/ventas/resumen', function(res){
          console.log('resumen', res.items);
            _this.resumen = res.items;
      });
    }// ventas_resumen
    ,list_inventario: function(){
      var _this = this;
      loadDoc('/api/productos', function(res){
          console.log('productos', res.items);
            _this.inventario = res.items;
      });
    }// list_inventario
    ,list_historial: function(){
      var _this = this;
      loadDoc('/api/ventas', function(res){
          console.log('ventas', res.items);
            _this.ventas = res.items;
      });
    }// list_historial
    ,format_productos: function(productos){
        return JSON.parse(productos);
    }
    ,format_fecha: function(fecha){
        return new Date(fecha);
    }
    ,list_inventario_item: function(id){
      var _this = this;
      loadDoc('/api/productos/'+id, function(res){
        console.log('productos', res.items);
        _this.inventario = res.items || [];
      });
    }// list_inventario
    ,inventarioQty: function(item){
      return item.quantity2 || item.quantity;
    }// inventarioQty
    ,add_inventario: function(){
        var _this = this;
        if (true){
            // guarda producto
            var nItem = _this.nitem;
            postDoc('/api/productos/save/', {nItem: nItem}, function(res){
                // $('#modalPago').modal('show');
                alert('producto agregado');
                this.list_historial();
            });
        }else{
            // $('#modalPagoError').modal('show');
        }
    }// add_inventario
    ,add_inventario_color: function(){
        var _this = this;
        if (true){
            // guarda producto
            var nItem = _this.nitem;
            nItem.p_id = itemId;
            postDoc('/api/productos/save_color/', {nItem: nItem}, function(res){
                // $('#modalPago').modal('show');
            });
        }else{
            // $('#modalPagoError').modal('show');
        }
    }// add_inventario
    ,caja_search: function(){
      var _this = this;
      postDoc('/api/productos/search',{search_fld: _this.searchFld}, function(res){
        console.log('productos', res.items);
        _this.inventario = res.items;
        _this.prod_no_encontrado = false;
        if( res.items.length == 1 ){
          _this.caja_add(res.items[0])
        }else if(res.items.length < 1){
          _this.prod_no_encontrado = true;
        }
        _this.searchFld = '';
      });
    }// caja_search
    ,add_new: function(){
        var _this = this;
        var nitemPrice = parseInt(_this.nitem.price);
        // if(Number.isInteger(_this.nitem.price)){
            Vue.set(_this.cart, _this.nitemIdx, {
              codigo: '0',
              nombre: _this.nitem.name,
              talla: _this.nitem.talla,
              color: _this.nitem.color,
              cantidad: 1,
              unidad: 'pza',
              p_u: nitemPrice,
              discount: 0,
              importe: nitemPrice,
              qtymax: 1000,
              tipo: ""
            });
            _this.a_pagar += nitemPrice;
            _this.nitemIdx++;
            console.log('cart', _this.cart);
            _this.prod_no_encontrado = false;
          // }
    } // add_new
    ,caja_add: function(item){
      var _this = this;
      if( _this.cart[item.id] ){
        _this.cart[item.id].cantidad ++;
        _this.cart[item.id].importe = _this.cart[item.id].cantidad * _this.cart[item.id].p_u;
        _this.a_pagar += _this.cart[item.id].p_u;
      }else{
        Vue.set(_this.cart, item.id, {
          codigo: '0',
          nombre: item.name,
          cantidad: 1,
          unidad: 'pza',
          p_u: item.price,
          discount: 0,
          importe: item.price,
          qtymax: item.quantity,
          tipo: item.tipo
        });
        _this.a_pagar += item.price;
      }
      console.log('cart', _this.cart);
    }// caja_add
    ,chngImporte: function(key){
        var _this = this;

        if(_this.cart[key].cantidad < 1){
            _this.cart[key].cantidad = 1;
        }else if(_this.cart[key].cantidad > _this.cart[key].qtymax){
            _this.cart[key].cantidad = _this.cart[key].qtymax
        }

        if(  _this.cart[key].discount <= 100 && _this.cart[key].discount > 0 ){
          _this.a_pagar -= _this.cart[key].importe;
          _this.cart[key].importe = _this.cart[key].p_u * _this.cart[key].cantidad * (1 - _this.cart[key].discount / 100 )
          _this.a_pagar += _this.cart[key].importe;
        }else{
            _this.cart[key].discount = 0;
            _this.a_pagar -= _this.cart[key].importe;
            _this.cart[key].importe = _this.cart[key].p_u * _this.cart[key].cantidad
            _this.a_pagar += _this.cart[key].importe;
        }
    }
    ,caja_rm: function(key){
      var _this = this;
      _this.a_pagar -= _this.cart[key].importe;
      Vue.delete(_this.cart, key);
    }// caja_rm
    ,caja_pagar: function(key){
        var _this = this;
        // console.log("pago c tarjeta", _this.pago_c_tarjeta);
        var cambio = _this.pago - _this.a_pagar;
        if (cambio >= 0 && Object.keys(_this.cart).length > 0 && _this.pago >= _this.a_pagar){
            // guarda transaccion
            _this.cambio = cambio;
            var vendedorId = 0;
            var nVenta = {
              cart: _this.cart,
              vendedor_id: vendedorId,
              total: _this.a_pagar,
              recibido: _this.pago,
              cliente_clave: _this.cliente_clave,
              pago_tarjeta: _this.pago_c_tarjeta ? 1 : 0
            };
            postDoc('/api/ventas/save/'+_this.imprimir_ticket, nVenta, function(res){
                $('#modalPago').modal('show');
            });
        }else{
            $('#modalPagoError').modal('show');
        }
    }// caja_pagar
    ,caja_pagar_c_ticket: function(key){
        this.imprimir_ticket = true;
        return this.caja_pagar(key);
    }
    ,caja_pagar_s_ticket: function(key){
        this.imprimir_ticket = false;
        return this.caja_pagar(key);
    }
    ,caja_limpiar: function(){
        var _this = this;
        _this.cart = {};
        _this.inventario = [];
        _this.a_pagar = 0;
        _this.pago = 0;
        _this.cambio = 0;
        _this.cliente_clave = '';
        $('#modalPago').modal('hide');
    }// caja_limpiar
    ,ticket_search: function(){
      var _this = this;
      postDoc('/api/ventas/ticket',{search_fld: _this.searchFld}, function(res){
        console.log('productos', res.items);
        _this.cVentaDetalle = res.items[0];
        _this.cVenta =  JSON.parse(res.items[0].json);
        _this.searchFld = '';
      });
    }// caja_search
    ,updateProdUpc: function(id, upc){
      postDoc('/api/productos/update_upc', {id: id, upc: upc}, function(res){
          // $('#modalPago').modal('show');
          console.log('actualizado')
      });
    }// updateProdUpc
    ,updateColorUpc: function(product_id, option_id, upc){
      postDoc('/api/productos/update_color_upc', {product_id: product_id, upc: upc, option_id: option_id }, function(res){
          // $('#modalPago').modal('show');
          console.log('actualizado')
      });
    }// updateColorUpc
    ,list_colors: function(id){
      var _this = this;
      loadDoc('/api/productos/get_colors', function(res){
        console.log('colores', res.items);
        _this.colores = res.items;
      });
    }// list_inventario
  } //
});


function loadDoc(url, cFunction) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      cFunction( JSON.parse(this.response) );
    }
  };
  xhttp.open("GET", url, true);
  xhttp.send();
}

function postDoc(url, params, cFunction) {
  var xhttp;
  xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if ( this.status == 200) {
      cFunction( JSON.parse(this.response) );
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader('Content-Type', 'application/json');
  xhttp.send(JSON.stringify(params));
}
