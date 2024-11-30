function $(selector) {
    if (selector.startsWith('#')) {
        return document.getElementById(selector.substring(1));
    } else {
        return document.querySelectorAll(selector);
    }
}
function checkClassSupport() {
    const testElement = document.createElement('div');
    testElement.classList.add('test-class');
    const hasClassList = testElement.classList.contains('test-class');
    testElement.classList.remove('test-class');

    return hasClassList;
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

    for (var i = 0; i < $('.nav-link').length; i++) {

        if (checkClassSupport()) {

            document.getElementsByClassName('nav-link')[i].classList.remove('active');
        } else {
            $('.nav-link')[i].style.borderBottom = '0px solid white';
        }

    }
    if (checkClassSupport()) { 
        document.getElementsByClassName('nav-link')[index].classList.add('active'); 
    } else {
        $('.nav-link')[index].style.color = 'white';
        $('.nav-link')[index].style.borderBottom = '2px solid white';
    }

    if (window.innerWidth < 992) { // Check if viewport width is <992px (Bootstrap's md breakpoint)
        let navbar = document.getElementById('navbarSupportedContent');
        let bsCollapse = new bootstrap.Collapse(navbar);
        bsCollapse.hide();
    }
}

scene(0);
