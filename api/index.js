var cors = require('cors');
var express = require('express');
var expressJwt = require('express-jwt');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var errorHandler = require('express-error-handler');
var Database = require('aec-mongo');
var routes = require('./routes');

var app = express();
var router = express.Router();

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(methodOverride());
app.use(cookieParser('secret so secret'));
app.use(session({
  secret: 'oh nein you didnt',
  saveUninitialized: true,
  resave: true
}));
app.use(cors());
app.use(router);

if ('production' === app.get('env')) {
  // authenticate these routes
  app.use('/api', expressJwt({
    secret: 'super secret stuff'
  }));

  app.use(errorHandler());
} else {
  app.use(errorHandler({
    dumpExceptions: true,
    showStack: true
  }));

  app.locals.pretty = true;
}

//
// routes

app.get('/', routes.index);
app.get('/api/users', routes.users);


//
// start server

var server = app.listen(process.env.port || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});


exports.db = new Database('mongodb://localhost:27017/db');
