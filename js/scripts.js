// Scripts for Kardio Health Website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Bootstrap tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });
    
    // Initialize Bootstrap popovers
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl)
    });
});

// Cookie consent banner
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function acceptCookies() {
    setCookie('cookiesAccepted', 'true', 365);
    document.getElementById('cookieConsent').style.display = 'none';
}

window.onload = function() {
    if (!getCookie('cookiesAccepted')) {
        // Create cookie consent banner if it doesn't exist
        if (!document.getElementById('cookieConsent')) {
            var banner = document.createElement('div');
            banner.id = 'cookieConsent';
            banner.className = 'alert alert-info text-center mb-0 fixed-bottom';
            banner.innerHTML = 'Ez a weboldal cookie-kat használ a jobb felhasználói élmény érdekében. ' +
                '<button onclick="acceptCookies()" class="btn btn-sm btn-primary ms-3">Elfogadom</button>';
            document.body.appendChild(banner);
        } else {
            document.getElementById('cookieConsent').style.display = 'block';
        }
    }
};