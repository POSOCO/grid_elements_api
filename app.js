var db = require('./project/db');
var express = require('express');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('./project/config/cors');
var favicon = require('serve-favicon');
var passport = require('./project/config/passport').get();
var flash = require('connect-flash');

var app = express();
var port = process.env.PORT || 3000;

app.use(cors());

app.use(cookieParser());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(session({
    secret: 'anystringoftext',
    saveUninitialized: true,
    resave: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


app.use(express.static(__dirname + '/project/views'));
app.set('views', __dirname + '/project/views');
app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.set('json spaces', 1);

app.use(favicon(__dirname + '/project/public/img/favicon.ico'));

//use for authentication of post requests
//app.use('/', require('./project/controllers/auth'));

app.use('/api/voltages', require('./project/controllers/voltage'));
app.use('/api/element_types', require('./project/controllers/element_type'));
app.use('/api/regions', require('./project/controllers/region'));
app.use('/api/states', require('./project/controllers/state'));
app.use('/api/conductor_types', require('./project/controllers/conductor_type'));
app.use('/api/owners', require('./project/controllers/owner'));
app.use('/api/substations', require('./project/controllers/substation'));
//app.use('/api/lines', require('./project/controllers/line'));
app.use('/', require('./project/controllers/general'));


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/*

// error handlers
//CHECK OUT ERROR HANDLERS HERE https://derickbailey.com/2014/09/06/proper-error-handling-in-expressjs-route-handlers/
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            Error: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        Error: err.message,
        error: err
    });
});
*/

// Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function (err) {
    if (err) {
        console.log('Unable to connect to the Grid Elements Database.');
        process.exit(1);
    } else {
        app.listen(port, function () {
            console.log('Listening on port ' + port + ' ...');
        })
    }
});