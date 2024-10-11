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

    if (window.innerWidth < 992) { // Check if viewport width is <992px (Bootstrap's md breakpoint)
        let navbar = document.getElementById('navbarSupportedContent');
        let bsCollapse = new bootstrap.Collapse(navbar);
        bsCollapse.hide(); 
    }
}

scene(0);