"use strict";
var document;

/*
 * This function attaches a toggle handler to abstract and bibtex links.
 * Since the content is now embedded in the page, we just toggle the collapse
 * element directly without needing to fetch from the server.
 *
 * Arguments
 *		item_id: either "abstract" or "bibtex"
 *		pub_id: the ID of the publication (e.g., "pub0" or "tech1")
 */
function attachToggle(item_id, pub_id) {
  var toggle_id = pub_id + '-' + item_id,
      toggle = document.querySelector('#' + toggle_id),
      collapse_id = toggle_id + '-collapse',
      collapse = document.querySelector('#' + collapse_id);

  if (!toggle) {
    console.error('Could not find toggle element:', toggle_id);
    return;
  }

  if (!collapse) {
    console.error('Could not find collapse element:', collapse_id);
    return;
  }

  // Setup the toggle classes
  toggle.classList.add('toggle');

  // Attach click handler
  toggle.onclick = function(e) {
    e.preventDefault();

    // Check if toggle method exists
    if (typeof collapse.toggle === 'function') {
      collapse.toggle();
    } else {
      // Fallback: manually toggle the opened property
      collapse.opened = !collapse.opened;
    }

    toggle.classList.toggle('closed');
    toggle.classList.toggle('open');
  };
}

/*
 * On document ready, find all of the bibtex and abstract toggles and attach a
 * click toggle to each.
 */
(function() {
  function setupToggles() {
    var matches = document.querySelectorAll(".paper-bibtex-toggle");
    for (var i = 0; i < matches.length; i++) {
      attachToggle("bibtex", matches[i].getAttribute("data-pub"));
    }
    matches = document.querySelectorAll(".paper-abstract-toggle");
    for (var i = 0; i < matches.length; i++) {
      attachToggle("abstract", matches[i].getAttribute("data-pub"));
    }
  }

  // Wait for web components to be ready before setting up toggles
  window.addEventListener('WebComponentsReady', function() {
    setupToggles();
  });

  // Fallback for browsers that don't fire WebComponentsReady
  window.addEventListener('load', function() {
    // Give a small delay for components to initialize
    setTimeout(setupToggles, 100);
  });
}());
