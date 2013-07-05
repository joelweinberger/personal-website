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
    title: 'Joel\'s Public Calendar',
    extracss: [
      'css/page/calendar.css'
    ]
  });
};
