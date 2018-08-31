Vue.component('carousel-items', {
    data: function () {
        return {
            count: 0
        }
    },
    template: '<button v-on:click="count++">Vous m\'avez cliqué {{ count }} fois.</button>'
})