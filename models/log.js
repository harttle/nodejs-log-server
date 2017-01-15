var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/logs');

var LogSchema = new mongoose.Schema({
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

module.exports = mongoose.model('log', LogSchema);
