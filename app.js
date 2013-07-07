var express = require('express')
  , hbs = require('hbs')
  , http = require('http')
  , path = require('path')
  , routes = require('./routes');

var app = express();

// Hook in express-hbs and tell it where known directories reside
app.set('view engine', 'hbs');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hbs');
  app.use(express.favicon());
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
app.get('/ajax/abstracts/pub*', routes.ajaxAbstracts);
app.get('/ajax/abstracts/tech*', routes.ajaxAbstracts);
app.get('/ajax/bibtexs/pub*', routes.ajaxBibtexs);
app.get('/ajax/bibtexs/tech*', routes.ajaxBibtexs);
app.get('/abstracts/*', routes.abstracts);
app.get('/bibtexs/*', routes.bibtexs);
app.get('/index', routes.index);
app.get('/calendar', routes.calendar);
app.get('/publications', routes.publications);
app.get('/wedding', routes.wedding);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
