"use strict";
var $, document;

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
      toggle = $('#' + toggle_id),
      pub = $('#' + pub_id);

  $.get('ajax/' + toggle.attr('href'), function(data) {
    /*
     * Setup the appropriate classes so that the text does not appear
     * initially (it starts hidden and is revealed by clicking on the
     * toggle).
     */
    var entry_id = toggle_id + '-entry',
        content;
    pub.addClass('initialized');
    toggle.addClass('toggle');
    toggle.removeAttr('href');

    content = $('#' + entry_id).html(data);

    toggle.click(function() {
      /*
       * If the content is visible, we are about to make it invisible, so change
       * the toggle to the closed icon. Otherwise, do the opposite.
       */
      if (content.is(':visible')) {
        toggle.removeClass('open');
        toggle.addClass('closed');
      } else {
        toggle.removeClass('closed');
        toggle.addClass('open');
      }

      content.slideToggle();
    });
  });
}

/*
 * On document ready, find all of the bibtex and abstract toggles and attach a
 * click toggle to each.
 */
(function() {
  $(document).ready(function() {
    $(".paper-bibtex-toggle").each(function() {
      attachToggle("bibtex", $(this).attr("data-pub"));
    });
    $(".paper-abstract-toggle").each(function() {
      attachToggle("abstract", $(this).attr("data-pub"));
    });
  });
}());
