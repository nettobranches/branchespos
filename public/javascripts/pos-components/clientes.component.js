Vue.component('cliente',{
    template:"#client",
    data:function () {
        return {
          nitem: {}
        }
    }, // data
    methods:{
        add: function(){
            var _this = this;
            if (true){
                // guarda producto
                var nItem = _this.nitem;
                postDoc('/api/clientes/save/', {nItem: nItem}, function(res){
                  alert('cliente agregado');
                    // $('#modalPago').modal('show');
                });
            }else{
                // $('#modalPagoError').modal('show');
            }
        } // add
    } // methods
}); // component cliente

Vue.component('nuevo-cliente',{
    template:"#nuevo-cliente",
    props:['cliente'],
    data:function () {
        return {
          nitem: {}
        }
    }, // data
    methods:{
        add: function(){
            this.$emit('update:cliente', this.nitem)
        } // add
        ,client_search: function(){
            var _this = this;
            var nItem = _this.nitem;
            console.log('nitem.clave', nItem.clave);
            postDoc('/api/clientes/get/', {nItem: nItem}, function(res){
                console.log('res', res);
                if(res.success){
                    _this.nitem = res.items[0];
                    _this.$emit('update:cliente', _this.nitem)
                }
                // $('#modalPago').modal('show');
            });
        }
    } // methods
}); // component nuevo-cliente

Vue.component('search-client',{
    template:"#search-client",
    data:function () {
        return {
          searchFld: "",
          clientes: []
        }
    }, // data
    methods:{
        search: function(){
            var _this = this;
            postDoc('/api/clientes/search',{search_fld: _this.searchFld}, function(res){
            console.log('clientes', res.items);
            _this.clientes = res.items;
            _this.searchFld = '';
            });
        } // search
    } // methods
}); // component cliente
