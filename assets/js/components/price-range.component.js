Vue.component('price-range', {
    props: ['categoryid', 'index'],
    data: function () {
        return {
            minPrice: 1,
            maxPrice: 9999
        }
    },
    template: `<input class="price-range" 
                    v-model="minPrice" 
                    @change="modifyPriceRange($event)"  v-cloak>
                </input>
                <input class="price-range" 
                    v-model="minPrice" 
                    @change="modifyPriceRange($event)"  v-cloak>
                `,

    methods: {
        modifyPriceRange: function (event) {
            $('#' + this.offerid).attr('href', '/basket/add/' + this.offerid + '/' + event.target.value);
        },
    }
});