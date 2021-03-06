var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const {permission} = require('./public/js/permission.js')
var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');
var tree = require('./routes/tree');
//var history= require('connect-history-api-fallback');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: '12345',
    name: 'testapp', //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: {maxAge: 80000000}, //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'treedist')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));

aa = require('./example/AccessMng');
aa.getIns().rules;
app.use(permission({config: require('./example/config')}));//before route ;means useful to route ,or if do all ,the static resouces can be inflected!

//
//app.use(history({
//    rewrites:[{from:/\/solution/,to:'/index.html'}]
//}));
app.use('/', index);
app.use('/users', users);
app.use('/login', login);//app.use(permission({config: require('./example/config')}));//before route ;means useful to route ,or if do all ,the static resouces can be inflected!

app.use('/tree', tree);
app.use('/note', require('./routes/note.js')());
app.use('/community', require('./routes/community.js')());
app.use('/notice', require('./routes/notice.js')());
app.use('/im', require('./routes/im.js')());


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
