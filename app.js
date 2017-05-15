var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//use the handlebars
var expressHbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;




var app = express();

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout: 'layout', extname:'.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(bodyParser.urlencoded({
    extended: false
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(bodyParser.json());

//Handle express session
app.use(session({
    secret : 'secret',
    saveUninitialize : true,
    resave : true
}));



// File upload
var uplaod = multer({dest : 'uploads/'});

var index = require('./routes/index');
var user = require('./routes/users');

app.use(flash());
// Passport
app.use(passport.initialize());
app.use(passport.session());

//  the formParam value is going to get morphed into form body format useful for printing.
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Flash
app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', index);
app.use('/users',user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
