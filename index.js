
var dynastyDates = {
    "Three Kingdoms": [220, 280], // overlap here
    "Jin": [280, 420],
    "Norther/Southern Dynasties": [420, 589],
    "Sui": [589, 618],
    "Tang": [618, 907],
    "Period of Disunity": [907, 960],
    "Song": [960, 1279],
    "Yuan": [1279, 1368],
    "Ming": [1368, 1644],
    "Qing": [1644, 1911]
};

var dynasties = Object.keys(dynastyDates).map(function(name) {
    return { name: name, start: dynastyDates[name][0], end: dynastyDates[name][1] };
});

var year = 220;
var layer;
var scale;
var chart;
var animating = true;
var layerStyle = {
    "color": "#000",
    "stroke": "white",
    "weight": 2,
    "opacity": 0.35,
};

var first = function() {
    chart = d3.select("#dynasties");

    scale = d3.scale.linear()
        .domain([dynasties[0].start, dynasties[dynasties.length-1].end])
        .range([20, chart.attr("height")-20]);
        
    var bar = chart.selectAll("g")
        .data(dynasties)
        .enter().append("g")
            .attr("transform", function(d){ return "translate(35,"+scale(d.start)+")"; });

    bar.append("rect")
        .attr("width", 6)
        .attr("height", function(d){ return scale(d.end) - scale(d.start); });

    var dragging = false;
    chart.on('mousedown', function(){ animating = false; dragging = true; });
    d3.select("body").on("mouseup", function(){ dragging = false; });
    chart.on('mousemove', function(d){
        if (!dragging) return;
        year = Math.round(scale.invert(d3.event.layerY-20));
        update(year);
    });
};

var update = function(y) {
    year = y;

    layer.setFilter(filterByYear(year));
    layer.setStyle(layerStyle);

    var marker = chart.selectAll("g.marker")
        .data([year])
        .attr("text-anchor", "end")
        .attr("transform", function(d) { return "translate(34,"+(scale(d)+7)+")"; });

    marker.select("text.year")
        .text(function(a){ return a; });

    var group = marker.enter().append("g")
            .classed("marker", true);

    group.append("text")
        .classed("year", true);

    group.append("text")
        .classed("text", true)
        .text("◀")
        .attr("transform", "translate(22,0)");
};

var init = function() {
    first();
    var map = L.mapbox.map('map', 'asolove.pirate-map', { zoomControl: false })
        .setView([29.7, 113.4], 5);

    d3.json("prov_pgn_small.geojson", function(data) {
        layer = L.mapbox.markerLayer(data, {style: function(){debugger;}}).addTo(map);
        layer.setStyle(layerStyle);
        layer.setFilter(filterByYear(year));
        animate(layer);
    });
};

var animate = function() {
    update(year+3);
    if(!animating || year > 1910) return;
    setTimeout(animate, 32);
};

var filterByYear = function(year) {
    return function(feature) {
        var ts = feature.properties.timespan;
        if(!ts) return false;
        if(typeof ts.end == 'string') {
            ts.begin = parseInt(ts.begin, 10);
            ts.end = parseInt(ts.end, 10);
        }
        return ts.begin <= year && ts.end >= year;
    };
};

window.onload = init;


