#!/bin/env node

var app = require('express')(),
    marked = require('marked'),
    mongoose = require('mongoose'),
    help = marked(require('fs').readFileSync(__dirname + '/README.md', 'utf8')),
    Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/logs');

var LogSchema = new Schema({
    level: String,
    mod: String,
    date: {
        type: Date,
        default: Date.now
    },
    msg: {
        type: String,
        default: '[empty message]'
    }
});

var Log = mongoose.model('log', LogSchema);

app.get('/post/:mod', function(req, res) {
    res.status(202).end("saving log on " + Date());
    var msg = decodeURIComponent(req.query.msg || '');

    Log.create({
        level: req.query.level || 'log',
        mod: req.params.mod,
        msg: msg
    });
});

app.get('/delete/:mod?', function(req, res) {
    var query = {};
    if (req.params.mod) {
        query.mod = req.params.mod;
    }
    if (req.query.level) {
        query.level = req.query.level;
    }
    Log.remove(query, function(e, ret) {
        if (e) return res.status(500).end(e.stack);
        var result = ret.result;
        res.end(result.n + ' logs removed');
    });
});

app.get('/get/:mod?', function(req, res) {
    var query = {};
    if (req.params.mod) {
        query.mod = req.params.mod;
    }
    if (req.query.level) {
        query.level = req.query.level;
    }
    Log.find(query, function(e, logs) {
        if (e) return res.status(500).end(e.stack);
        var body = logs.map(render).join('\n');
        if (logs.length === 0) {
            var idstr = `id: ${query.mod || 'all'}`;
            var levelstr = `level: ${query.mod || 'all'}`;
            body = `[logs not found] ${idstr}, ${levelstr}`;
        }
        res.set({ 'Content-Type': 'text/html' }).end(body);
    });
});

app.get('/', function(req, res) {
    res.end(help);
});

function render(log) {
    var line = '[' + log.date.toISOString() + ']' +
        '[' + log.mod + ']' +
        '[' + log.level + '] ' +
        log.msg;
    return '<p>' + line + '</p>';
}

var port = process.env.PORT || 8777;
app.listen(port, function() {
    console.log('Log server listening on ' + port);
});
