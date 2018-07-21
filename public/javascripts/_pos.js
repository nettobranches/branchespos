var lightBulb = {
  template: `
  <div class='light-bulb'>
    <p>💡Eureka!</p>
  </div>
  `
}

Vue.filter('currency', function (money) {
  return accounting.formatMoney(money)
})

var vm = new Vue({
  el: '#wrapper',
  components: {
    'light-bulb': lightBulb
  },
  data:{
    inventario: [],
    searchFld: '',
    cart:{},
    a_pagar: 0,
    pago: 0,
    cambio: 0,
  },
  methods:{
    sync_prods: function(){
      axios.get('/prestashop/sync').then(function(res){
        console.log('sync', res);
      }).catch(function(err){
        console.log('err', err);
      })
    }// sync_prods
    ,list_inventario: function(){
      var _this = this;
      axios.get('/api/productos').then(function(res){
        console.log('productos', res.data.items);
        _this.inventario = res.data.items;
      }).catch(function(err){
        console.log('err', err);
      })
    }// list_inventario
    ,list_inventario_item: function(id){
      var _this = this;
      axios.get('/api/productos/'+id).then(function(res){
        console.log('productos', res.data.items);
        _this.inventario = res.data.items;
      }).catch(function(err){
        console.log('err', err);
      })
    }// list_inventario
    ,inventarioQty: function(item){
      return item.quantity2 || item.quantity;
    }// inventarioQty
    ,caja_search: function(){
      var _this = this;
      axios.post('/api/productos/search',{search_fld: _this.searchFld}).then(function(res){
        console.log('productos', res.data.items);
        _this.inventario = res.data.items;

        if( res.data.items.length == 1 ){
          _this.caja_add(res.data.items[0])
        }
        _this.searchFld = '';
      }).catch(function(err){
        console.log('err', err);
        _this.searchFld = '';
      })
    }// caja_search
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
          desc: 0,
          importe: item.price
        });
        _this.a_pagar += item.price;
      }
      console.log('cart', _this.cart);
    }// caja_add
    ,caja_rm: function(key){
      var _this = this;
      _this.a_pagar -= _this.cart[key].importe;
      Vue.delete(_this.cart, key);
    }// caja_rm
    ,caja_pagar: function(key){
        var _this = this;
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
            };
            axios.post('/api/ventas/save', nVenta).then(function(res){
                $('#modalPago').modal('show');
            }).catch(function(err){
              console.log('err', err);
            })
        }else{
            $('#modalPagoError').modal('show');
        }
    }// caja_pagar
    ,caja_limpiar: function(){
        var _this = this;
        _this.cart = {};
        _this.inventario = [];
        _this.a_pagar = 0;
        _this.pago = 0;
        _this.cambio = 0;
        $('#modalPago').modal('hide');
    }// caja_limpiar
  }
});
