Vue.component('quantity-setter', {
    props: ['offerid', 'nboptions'],
    data: function () {
        return {
            quantitySelected: 1
        }
    },
    template: `<select class="quantity-setter" 
                    v-model="quantitySelected" 
                    @change="modifyQuantity($event)"  v-cloak>
                        <option disabled value="0">Quantité</option>
                        <slot></slot>
                </select>`,

    methods: {
        modifyQuantity: function (event) {
            $('#' + this.offerid).attr('href', '/basket/add/' + this.offerid + '/' + event.target.value);
        },
    }
});