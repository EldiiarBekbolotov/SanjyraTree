function $(selector) {
    if (selector.startsWith('#')) {
        return document.getElementById(selector.substring(1));
    } else {
        return document.querySelectorAll(selector);
    }
}

function scene(index) {
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
    for (var i = 0; i < $('.scene').length; i++) {
        $('.scene')[i].style.display = 'none';
    }
    $('.scene')[index].style.display = 'block';
}

scene(0);