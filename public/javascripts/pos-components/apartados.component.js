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

Vue.component('nuevo-apartado',{
    template:"#nuevo-apartado",
    props:['cliente', 'productos'],
    methods:{
        save: function(){
            var _this = this;
            console.log('cliente', this.cliente, 'productos', this.productos);
            if (this.cliente && this.productos){
                // guarda producto
                postDoc('/api/apartados/save/', {cliente: this.cliente, productos: this.productos}, function(res){
                    // $('#modalPago').modal('show');
                    alert('guardado')
                });
            }else{
                // $('#modalPagoError').modal('show');
            }
        } // add
    } // methods
}); // component cliente
