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
    ]
  });
};

exports.calendar = function(req, res) {
  res.render('calendar', {
    title: 'Joel H. W. Weinberger -- Calendar',
    extracss: [
      'css/page/calendar.css'
    ]
  });
};

exports.publications = function(req, res) {
  res.render('publications', {
    title: 'Joel H. W. Weinberger -- Publications',
    extracss: [
      'css/generic/basic-page.css',
      'css/generic/header.css',
      'css/page/index.css'
    ],
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
    ]
  });
};
