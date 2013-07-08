"use strict";
var hbs = require('hbs')
  , marked = require('marked')
  , pubs = require('./pubs.json')
  , sanitize = require('sanitizer');
var handlebars = hbs.handlebars;

hbs.registerHelper('eachReverse', function(context, options) {
  var ret = "", i, data;

  for (i = context.length - 1; i >= 0; i--) {
    if (options.data) {
      data = handlebars.createFrame(options.data || {});
      data.index = i;
    }

    ret = ret + options.fn(context[i], { data: data});
  }

  return ret;
});

hbs.registerHelper('escapeAttr', function(attr) {
  return new hbs.SafeString(sanitize.escape(attr));
});

hbs.registerHelper('markdown', function(content) {
  return new hbs.SafeString(marked(content, { sanitize: true }));
});

hbs.registerHelper('bibtexauthors', function(authors) {
  var ret = "", i;

  for (i = 0; i < authors.length; i++) {
    ret = ret + authors[i];

    if (i + 1 !== authors.length) {
      ret = ret + ' and ';
    }
  }

  return new hbs.SafeString(ret);
});

hbs.registerHelper('eachAuthor', function(context, options) {
  var ret = "",
    i,
    getBody = function(i) {
      return options.fn(pubs.authors[context[i]]);
    };

  if (context.length === 1) {
    return new hbs.SafeString(getBody(0) + ".");
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
