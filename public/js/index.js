/*
 * This function creates a toggle "button" (actually an anchor) with the given
 * name and the text specified by "contents".
 *
 * Arguments
 *		name: the name of the publication (acts as a prefix)
 *		
 */
function attachToggle(item_id, pub_id) {
	var toggle_id = pub_id + '-' + item_id;
	var toggle = $(toggle_id);
	var pub = $(pub_id);
	var page_request = new Request.HTML({
		url: toggle.get('href'),
		method: 'get',
		async: false,
		onSuccess: function(responseTree, responseElements) {
			/*
			 * Setup the appropriate classes so that the text does not appear
			 * initially (it starts hidden and is revealed by clicking on the
			 * toggle).
			 */
			pub.addClass('initialized');
			toggle.addClass('toggle');
			toggle.setProperty('href', 'javascript:');

			var entry_id = toggle_id + '-entry';
			/*
			 * This is relatively convoluted, but here's the idea.
			 * $$(responseTree) returns an array of the top-level elements in
			 * the tree. We make all these top level elements the children of a
			 * single top level <div>. This allows us to do a single
			 * getElementById on the top level <div> instead of doing it on an
			 * array and then searching through the array for non-null elements.
			 */
			var new_entry = (new Element('div')).adopt($$(responseTree)).getElementById(item_id);
			/*
			 * It is necessary to get rid of the id or else the final document
			 * will have a bunch of nodes with the same id. In truth, it would
			 * not even get that far; after injecting the first one, all the
			 * rest would not even be retrieved with a call to getElementById().
			 */
			new_entry.set('id', '');
			$(entry_id).grab(new_entry, 'bottom');
			toggle.addEvent('click', collapsibleOnClick(toggle_id, entry_id));
		}
	});

	page_request.send();
}

/*
 * For a given abstract name, generates a function for toggling whether that
 * abstract is collapsed.
 */
function collapsibleOnClick(toggle_id, item_id) {
	var toggle;
	var item;
	var slidefx;

	return function() {
		if (!$defined(slidefx)) {
			slidefx = new Fx.Slide(item_id);
			toggle = $(toggle_id);
			item = $(item_id);
			/*
			 * Some collapsible items are hidden if there is no JavaScript
			 * (those with the "hidden" class). Others are only hidden to start
			 * with (those with the "start-hidden" class). In both cases,
			 * because we both (a) have JavaScript, and (b) are on the first
			 * click, reveal them by removing the classes.
			 */
			item.removeClass('hidden');
			item.removeClass('start-hidden');
			slidefx.hide();
		}

		slidefx.toggle();

		if(slidefx.open) {
			toggle.removeClass('open');
			toggle.addClass('closed');
		} else {
			toggle.removeClass('closed');
			toggle.addClass('open');
		}
	};
}
