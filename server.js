var express = require('express');
var app = express();
var server = require('http').Server(app);
var mongoose = require('mongoose');
var chalk = require('chalk');
var path = require('path');
var config = require('./config/config');

app.set('views', path.join(__dirname, 'public'));
app.use(express.static(app.get('views')));

var db = mongoose.connect(config.db, function(err){
    if(err){
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

//configure middleware
require('./server/config/server.config')(app, db);

require('./server/passport')();

require('./server/router')(app);


server.listen(config.NODE_PORT);
console.log('Server listening on port ' + config.NODE_PORT);