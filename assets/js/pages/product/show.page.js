parasails.registerPage('show-product', {
    //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
    //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
    //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
    data: {
        heroHeightSet: false,
        quantitySelected: {
        }
    },

    //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
    //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
    //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
    beforeMount: function () {
        // Attach any initial data from the server.
        _.extend(this, SAILS_LOCALS);
    },
    mounted: async function () {
        this._setHeroHeight();
    },

    //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
    //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
    methods: {
        updateQuantity: function (id, event) {
            Vue.set(this.quantitySelected, id, event.target.value);
            $('#' + id).attr('href', '/basket/add/' + id + '/' + event.target.value);
            // Scroll to the 'get started' section:
            /*$('html, body').animate({
                scrollTop: this.$find('[role="scroll-destination"]').offset().top
            }, 500);*/
        },

        initializeQuantity: function (id) {
            Vue.set(this.quantitySelected, id, 1);
            $('#' + id).attr('href', '/basket/add/' + id + '/' + 1);
        },

        updateImage: function (id, event) {
            $('#' + id).attr('src', event.target.src);
        },

        // Private methods not tied to a particular DOM event are prefixed with _
        _setHeroHeight: function () {
            var $hero = this.$find('[full-page-hero]');
            var headerHeight = $('#page-header').outerHeight();
            var heightToSet = $(window).height();
            heightToSet = Math.max(heightToSet, 500);//« ensure min height of 500px - header height
            heightToSet = Math.min(heightToSet, 1000);//« ensure max height of 1000px - header height
            $hero.css('min-height', heightToSet - headerHeight + 'px');
            this.heroHeightSet = true;
        },

    }
});
