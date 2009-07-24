var toggleById = function (id) {
    var paper = $(id);
    var abst = $(id + '-abstract');

    if (abst.hasClass('start-hidden')) {
        abst.removeClass('start-hidden');
        abst.slide('hide');
    }

    abst.slide('toggle');

    if (abst.isOpen()) {
        paper.addClass('open');
        paper.removeClass('closed');
    } else {
        paper.addClass('closed');
        paper.removeClass('open');
    }
};

/*
 * This function creates a toggle "button" (actually an anchor) with the given
 * name and the text specified by "contents".
 */
function attachToggle(name, contents) {
    var paper = $(name);
    var elmt = $(name + '-toggle');

    // add anchor at runtime in JS so that users without JavaScript don't see
    // the anchor, but it's still there for those who want to use the keyboard
    paper.addClass('start-hidden');
    elmt.innerHTML = '<a href="javascript:" class="toggle">' + contents + '</a>';
    elmt.getElementsByTagName('a')[0].onclick = collapsibleOnClick(name);
}

/*
 * For a given abstract name, generates a function for toggling whether that
 * abstract is collapsed.
 */
function collapsibleOnClick(name) {
    var paper = $(name);
    var slidefx;

    return function() {
        if (!$defined(slidefx)) {
            slidefx = new Fx.Slide(name + '-abstract');
            paper.removeClass('start-hidden');
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
