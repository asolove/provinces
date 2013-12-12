
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


var drawDynastyAxes = function() {
    var chart = d3.select("#dynasties");
    var selected = "Han"; // TODO calc from mouse

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
};

window.onload = init;

