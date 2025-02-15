var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('express-handlebars')
let db = require('./connection/connection')
var session = require('express-session');
var fileupload = require('express-fileupload')

//database connection
db.connect((err) => {
  if (err) {
    throw err
  }
  console.log('MySql Connected')
})

var indexRouter = require('./routes/index');
var hodRouter = require('./routes/hod');
var collageRouter = require('./routes/collage');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: path.join(__dirname, 'views/layouts/'), partialsDir: path.join(__dirname, 'views/partials/') }))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'upload')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"exam_reg",cookie:{maxAge:600000}}))
app.use(fileupload())

app.use('/', indexRouter);
app.use('/hod', hodRouter);
app.use('/college', collageRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
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
