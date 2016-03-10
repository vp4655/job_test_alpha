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

function reportNoFolderError(res){
    console.log('No folder sent!');
    res.status(500).send({
        message: 'Internal server error.',
        hasError: true
    })
}

exports.list = function(req, res) {
    var folder = req.body.folder;
    folder = req.headers.folder;
    if(folder){
        dropbox.listUserDir(folder, function(error, entries, stats){
            //console.log(entries);
            if(error){
                res.status(500).send({
                    message: 'Problems with loading dropbox directory list! Try again later.',
                    hasError: true
                })
            }
            else{
                res.json({
                    dir: entries,
                    stats: stats,
                    hasError: false
                });
            }
        });
    }
    else{
        reportNoFolderError(res);
    }
};

exports.create = function(req, res) {
    var folder = req.body.folder;

    if(folder){
        dropbox.createUserDir(folder, function(error){
            if(error){
                res.status(500).send({
                    message: 'Problem with creating folder on dropbox! Try again later.',
                    hasError: true
                })

            }
            else{
                res.json({
                    message: 'Successfully created folder ' + folder,
                    hasError: false
                });
            }
        })
    }
    else {
        reportNoFolderError(res);
    }

};

exports.delete = function(req, res){
    var folder = req.query.folder;

    if(folder){
        dropbox.deleteUserDir(folder, function(error){
            if(error){
                res.status(500).send({
                    message: 'Problem with deleting folder on dropbox! Try again later.',
                    hasError: true
                })
            }
            else{
                res.json({
                    message: 'Successfully deleted folder ' + folder,
                    hasError: false
                });
            }
        })
    }
    else{
        reportNoFolderError(res);
    }
};