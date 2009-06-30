var toggle = (function () {
    function hide(id) {
        var elmt = $(id);
        var details = $(id).select('.paper-details')[0];
        elmt.removeClassName('open');
        elmt.addClassName('closed');
        details.slideUp({duration: 0.3, queue: 'end'});
    }
    
    function show(id) {
        var elmt = $(id);
        var details = $(id).select('.paper-details')[0];
        elmt.removeClassName('closed');
        elmt.addClassName('open');
        details.slideDown({duration: 0.3, queue: 'end'});
    }
    
    return function (id) {
        if ($(id).select('.paper-details')[0].visible())
            hide(id);
        else
            show(id);
    };
})();
