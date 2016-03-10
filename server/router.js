var path = require('path');
var authRouter = require('./routers/auth/authRouter');
var apiRouter = require('./routers/api/apiRouter');

module.exports = function (app) {

    app.use('/auth', authRouter);

    app.use('/api', apiRouter);

    app.route('/*')
        .get(function(req, res) {
            res.sendFile(path.resolve(app.get('views') + '/index.html'));
        });

    app.get('*', function(req, res) {
        res.redirect('/#' + req.originalUrl);
    });
};