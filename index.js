
var dynastyDates = {
    "Qin": [-221, -206],
    "Han": [-206, 220],
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

var selected = "Han"; // TODO calc from mouse
var year = 777;
var layer;

var drawDynastyAxes = function() {
    var chart = d3.select("#dynasties");

    var scale = d3.scale.linear()
        .domain([dynasties[0].start, dynasties[dynasties.length-1].end])
        .range([0, chart.attr("width")]);
        
    var bar = chart.selectAll("g")
        .data(dynasties)
        .enter().append("g")
            .attr("transform", function(d){ return "translate("+scale(d.start)+",0)"; });

    bar.append("rect")
        .attr("height", 6)
        .attr("width", function(d){ return scale(d.end) - scale(d.start); });

    bar.append("text")
        .attr('transform', 'translate(0,20)')
        .text(function(d){ return d.name; });

    bar.classed("selected", function(d){ return d.name == selected; });

};

var init = function() {
    drawDynastyAxes();
    var map = L.mapbox.map('map', 'asolove.gh727mie')
        .setView([29.7, 113.4], 6);

    layer = L.mapbox.markerLayer().addTo(map);
    layer.loadURL("prov_pgn.geojson");
    layer.setFilter(function(feature){ 
        var ts = feature.properties.timespan;
        if(!ts) return false;
        if(typeof ts.end == 'string') {
            ts.begin = parseInt(ts.begin, 10);
            ts.end = parseInt(ts.end, 10);
        }
        return ts.begin <= year && ts.end >= year;
    });
};

window.onload = init;


