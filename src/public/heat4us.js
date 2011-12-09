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
            this.options.maxLength = 40;
            this.options.quadrantWidth = 25;

            this.head = document.getElementsByTagName('HEAD').item(0);

            this.bindEvents();
        },

        callback: function(dt) {
            console.log(dt);
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
            for (var i=0; i < Math.min(heat4us.data.click.length, this.options.maxLength); i++) {
                var item = heat4us.data.click.pop();
                ++itemsSent;
                clicks.push(item.x.toString() + "," + item.y.toString());
            }
            if (clicks) {
                url.push("cl=" + clicks.join("@"));
            }

            //if (itemsSent < this.options.maxLength) { 
                //var hovers = [];
                //for (var i=0; i < Math.min(heat4us.data.hover.length, this.options.maxLength - itemsSent); i++) {
                    //var item = heat4us.data.hover.pop();
                    //++itemsSent;
                    //hovers.push(item.x.toString() + "," + item.y.toString());
                //}
                //if (hovers) {
                    //url.push("ho=" + hovers.join("@"));
                //}
            //}

            if (itemsSent < this.options.maxLength) { 
                var scrolls = [];
                for (key in heat4us.data.scroll) {
                    ++itemsSent;
                    scrolls.push(key + "," + heat4us.data.scroll[key]);
                    if (itemsSent > this.options.maxLength) break;
                }
                if (scrolls) {
                    url.push("sc=" + scrolls.join("@"));
                }
                heat4us.data.scroll = {};
            }

            url = url.join("&");

            this.addScript("/c?" + url);
        },

        addScript: function(url) {
            var oScript= document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src = url;
            this.head.appendChild(oScript);
        },

        getCoordsForQuad: function(dimensions, quadrant) {
            var itemsPerRow = Math.floor(dimensions.width / this.options.quadrantWidth);
            var yQuad = Math.ceil(quadrant / itemsPerRow) - 1;
            var xQuad = quadrant % itemsPerRow == 0 ? itemsPerRow : (quadrant % itemsPerRow) - 1;

            return {
                x: (xQuad * this.options.quadrantWidth) + (this.options.quadrantWidth / 2),
                y: (yQuad * this.options.quadrantWidth) + (this.options.quadrantWidth / 2)
            };
        },

        plot: function(element, points) {
            var xx = h337.create({"element": element, "radius": this.options.quadrantWidth, "visible": true});
            var data = {
                max: 0,
                data: []
            };

            var dimensions = this.getDimensions();

            for (var i=0; i < points.length; i++) {
                var item = points[i];
                coords = this.getCoordsForQuad(dimensions, item.quad);

                if (item.count > data.max) data.max = item.count;

                var dataItem = {
                    x: coords.x,
                    y: coords.y,
                    count: item.count
                };
                console.log(dataItem);
                data.data.push(dataItem);
            }
            xx.store.setDataSet(data);
        }

    };
}());

heat4us.tracker.initialize();
