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
        click: [],
        scroll: {}
    };

    heat4us.tracker = {
        initialize: function(options) {
            this.options = options || {};
            this.options.flushInterval = 2000;
            this.options.getScrollInterval = 2000;
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
            this.scheduleScroll();
        },

        scheduleScroll: function() {
            if (heat4us.scroll) {
                clearTimeout(heat4us.scroll);
            }

            heat4us.scroll = setTimeout(this.getScroll.bind(this), this.options.getScrollInterval);
        },

        getScroll: function() {
            var scroll = document.body.scrollTop;
            if (!heat4us.data.scroll[scroll]) heat4us.data.scroll[scroll] = 0;
            heat4us.data.scroll[scroll] += 1;

            this.scheduleScroll();
        },

        scheduleFlush: function() {
            if (heat4us.polling) {
                clearTimeout(heat4us.polling);
            }

            heat4us.polling = setTimeout(this.flush.bind(this), this.options.flushInterval);
        },

        flush: function() {
            this.sendData();
            this.scheduleFlush();
        },

        sendData: function() {
            var dt = new Date().getTime();
            var width = document.body.offsetWidth
            var height = document.body.offsetHeight
            var url = ["dt=" + dt, "w=" + width.toString(), "h=" + height.toString()];

            var clicks = [];
            for (var i=0; i < heat4us.data.click.length; i++) {
                var item = heat4us.data.click[i];
                clicks.push(item.x.toString() + "," + item.y.toString());
            }
            if (clicks) {
                url.push("cl=" + clicks.join("@"));
            }
            heat4us.data.click = [];

            var hovers = [];
            for (var i=0; i < heat4us.data.hover.length; i++) {
                var item = heat4us.data.hover[i];
                hovers.push(item.x.toString() + "," + item.y.toString());
            }
            if (hovers) {
                url.push("ho=" + hovers.join("@"));
            }
            heat4us.data.hover = [];

            var scrolls = [];
            for (key in heat4us.data.scroll) {
                scrolls.push(key + "," + heat4us.data.scroll[key]);
            }
            if (scrolls) {
                url.push("sc=" + scrolls.join("@"));
            }
            heat4us.data.scroll = {};

            url = url.join("&");

            console.log(url);
        }

    };
}());

heat4us.tracker.initialize();
