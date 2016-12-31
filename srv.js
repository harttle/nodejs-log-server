#!/bin/env node

var app = require('express')(),
    mongoose = require('mongoose'),
    help = require('fs').readFileSync(__dirname + '/README.md', 'utf8'),
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

app.get('/delete/:mod', function(req, res) {
    Log.remove({
        mod: req.params.mod
    }, function(e, ret) {
        if (e) {
            res.status(500).end(e.stack);
            return;
        }
        var result = ret.result;
        res
            .set({
                'Content-Type': 'text/plain'
            })
            .end(result.n + ' logs removed');
    });
});

app.get('/get/:mod', function(req, res) {
    var query = {
        mod: req.params.mod
    };
    if (req.query.level) {
        query.level = req.query.level
    };
    Log.find(query, function(e, logs) {
        if (e) {
            res.status(500).end(e.stack);
            return;
        }
        var body = logs
            .map(function logLine(log) {
                return '[' + log.date.toISOString() + ']' +
                    '[' + log.mod + ']' +
                    '[' + log.level + '] ' +
                    log.msg;
            })
            .map(function logParagraph(line) {
                return '<p>' + line + '</p>';
            })
            .join('\n');
        res.set({
            'Content-Type': 'text/html'
        }).end(body);
    });
});

app.get('/help', function(req, res) {
    res.end(help);
});

var port = process.env.PORT || 8777;
app.listen(port, function() {
    console.log('Log server listening on ' + port);
});
