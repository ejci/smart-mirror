var exec = require('child_process').exec;
var config = require(__dirname + '/airplay.json');
var request = require('request');
var utf8 = require('utf8');

var airplayScriptCmd = 'shairport-sync --name='+config.name+' --metadata-pipename=' + __dirname + '/' + config.script.meta + ' --on-start=' + __dirname + '/' + config.script.start + ' --on-stop=' + __dirname + '/' + config.script.stop + '';
var metaScriptCmd = 'shairport-sync-metadata-reader < ' + __dirname + '/' + config.script.meta + '';

//console.log(airplayScript);
//console.log(metaScript);

var airplayScript = exec(airplayScriptCmd);
var metaReader = exec(metaScriptCmd);
var meta = {
    album: '',
    title: '',
    artist: ''
};

metaReader.stdout.on('data', function (data) {
    var lines = utf8.decode(data).toString().split('\n');
    var change = false;
    lines.forEach(function (line) {
        //console.log('meta: '+ line);
        if (line.indexOf('Album Name: ') == 0) {
            var out = line.replace('Album Name: ', '');
            meta.album = out.trim().slice(1, -2);
            change = true;
        }
        if (line.indexOf('Title: ') == 0) {
            var out = line.replace('Title: ', '');
            meta.title = out.trim().slice(1, -2);
            change = true;
        }
        if (line.indexOf('Artist: ') == 0) {
            var out = line.replace('Artist: ', '');
            meta.artist = out.trim().slice(1, -2);
            change = true;
        }
    });
    if (change) {
        //console.info('Change detected...',JSON.stringify(meta));
        //request.post(config.endpoint, meta);
        request({
            url: config.endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            json: meta
        }, function (err, res, body) {
            //dont care
        });

    }
});

console.log(config.description);
console.log('Airplay name       : ' + config.name);
console.log('Start script       : ' + config.script.start);
console.log('Stop script        : ' + config.script.stop);
console.log('Meta pipe          : ' + config.script.meta);
console.log('Start command      : ' + airplayScriptCmd);
console.log('Meta command       : ' + metaScriptCmd);
console.log('Endpoint           : ' + config.endpoint);

