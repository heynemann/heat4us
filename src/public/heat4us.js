(function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(object){ 
            var fn = this; 
            return function(){ 
                return fn.apply(object, arguments); 
            }; 
        };
    }

    window.heat4us = window.heat4us || {};

    heat4us.data = {
        hover: [],
        click: []
    };

    heat4us.tracker = {
        initialize: function(options) {
            this.options = options || {};
            this.options.flushInterval = 2000;
            this.bindEvents();
        },

        bindEvents: function() {
            window.onmousemove = function(ev) {
                heat4us.data.hover.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            window.onclick = function(ev) {
                heat4us.data.click.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            this.scheduleFlush();
        },

        scheduleFlush: function() {
            if (heat4us.polling) {
                clearTimeout(heat4us.polling);
            }

            heat4us.polling = setTimeout(this.flush.bind(this), this.options.flushInterval);
        },

        flush: function() {
            console.log(heat4us.data);
            this.scheduleFlush();
        }
    };
}());

heat4us.tracker.initialize();
