
var dynastyDates = {
    "Three Kingdoms": [220, 280], // overlap here
    "Jin": [280, 420],
    "Norther/Southern Dynasties": [420, 589],
    "Sui": [589, 618],
    "Tang": [618, 907],
    "?": [907, 960],
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

var drawDynastyAxes = function() {
    chart = d3.select("#dynasties");

    scale = d3.scale.linear()
        .domain([dynasties[0].start, dynasties[dynasties.length-1].end])
        .range([20, chart.attr("height")-20]);
        
    var bar = chart.selectAll("g")
        .data(dynasties)
        .enter().append("g")
            .attr("transform", function(d){ return "translate(45,"+scale(d.start)+")"; });

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

    var marker = chart.selectAll("g.marker")
        .data([year])
        .attr("transform", function(d) { return "translate(40,"+scale(d)+")"; });

    marker.select("text.year")
        .text(formatYear);

    var group = marker.enter().append("g")
            .classed("marker", true);

    group.append("text")
        .classed("year", true);

    group.append("text")
        .classed("text", true)
        .text("◀")
        .attr("transform", "translate(25,0)");
};

var formatYear = function(year) {
    return year;
};


var init = function() {
    drawDynastyAxes();
    var map = L.mapbox.map('map', 'asolove.pirate-map', { zoomControl: false })
        .setView([29.7, 113.4], 5);
    var myStyle = {
        "color": "#ff0",
        "weight": 2,
        "opacity": 0.65,
        "fillColor": "#0f0"
    };

    d3.json("prov_pgn.geojson", function(data) {
        layer = L.mapbox.markerLayer(data).addTo(map);
        layer.setStyle(myStyle);
        layer.options.style = myStyle;

        animate(layer);
    });
};

var animate = function() {
    update(year+1);
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


