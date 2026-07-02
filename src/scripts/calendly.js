// Lazy Calendly popup: assets.calendly.com is only fetched on first click.
// Any element with [data-calendly-url] opens the popup.
function openCalendly(url) {
  if (!window._calLoaded) {
    var l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(l);
    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.onload = function () {
      window.Calendly.initPopupWidget({ url: url });
    };
    document.head.appendChild(s);
    window._calLoaded = true;
  } else {
    window.Calendly.initPopupWidget({ url: url });
  }
}

document.querySelectorAll('[data-calendly-url]').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    openCalendly(el.getAttribute('data-calendly-url'));
  });
});
