/**
 * Created by Valentino on 13.12.2015..
 */
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var passport = require('passport');
var uploader = require('../services/upload/upload-service');
/*var mongoStore = require('mongo-store')({
        session: session
});*/
var config = require('../../config/config');
var path = require('path');
var dropbox = require('../services/dropbox/dropbox-service');

module.exports = function(app, db){
    app.use(favicon(path.join(app.get('views'), '/favicon/favicon.ico')));
    require('../models/user.server.model');

    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    app.set('jwtSecret', config.jwtSecret);


    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.use(morgan('dev'));

    app.use(cookieParser());

    app.use(session({
        saveUninitialized: false,
        resave: false,
        secret: config.sessionSecret
    }));

    dropbox.authenticate();

    uploader.create();

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.session());
};