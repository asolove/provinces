var fs=require('fs');

var process = function(handler){
    var input = JSON.parse(fs.readFileSync('prov_pgn.geojson', 'utf-8'));
    var output = handler(input);
    fs.writeFileSync("prov_pgn_small.geojson", JSON.stringify(output));
};

var shorten = function(a){ 
    a.features.forEach(function(f){
        if(!f.geometry.coordinates) return;

        f.geometry.coordinates = f.geometry.coordinates.filter(function(_, i){
            if (i === 0) return true;
            if (i === f.geometry.coordinates.length - 1) return true;
            if (i % 5 === 0) return true;

            return false;
        });
    });

    return a;
};

process(shorten);
