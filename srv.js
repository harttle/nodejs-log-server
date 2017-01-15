#!/bin/env node

var app = require('./app');
var port = process.env.PORT || 8777;

app.listen(port, function() {
    console.log('Log server listening on ' + port);
});
