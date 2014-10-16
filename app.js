"use strict";
var express = require('express')
  , fs = require('fs')
  , hbs = require('hbs')
  , hbs_ext = require('./hbs-ext')
  , http = require('http')
  , https = require('https')
  , path = require('path')
  , routes = require('./routes');

// Redirect HTTP to HTTPS
function requireHTTPS(req, res, next) {
  // HTTP case
  if (!req.secure) {
    return res.redirect('https://' + req.host + ':' + app.get('https_port') + req.url + "\n");
  }

  // HTTPS case
  next();
}

// For the calendar, we frame-src google.com
var csp = "default-src 'self'; frame-src *.google.com";
function contentSecurityPolicy(req, res, next) {
  res.setHeader("Content-Security-Policy", csp);
  return next();
}

function strictTransportSecurity(req, res, next) {
  res.setHeader("Strict-Transport-Security", "max-age=7776000");
  next();
}

var app = express();
app.disable('x-powered-by');

// Hook in express-hbs and tell it where known directories reside
app.set('view engine', 'hbs');

app.configure(function(){
  app.set('https_port', process.env.HTTPS_PORT || 3000);
  app.set('http_port', process.env.HTTP_PORT || 3001);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(requireHTTPS);
  app.use(contentSecurityPolicy);
  app.use(strictTransportSecurity);
  app.use(express.favicon('public/img/lock.ico'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/ajax/abstracts/pub*', routes.ajaxAbstracts('papers'));
app.get('/ajax/abstracts/tech*', routes.ajaxAbstracts('techs'));
app.get('/ajax/bibtexs/pub*', routes.ajaxBibtexs('papers'));
app.get('/ajax/bibtexs/tech*', routes.ajaxBibtexs('techs'));
// Order matters for these. We need the .html matches first so that it will
// remove the html in once matched.
app.get('/abstracts/pub*.html', routes.abstracts('papers'));
app.get('/abstracts/pub*', routes.abstracts('papers'));
app.get('/abstracts/tech*.html', routes.abstracts('techs'));
app.get('/abstracts/tech*', routes.abstracts('techs'));

app.get('/bibtexs/pub*.html', routes.bibtexs('papers'));
app.get('/bibtexs/pub*', routes.bibtexs('papers'));
app.get('/bibtexs/tech*.html', routes.bibtexs('techs'));
app.get('/bibtexs/tech*', routes.bibtexs('techs'));

app.get('/index', routes.index);
app.get('/calendar', routes.calendar);
app.get('/publications', routes.publications);
app.get('/wedding', routes.wedding);
app.get('/blog', routes.blog);
app.get('/blog/*', routes.blog);

var options = {
  ca: fs.readFileSync('./cert/sub.class1.server.ca.pem'),
  key: fs.readFileSync('./cert/ssl.key'),
  cert: fs.readFileSync('./cert/ssl.crt')
};

// The main application is exclusively served over HTTPS.
https.createServer(options, app).listen(app.get('https_port'));
console.log("Express server listening to HTTPS on port " + app.get('https_port'));

// The HTTP server only exists to redirect to the HTTPS server.
http.createServer(app).listen(app.get('http_port'));
console.log("Express server listening to HTTP on port " + app.get('http_port'));
