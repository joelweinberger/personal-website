"use strict";
var pubs = require('../pubs.json')
  , bibtexs = require('../bibtexs.json');

exports.index = function(req, res) {
  res.render('index', {
    title: 'Joel H. W. Weinberger -- jww',
    extracss: [
      '/css/generic/basic-page.css',
      '/css/generic/header.css',
      '/css/page/index.css'
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
      abstract: pubs[pubType][req.params[0]]
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
      abstract: pubs[pubType][req.params[0]]
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
    papers: pubs.papers,
    techs: pubs.techs
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
    header: 'wedding',
  });
};
