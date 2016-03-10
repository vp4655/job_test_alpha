var multer = require('multer');
var fs = require('fs');
var upload;
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var username = req.decoded._doc.username;
        cb(null, username + '-' + file.originalname)
    }
});

function instantiate(){
    upload = multer({storage: storage}).single('file');
}

exports.create = function(){
    if(!upload){
        instantiate();
    }
};

exports.remove = function(filename){
    fs.unlink('./uploads/' + filename, function(error){
        if(error){
            console.log('FS delete error! ' + error);
        }
    })
};

exports.upload = function(req, res, done){
    upload(req, res, function(error){
        if(error){
            console.log('Multer upload error : ' + error);
        }
        done(error, req, res);
    })
};