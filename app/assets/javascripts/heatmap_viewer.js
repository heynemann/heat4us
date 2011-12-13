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
    window.heat4us.quadrantWidth = 25;

    heat4us.tracker = {
        getDimensions: function() {
            var width = document.body.offsetWidth
            var height = document.body.offsetHeight

            return { width: width, height: height };
        },

        getCoordsForQuad: function(dimensions, quadrant) {
            var itemsPerRow = Math.floor(dimensions.width / heat4us.quadrantWidth);
            var yQuad = Math.ceil(quadrant / itemsPerRow) - 1;
            var xQuad = quadrant % itemsPerRow == 0 ? itemsPerRow : (quadrant % itemsPerRow) - 1;

            return {
                x: (xQuad * heat4us.quadrantWidth) + (heat4us.quadrantWidth / 2),
                y: (yQuad * heat4us.quadrantWidth) + (heat4us.quadrantWidth / 2)
            };
        },

        plot: function(element, points) {
            var xx = h337.create({"element": element, "radius": heat4us.quadrantWidth * 2, "visible": true});
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
                data.data.push(dataItem);
            }
            console.log(data);
            xx.store.setDataSet(data);
        }

    };
}());
