exports.index = function(req, res) {
  res.render('index', {
    title: 'jww',
    extracss: [
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
  res.render('calendar');
};
