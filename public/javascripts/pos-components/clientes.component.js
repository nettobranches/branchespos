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
                    // $('#modalPago').modal('show');
                });
            }else{
                // $('#modalPagoError').modal('show');
            }
        } // add
    } // methods
}); // component cliente

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
