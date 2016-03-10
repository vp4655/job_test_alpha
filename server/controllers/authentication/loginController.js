'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    jwt = require('jsonwebtoken'),
    config = require('../../../config/config'),
    dropbox = require('../../services/dropbox/dropbox-service');

exports.signup = function(req, res) {
    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);
    var message = null;

    // Add missing user fields
    user.provider = 'local';

    // Then save the user
    user.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: 'Database save failed! Try again later.',
                hasError: true
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    console.log(err);
                    res.status(400).send({
                        message: 'Signup failed, check your username and password requirements!',
                        hasError: true
                    });
                } else {
                    var token = jwt.sign(user, config.jwtSecret, {
                        expiresIn: 86400
                    });
                    dropbox.createUserDir(user.username, function(error){
                        if(error){
                            console.log(error);
                            res.status(500).send({
                                message: 'Dropbox login failed for our dropbox folder, try again later!',
                                hasError: true
                            })
                        }
                        res.json({
                            username: user.username,
                            token: token,
                            hasError: false
                        });
                    });
                }
            });
        }
    });
};

exports.signin = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err || !user) {
            console.log(err);
            res.status(400).send({
                message: 'Login failed, you must be signed in to login!',
                hasError: true
            });
        } else {
            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function(err) {
                if (err) {
                    console.log(err);
                    res.status(400).send({
                        message: 'Login failed, you must be signed in to login!',
                        hasError: true
                    });
                } else {
                    var token = jwt.sign(user, config.jwtSecret, {
                        expiresIn: 86400
                    });
                    res.json({
                        username: user.username,
                        token: token,
                        hasError: false
                    });
                }
            });
        }
    })(req, res, next);
};

exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};