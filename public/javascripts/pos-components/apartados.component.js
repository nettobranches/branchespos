

Vue.component('nuevo-apartado',{
    template:"#nuevo-apartado",
    props:['cliente', 'productos', 'abonos'],
    methods:{
        save: function(){
            var _this = this;
            // console.log('cliente', this.cliente, 'productos', this.productos);
            if (this.cliente && this.productos){
                // guarda producto
                postDoc('/api/apartados/save/', {cliente: this.cliente, productos: this.productos, abonos: this.abonos}, function(res){
                    // $('#modalPago').modal('show');
                    alert('guardado')
                });
            }else{
                // $('#modalPagoError').modal('show');
            }
        } // save
    } // methods
}); // component cliente

Vue.component('update-apartado',{
    template:"#update-apartado",
    props:['apartado', 'abonos'],
    methods:{
        update: function(){
            var _this = this;
            // guarda producto
            postDoc('/api/apartados/abono/', {apartado: this.apartado, abonos: this.abonos}, function(res){
                // $('#modalPago').modal('show');
                alert('Actualizado')
            });
        } // save
    } // methods
}); // component cliente

Vue.component('abono-apartado',{
    template:"#abono-apartado",
    props:['abonos'],
    data:function(){
        return {
            cantidad: 0
        }
    },
    computed:{
        aabonos: function(){
            return this.abonos;
        }
    },
    methods:{
        add: function(){
            var now = new Date();
            var fecha = moment(String(now)).format("YYYY-MM-DD HH:mm:ss")
            this.aabonos.push({fecha: fecha, cantidad: this.cantidad});
            this.$emit('update:abonos', this.aabonos);
        } // add
    } // methods
}); // component cliente

Vue.component('grid-abono-apartado',{
    template:"#grid-abono-apartado",
    props:['abonos'],
    data:function(){
        return {}},
    methods:{
        add: function(){} // add
    } // methods
}); // component cliente

Vue.component('search-apartado',{
    template:"#search-apartado",
    props:['abonos', 'productos', 'apartado'],
    data:function(){
        return {
            searchFld: "",
            apartado: {}
        }},
    methods:{
        search: function(){
            var _this = this;
            postDoc('/api/apartados/search', {search_fld: this.searchFld}, function(res){
                console.log('apartado ',res);
                _this.apartado = res.items[0];
                _this.$emit('update:abonos', JSON.parse(_this.apartado.json_abonos));
                _this.$emit('update:productos', JSON.parse(_this.apartado.json_productos));
                _this.$emit('update:apartado', {id: _this.apartado.id});
            });
        } // search
    } // methods
}); // component search-apartado
