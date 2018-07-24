Vue.component('nuevo-producto',{
    template:"#nuevo-producto",
    props:['productos'],
    data:function () {
        return {
          nitem: {}
        }
    }, // data
    computed:{
        aproductos: function(){
            return this.productos;
        }
    },
    methods:{
        add: function(){
            // this.title = 'tutlo'
            // console.log('producto', this.producto)
            this.aproductos.push(this.nitem);
            this.$emit('update:productos', this.aproductos)
            // console.log('nitem', this.nitem);
        } // add
    } // methods
}); // component nuevo-producto

Vue.component('grid-producto',{
    template:"#grid-producto",
    props:['productos'],
    // template: '<h3>{{ productos }}</h3>',
    created: function(){
    },
}); // component nuevo-producto
