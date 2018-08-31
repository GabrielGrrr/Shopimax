Vue.component('quantity-setter', {
    props: ['offer-id'],
    data: function () {
        return {
            quantitySelected: 1
        }
    },
    template: '<button @click="count++">Vous m\'avez cliqué {{ count }} fois.</button>',

    methods: {
        updateQuantity: function (id, event) {
            Vue.set(this.quantitySelected, id, event.target.value);
            $('#' + id).attr('href', '/basket/add/' + id + '/' + event.target.value);
        },
    }
})