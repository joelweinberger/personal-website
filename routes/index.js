var pubs = require('../pubs.json')
  , hbs = require('express-hbs')
  , marked = require('marked')
  , sanitize = require('sanitizer');

exports.index = function(req, res) {
  res.render('index', {
    title: 'Joel H. W. Weinberger -- jww',
    extracss: [
      'css/generic/basic-page.css',
      'css/generic/header.css',
      'css/page/index.css'
    ],
    extrascripts: [
      'js/index.js',
      'lib/mootools.js',
      'lib/mootools-more.js'
    ],
    header: 'jww (at) joelweinberger (dot) us',
    nohomelink: true
  });
};

exports.calendar = function(req, res) {
  res.render('calendar', {
    title: 'Joel H. W. Weinberger -- Calendar',
    extracss: [
      'css/page/calendar.css'
    ],
    nocontent: true,
    nohomelink: true
  });
};

hbs.registerHelper('escapeAttr', function(attr) {
  return new hbs.SafeString(sanitize.escape(attr));
});

hbs.registerHelper('markdown', function(content) {
  return new hbs.SafeString(marked(content, { sanitize: true }));
});

hbs.registerHelper('eachauthor', function(context, options) {
  var ret = "";
  var i;
  var getBody = function(i) {
    return options.fn(pubs['authors'][context[i]]);
  };

  if (context.length === 1) {
    return new hbs.SafeString(getBody(0));
  }

  if (context.length === 2) {
    return new hbs.SafeString(getBody(0) + " and " + getBody(1) + ".");
  }

  for (i = 0; i < context.length; i++) {
    if (i + 1 !== context.length) {
      ret = ret + getBody(i) + ", ";
    } else {
      ret = ret + " and " + getBody(i) + ".";
    }
  }

  return new hbs.SafeString(ret);
});

exports.publications = function(req, res) {
  res.render('publications', {
    title: 'Joel H. W. Weinberger -- Publications',
    extracss: [
      'css/generic/basic-page.css',
      'css/generic/header.css',
      'css/page/index.css'
    ],
    extrascripts: [
      'js/index.js',
      'lib/mootools.js',
      'lib/mootools-more.js'
    ],
    header: 'publications',
    papers: pubs['papers'],
    techs: pubs['techs']
  });
};

exports.wedding = function(req, res) {
  res.render('wedding', {
    title: 'Joel H. W. Weinberger -- Wedding',
    extracss: [
      'css/generic/basic-page.css',
      'css/generic/header.css',
      'css/page/index.css'
    ],
    extrascripts: [
      'js/index.js',
      'lib/mootools.js',
      'lib/mootools-more.js'
    ],
    header: 'wedding',
  });
};
