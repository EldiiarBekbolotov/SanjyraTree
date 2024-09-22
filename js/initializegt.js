function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT
    }, 'google_translate_element');
}

function triggerHtmlEvent(element, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
        element.fireEvent('on' + event.eventType, event);
    }
}

jQuery('.lang-select').click(function() {
    var theLang = jQuery(this).attr('data-lang');
    jQuery('.goog-te-combo').val(theLang);
    window.location = jQuery(this).attr('href');
    location.reload();
});
/*document.querySelector('.lang-select').click(function() {
    var theLang = document.querySelector(this).attr('data-lang');
    document.querySelector('.goog-te-combo').val(theLang);
    window.location = document.querySelector(this).attr('href');
    location.reload();
});*/