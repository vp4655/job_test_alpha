var uploader = require('../../services/upload/upload-service');
var dropbox = require('../../services/dropbox/dropbox-service');
var chalk = require('chalk');

exports.downloadUrl = function(req, res){
    var dir = req.query.folder;
    dropbox.makeDownloadUrl(dir, function(error, url){
        if(error){
            res.status(500).send({
                message: 'Problem with obtaining download url from dropbox! Try again later.',
                hasError: true
            })
        }
        else{
            res.json({
                downloadUrl : url,
                hasError: false
            });
        }
    })
};

exports.upload = function(req, res){
    uploader.upload(req, res, function(error, request, response){

        if(error){
            response.status(500).send({
                message: 'Error while uploading file to server! Try again later.',
                hasError: true
            })
        }
        else{
            var originalname = request.file.originalname;
            var foldername = request.headers.folder;
            var filename = request.file.filename;
            var username  = request.decoded._doc.username;

            dropbox.uploadUserFile(filename, originalname, foldername, function(error, name, size){

                if(error){
                    res.status(500).send({
                        message: 'Problem with uploading file to dropbox, try again later!',
                        hasError: true
                    })
                }
                else{
                    uploader.remove(filename);
                    console.log('UPLOAD : ' + chalk.green('User = ' + username) + chalk.magenta(' -- File = ' + name) + chalk.yellow(' -- Size = ' + size));
                    res.json({
                        message: 'Successfully uploaded file to dropbox!',
                        hasError: false
                    });
                }
            })
        }
    })
};