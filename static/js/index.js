"use strict";
var document;

/*
 * This function creates a toggle "button" (actually an anchor) with the given
 * name and the text specified by "contents".
 *
 * Arguments
 *		name: the name of the publication (acts as a prefix)
 *		
 */
function attachToggle(item_id, pub_id) {
  var toggle_id = pub_id + '-' + item_id,
	  toggle = document.querySelector('#' + toggle_id),
	  pub = document.querySelector('#' + pub_id);

  fetch('ajax/' + toggle.getAttribute('href')).then(function(response) {
    response.text().then(function(data) {
      /*
       * Setup the appropriate classes so that the text does not appear
       * initially (it starts hidden and is revealed by clicking on the
       * toggle).
       */
      var entry_id = toggle_id + '-entry',
          content;
      pub.classList.add('initialized');
      toggle.classList.add('toggle');
      toggle.removeAttribute('href');

	  content = document.querySelector('#' + entry_id);
	  content.innerHTML = data;

      toggle.onclick = function() {
		toggle.classList.toggle('open');
		toggle.classList.toggle('closed');
        $(content).slideToggle();
      };
	});
  });
}

/*
 * On document ready, find all of the bibtex and abstract toggles and attach a
 * click toggle to each.
 */
(function() {
  window.onload = function() {
    var matches = document.querySelectorAll(".paper-bibtex-toggle");
	for (var i = 0; i < matches.length; i++) {
	  attachToggle("bibtex", matches[i].getAttribute("data-pub"));
	}
    matches = document.querySelectorAll(".paper-abstract-toggle");
	for (var i = 0; i < matches.length; i++) {
	  attachToggle("abstract", matches[i].getAttribute("data-pub"));
	}
  };
}());
