'use strict';

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../../../config/config');
var folder = require('./../../controllers/api/folderController');
var upload = require('./../../controllers/api/uploadController');
var username;

router.use(function(req, res, next){

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.jwtSecret, function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                username = decoded._doc.username;

                next();
            }
        });

    } else {

        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }

});

router.route('/folder')
    .get(folder.list)
    .post(folder.create)
    .delete(folder.delete);

router.route('/upload')
    .post(upload.upload);

router.route('/download')
    .get(upload.downloadUrl);

module.exports = router;