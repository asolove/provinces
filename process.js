function io(handler) {
    var input = "";
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function(chunk) {
      input += chunk;
    });

    process.stdin.on('end', function() {
      var json = JSON.parse(input);
      console.log(JSON.stringify(handler(json)));
    });
}

function id(a){ return a; }

function transform(data) {
    data.features.forEach(function(feature) {
        feature.geometry.coordinates;
        feature.properties.timespan;
        feature.properties.description;
    });
}

io(id);
