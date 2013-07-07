var pubs = require('../pubs.json')
  , abstracts = require('../abstracts.json')
  , bibtexs = require('../bibtexs.json')
  , hbs = require('hbs')
  , handlebars = hbs.handlebars
  , marked = require('marked')
  , sanitize = require('sanitizer');

exports.index = function(req, res) {
  res.render('index', {
    title: 'Joel H. W. Weinberger -- jww',
    extracss: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css'
    ],
    extrascripts: [
      '/js/index.js',
      '/lib/mootools.js',
      '/lib/mootools-more.js'
    ],
    header: 'jww (at) joelweinberger (dot) us',
    nohomelink: true
  });
};

exports.ajaxAbstracts = function(pubType) {
  return function(req, res) {
    res.render('abstract', {
      layout: false,
      nosectionheading: true,
      abstract: abstracts[pubType][req.params[0]]
    });
  };
};

exports.ajaxBibtexs = function(pubType) {
  return function(req, res) {
    res.render('bibtex', {
      layout: false,
      nosectionheading: true,
      bibtex: bibtexs[pubType][req.params[0]]
    });
  };
};

exports.abstracts = function(pubType) {
  return function(req, res) {
    res.render('abstract', {
      title: 'Joel H. W. Weinberger -- Paper Abstract',
      extracss: [
        '/css/generic/basic-page.css',
        '/css/generic/header.css'
      ],
      header: 'abstract',
      abstract: abstracts[pubType][req.params[0]]
    });
  };
};

exports.bibtexs = function(pubType) {
  return function(req, res) {
    res.render('bibtex', {
      title: 'Joel H. W. Weinberger -- Paper BibTeX',
      extracss: [
        '/css/generic/basic-page.css',
        '/css/generic/header.css'
      ],
      header: 'bibtex',
      bibtex: bibtexs[pubType][req.params[0]]
    });
  };
};

exports.calendar = function(req, res) {
  res.render('calendar', {
    title: 'Joel H. W. Weinberger -- Calendar',
    extracss: [
      '/css/page/calendar.css'
    ],
    nocontent: true,
    nohomelink: true
  });
};

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
  var ret = "";
  var i;

  for (i = 0; i < authors.length; i++) {
    ret = ret + authors[i];

    if (i + 1 !== authors.length) {
      ret = ret + ' and ';
    }
  }

  return new hbs.SafeString(ret);
});

hbs.registerHelper('eachAuthor', function(context, options) {
  var ret = "";
  var i;
  var getBody = function(i) {
    return options.fn(pubs['authors'][context[i]]);
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

exports.publications = function(req, res) {
  res.render('publications', {
    title: 'Joel H. W. Weinberger -- Publications',
    extracss: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css'
    ],
    extrascripts: [
      '/lib/jquery.min.js',
      '/js/index.js'
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
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css'
    ],
    extrascripts: [
      '/js/index.js',
      '/lib/mootools.js',
      'lib/mootools-more.js'
    ],
    header: 'wedding',
  });
};
