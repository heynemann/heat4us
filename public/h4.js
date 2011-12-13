(function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(object){ 
            var fn = this; 
            return function(){ 
                return fn.apply(object, arguments); 
            }; 
        };
    }

    window.th = window.th || {};

    th.data = {
        hover: [],
        click: [],
        scroll: {}
    };

    th.tracker = {
        initialize: function(options) {
            this.options = options || {};
            this.options.flushInterval = 2000;
            this.options.getScrollInterval = 2000;
            this.options.maxLength = 200;
            this.options.quadrantWidth = 25;

            this.head = document.getElementsByTagName('HEAD').item(0);

            this.bindEvents();
        },

        callback: function(dt) {
            console.log(dt);
        },

        bindEvents: function() {
            window.onmousemove = function(ev) {
                th.data.hover.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            window.onclick = function(ev) {
                th.data.click.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            this.scheduleFlush();
            this.scheduleScroll();
        },

        scheduleScroll: function() {
            if (th.scroll) {
                clearTimeout(th.scroll);
            }

            th.scroll = setTimeout(this.getScroll.bind(this), this.options.getScrollInterval);
        },

        getScroll: function() {
            var scroll = document.body.scrollTop;
            if (!th.data.scroll[scroll]) th.data.scroll[scroll] = 0;
            th.data.scroll[scroll] += 1;

            this.scheduleScroll();
        },

        scheduleFlush: function() {
            if (th.polling) {
                clearTimeout(th.polling);
            }

            th.polling = setTimeout(this.flush.bind(this), this.options.flushInterval);
        },

        flush: function() {
            this.sendData();
            this.scheduleFlush();
        },

        getDimensions: function() {
            var width = document.body.offsetWidth
            var height = document.body.offsetHeight

            return { width: width, height: height };
        },

        sendData: function() {
            var dt = new Date().getTime();
            var dimensions = this.getDimensions();

            var url = ["dt=" + dt, "w=" + dimensions.width.toString(), "h=" + dimensions.height.toString()];
            var itemsSent = 0;

            var clicks = [];
            for (var i=0; i < Math.min(th.data.click.length, this.options.maxLength); i++) {
                var item = th.data.click.pop();
                ++itemsSent;
                clicks.push(item.x.toString() + "," + item.y.toString());
            }
            if (clicks) {
                url.push("cl=" + clicks.join("@"));
            }

            if (itemsSent < this.options.maxLength) { 
                var hovers = [];
                for (var i=0; i < Math.min(th.data.hover.length, this.options.maxLength - itemsSent); i++) {
                    var item = th.data.hover.pop();
                    ++itemsSent;
                    hovers.push(item.x.toString() + "," + item.y.toString());
                }
                if (hovers) {
                    url.push("ho=" + hovers.join("@"));
                }
            }

            if (itemsSent < this.options.maxLength) { 
                var scrolls = [];
                for (key in th.data.scroll) {
                    ++itemsSent;
                    scrolls.push(key + "," + th.data.scroll[key]);
                    if (itemsSent > this.options.maxLength) break;
                }
                if (scrolls) {
                    url.push("sc=" + scrolls.join("@"));
                }
                th.data.scroll = {};
            }

            url = url.join("&");

            this.addScript("/heatmaps/new?" + url);
        },

        addScript: function(url) {
            var oScript= document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = url;
            this.head.appendChild(oScript);
        }
    };
}());

th.tracker.initialize();
