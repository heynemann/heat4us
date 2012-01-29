(function($) {

    var Carousel = function(element, options) {
        this.element = $(element);
        this.options = $.extend({}, this.options, options);

        this.initalize();
        this.bindEvents();
    };

    $.extend(Carousel.prototype, {
        options: {
            next: null
        },

        initalize: function() {
            this.paginators = this.element.find('.pagination a');
            this.pages = this.element.find('ul.pages');
            this.containerWidth = this.element.width();
            this.currentPage = 0;
            if (this.options.next) {
                this.nextTriggers = $(this.options.next); 
            }
        },

        bindEvents: function() {
            this.element.on('click', '.pagination a', $.proxy(function(ev) {
                var linkElement = $(ev.target);
                ev.preventDefault();

                this.goTo(linkElement.index());
            }, this));

            this.nextTriggers.on('click', $.proxy(function(ev) {
                ev.preventDefault();
                this.goTo(this.currentPage + 1);
            }, this));
        },

        goTo: function(page) {
            this.currentPage = page;

            this.paginators.removeClass('current');
            this.paginators.eq(page).addClass('current');

            this.pages.css('margin-left', this.containerWidth * this.currentPage * -1);
        }
    });

    $.fn.carousel = function(opt) {
        this.each(function() {
            var el = $(this);
            if (el.data('carousel')) {
                return;
            }
            el.data('carousel', new Carousel(this, opt));
        });
        return this;
    };

}(jQuery));