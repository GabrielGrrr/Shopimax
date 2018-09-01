parasails.registerPage('browse-product', {
    //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
    //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
    //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
    data: {
        categoryid: '',
        index: 1,
        minPrice: 1,
        maxPrice: 9999
    },

    //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
    //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
    //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
    beforeMount: function () {
        // Attach any initial data from the server.
        _.extend(this, SAILS_LOCALS);
    },
    mounted: async function () {
        var pathArray = window.location.pathname.split('/');
        this.index = pathArray[2];
        this.categoryid = pathArray[3];
    },

    //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
    //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
    methods: {
        updatePriceMin: function (event) {
            this.minPrice = event.target.value;
            axios.get('/browse/' + this.index + '/' + this.categoryid + '?minPrice=' + this.minPrice + '&maxPrice=' + this.maxPrice)
                .then(function (response) {
                    alert(response)
                })
                .catch(function (error) {

                })
        },
        updatePriceMax: function (event) {
            this.maxPrice = event.target.value;
            axios.get('/browse/' + this.index + '/' + this.categoryid + '?minPrice=' + this.minPrice + '&maxPrice=' + this.maxPrice)
                .then(function (response) {
                    alert(response)
                })
                .catch(function (error) {
                })
        },
    }
});
