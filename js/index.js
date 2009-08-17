/*
 * This function creates a toggle "button" (actually an anchor) with the given
 * name and the text specified by "contents".
 *
 * Arguments
 *      name: the name of the publication (acts as a prefix)
 *      
 */
function attachToggle(toggle_id, item_id, pub_id, toggle_contents) {
    var pub = $(pub_id);
    var toggle = $(toggle_id);

    // add anchor at runtime in JS so that users without JavaScript don't see
    // the anchor, but it's still there for those who want to use the keyboard
    pub.addClass('initialized');
    toggle.innerHTML = '<a href="javascript:" class="toggle">' + toggle_contents + '</a>';
    toggle.getElementsByTagName('a')[0].onclick = collapsibleOnClick(toggle_id, item_id, pub_id);
}

/*
 * For a given abstract name, generates a function for toggling whether that
 * abstract is collapsed.
 */
function collapsibleOnClick(toggle_id, item_id, pub_id) {
    var paper = $(pub_id);
    var slidefx;

    return function() {
        if (!$defined(slidefx)) {
            slidefx = new Fx.Slide(item_id);
            /*
             * Some collapsible items are hidden if there is no JavaScript
             * (those with the "hidden" class). Others are only hidden to start
             * with (those with the "start-hidden" class). In both cases,
             * because we both (a) have JavaScript, and (b) are on the first
             * click, reveal them by removing the classes.
             */
            $(item_id).removeClass('hidden');
            $(item_id).removeClass('start-hidden');
            slidefx.hide();
        }

        slidefx.toggle();

        if(slidefx.open) {
            paper.removeClass('open');
            paper.addClass('closed');
        } else {
            paper.removeClass('closed');
            paper.addClass('open');
        }
    };
}
