Vue.component('apartado',{
    template:"#apartado",
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
