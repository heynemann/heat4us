(function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(object){ 
            var fn = this; 
            return function(){ 
                return fn.apply(object, arguments); 
            }; 
        };
    }

    window.h4 = window.h4 || {};

    h4.data = {
        hover: [],
        click: [],
        scroll: {}
    };

    h4.tracker = {
        initialize: function(id, options) {
            this.id = id;
            this.options = options || {};
            this.options.flushInterval = 2000;
            this.options.getScrollInterval = 2000;
            this.options.maxLength = 150;
            this.options.quadrantWidth = 25;
            this.options.serverUrl = "http://local.heat4.us:3000"

            this.head = document.getElementsByTagName('HEAD').item(0);

            this.bindEvents();
        },

        callback: function(dt) {
            console.log(dt);
        },

        bindEvents: function() {
            window.onmousemove = function(ev) {
                h4.data.hover.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            window.onclick = function(ev) {
                h4.data.click.push({
                    x: ev.pageX,
                    y: ev.pageY
                });
            };

            this.scheduleFlush();
            this.scheduleScroll();
        },

        scheduleScroll: function() {
            if (h4.scroll) {
                clearTimeout(h4.scroll);
            }

            h4.scroll = setTimeout(this.getScroll.bind(this), this.options.getScrollInterval);
        },

        getScroll: function() {
            var scroll = document.body.scrollTop;
            if (!h4.data.scroll[scroll]) h4.data.scroll[scroll] = 0;
            h4.data.scroll[scroll] += 1;

            this.scheduleScroll();
        },

        scheduleFlush: function() {
            if (h4.polling) {
                clearTimeout(h4.polling);
            }

            h4.polling = setTimeout(this.flush.bind(this), this.options.flushInterval);
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

            var url = [
                "id=" + this.id,
                "l=" + window.location,
                "dt=" + dt, 
                "w=" + dimensions.width.toString(), 
                "h=" + dimensions.height.toString()
            ];

            var itemsSent = 0;

            var clicks = [];
            for (var i=0; i < Math.min(h4.data.click.length, this.options.maxLength); i++) {
                var item = h4.data.click.pop();
                ++itemsSent;
                clicks.push(item.x.toString() + "," + item.y.toString());
            }
            if (clicks) {
                url.push("cl=" + clicks.join("@"));
            }

            if (itemsSent < this.options.maxLength) { 
                var hovers = [];
                for (var i=0; i < Math.min(h4.data.hover.length, this.options.maxLength - itemsSent); i++) {
                    var item = h4.data.hover.pop();
                    ++itemsSent;
                    hovers.push(item.x.toString() + "," + item.y.toString());
                }
                if (hovers) {
                    url.push("ho=" + hovers.join("@"));
                }
            }

            if (itemsSent < this.options.maxLength) { 
                var scrolls = [];
                for (key in h4.data.scroll) {
                    ++itemsSent;
                    scrolls.push(key + "," + h4.data.scroll[key]);
                    if (itemsSent > this.options.maxLength) break;
                }
                if (scrolls) {
                    url.push("sc=" + scrolls.join("@"));
                }
                h4.data.scroll = {};
            }

            url = url.join("&");

            this.addScript(this.options.serverUrl + "/heatmaps/new?" + url);
        },

        addScript: function(url) {
            var oScript= document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = url;
            this.head.appendChild(oScript);
        }
    };
}());

