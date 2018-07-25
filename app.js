var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var prestashopRouter = require('./routes/prestashop');
var setupRouter = require('./routes/setup');
var productosRouter = require('./routes/productos');
var ventasRouter = require('./routes/ventas');
var clientesRouter = require('./routes/clientes');
var barcodesRouter = require('./routes/barcodes');
var apartadosRouter = require('./routes/apartados');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts/', express.static(path.join(__dirname, 'public/fonts')));

app.use('/', indexRouter);
app.use('/clientes', indexRouter);
app.use('/users', usersRouter);
app.use('/prestashop', prestashopRouter);
app.use('/setup', setupRouter);
app.use('/barcodes', barcodesRouter);
app.use('/api/productos', productosRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/apartados', apartadosRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
