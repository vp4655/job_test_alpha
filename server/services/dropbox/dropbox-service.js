var config = require('../../../config/config');
var Dropbox = require('dropbox');
var fs = require('fs');
var client = new Dropbox.Client({
    key: config.dropboxAPIKey,
    secret: config.dropboxAPISecret,
    sandbox: false,
    token: config.dropboxToken
});
var dropboxUser;

exports.authenticate = function(){
    if(!dropboxUser){
        client.authenticate(function(error, client) {
            if (error) {
                // Replace with a call to your own error-handling code.
                //
                // Don't forget to return from the callback, so you don't execute the code
                // that assumes everything went well.
                console.log('Dropbox error:' + error);
            }

            dropboxUser = client;
            //console.log(client);
        });
    }
};

exports.createUserDir = function(dir, done){
    dropboxUser.mkdir(dir, function(error){
        if(error){
            console.log('Dropbox create folder error: ' + error);
        }
        done(error);
    })
};

exports.deleteUserDir = function(folderName, done){
    dropboxUser.remove(folderName, function(error){
        if(error){
            console.log('Dropbox client error on delete : ' + error);
        }
        done(error);
    })
};

exports.listUserDir = function(dir, done){
    //var dir = "/" + username;
    //console.log(username);
    dropboxUser.readdir( dir, function(error, entries, stat, stats) {
        if (error) {
            console.log('Dropbox client error on list : ' + error);
        }
        done(error, entries, stats);
    });
};

exports.makeDownloadUrl = function(dir, done){
    dropboxUser.makeUrl(dir, {download: true}, function(error, url){
        if(error){
            console.log('Dropbox error on make download url! ' + error);
        }
        done(error, url);
    })
};

exports.uploadUserFile = function(filename, originalname, foldername, done){
    var location = './uploads/' + filename;
    var dest = '/' + foldername + '/' + originalname;

    fs.readFile(location, function(error, data){
        if(error){
            console.log('FS readFile error : ' + error);
            done(error, null, null);
        }

        dropboxUser.writeFile(dest, data, function(error, data){
            if(error){
                console.log('Dropbox upload error : ' + error);
            }
            done(error, data.name, data.humanSize);
        })

    });
};