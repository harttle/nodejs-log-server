#!/bin/env node

var app = require('express')();
var Liquid = require('shopify-liquid');
var marked = require('marked');
var Log = require('./models/log');
var help = marked(require('fs').readFileSync(__dirname + '/README.md', 'utf8'));
var path = require('path');
var pkg = require('./package.json');

// template engine
var engine = Liquid({
    root: path.resolve(__dirname, 'views/'),
    extname: '.html',
    cache: process.env.NODE_ENV === 'production'
});
app.engine('html', engine.express());
app.set('views', './views');
app.set('view engine', 'html');

// routes
app.get('/post/:mod', function(req, res) {
    res.status(202).end('Log received.');
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
        res.locals.pkg = pkg;
        if (logs.length === 0) res.render('empty', query);
        else res.render('logs', { logs: logs });
    });
});

app.get('/', function(req, res) {
    res.end(help);
});

module.exports = app;
