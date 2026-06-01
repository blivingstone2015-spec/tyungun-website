/* ===========================================================
   Tyungun Country Retreat — shared chrome + interactions
   =========================================================== */
(function () {
  var PAGE = document.body.getAttribute('data-page') || '';
  var HOME = document.body.getAttribute('data-home') || 'index.html';

  var NAV = [
    { key: 'about',   href: 'about.html',   label: 'The Retreat' },
    { key: 'land',    href: 'land.html',    label: 'The Land' },
    { key: 'sites',   href: 'sites.html',   label: 'The Sites' },
    { key: 'guide',   href: 'guide.html',   label: 'Guest Guide' }
  ];

  function navLinks(forMobile) {
    return NAV.map(function (n) {
      var cur = (n.key === PAGE) ? ' aria-current="page"' : '';
      return '<a href="' + n.href + '"' + cur + '>' + n.label + '</a>';
    }).join('') + (forMobile
      ? '<a href="booking.html">Reserve</a>'
      : '<a class="btn" href="booking.html">Reserve <span class="arr">&rarr;</span></a>');
  }

  /* ---------- Header ---------- */
  var header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<a class="brand" href="' + HOME + '"><b>Tyungun</b><span>Country Retreat</span></a>' +
    '<nav class="nav">' + navLinks(false) + '</nav>' +
    '<button class="nav-toggle" aria-label="Open menu">Menu</button>';
  document.body.insertBefore(header, document.body.firstChild);

  /* ---------- Mobile menu ---------- */
  var mm = document.createElement('div');
  mm.className = 'mobile-menu';
  mm.innerHTML = '<button class="mobile-close" aria-label="Close menu">Close &times;</button>' + navLinks(true);
  document.body.appendChild(mm);

  header.querySelector('.nav-toggle').addEventListener('click', function () { mm.classList.add('open'); });
  mm.querySelector('.mobile-close').addEventListener('click', function () { mm.classList.remove('open'); });
  mm.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { mm.classList.remove('open'); }); });

  /* ---------- Solid header on scroll / non-hero pages ---------- */
  var hasHero = document.body.hasAttribute('data-hero');
  function onScroll() {
    if (!hasHero || window.scrollY > (window.innerHeight * 0.72)) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  }
  if (!hasHero) header.classList.add('is-solid');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Footer ---------- */
  var footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML =
    '<div class="wrap">' +
      '<div class="foot-top">' +
        '<div class="foot-brand">' +
          '<b>Tyungun</b>' +
          '<p>A family-owned cattle farm of 350 acres along Flying Fox Creek &mdash; four private sites, and not another soul in sight.</p>' +
        '</div>' +
        '<div><h4>Wander</h4><div class="foot-links">' +
          '<a href="about.html">The Retreat</a>' +
          '<a href="land.html">The Land</a>' +
          '<a href="sites.html">The Sites</a>' +
          '<a href="guide.html">Guest Guide</a>' +
          '<a href="booking.html">Reserve a Stay</a>' +
        '</div></div>' +
        '<div><h4>Find Us</h4><div class="foot-links">' +
          '<a>Ferny Glen, Queensland</a>' +
          '<a>40 min &middot; Gold Coast</a>' +
          '<a>60 min &middot; Brisbane</a>' +
          '<a>15 min &middot; Canungra</a>' +
          '<a href="https://www.hipcamp.com/en-AU/land/queensland-tyungun-country-retreat-v1qh2vl8" target="_blank" rel="noopener">Hipcamp Listing &rarr;</a>' +
        '</div></div>' +
      '</div>' +
      '<p class="acknowledge">Tyungun Country Retreat acknowledges the Traditional Custodians of this country and their enduring connection to land, water and community. We pay our respects to Elders past and present.</p>' +
      '<div class="foot-bottom">' +
        '<span>&copy; ' + new Date().getFullYear() + ' Tyungun Country Retreat &middot; Hosted by Bryce</span>' +
        '<span>Ferny Glen &middot; QLD &middot; AU</span>' +
      '</div>' +
    '</div>';
  document.body.appendChild(footer);

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* ---------- Lightbox (any [data-lightbox] img) - only if images exist ---------- */
  if (document.querySelectorAll('[data-lightbox]').length > 0) {
    var lb = document.createElement('div');
    lb.style.cssText = 'position:fixed;inset:0;z-index:90;background:rgba(20,15,10,.92);display:none;align-items:center;justify-content:center;cursor:zoom-out;padding:5vw;';
    lb.innerHTML = '<img style="max-width:100%;max-height:100%;object-fit:contain;box-shadow:0 30px 80px rgba(0,0,0,.5);" alt="">';
    lb.addEventListener('click', function () { lb.style.display = 'none'; });
    document.body.appendChild(lb);
    document.querySelectorAll('[data-lightbox]').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        lb.querySelector('img').src = img.getAttribute('data-full') || img.src;
        lb.style.display = 'flex';
      });
    });
  }

  /* ---------- Homepage direction switcher (A / B / C) ---------- */
  if (PAGE === 'home') {
    var file = (location.pathname.split('/').pop() || 'index.html');
    var dirs = [
      { f: 'index.html',   k: 'A', t: 'Editorial' },
      { f: 'index-b.html', k: 'B', t: 'Almanac' },
      { f: 'index-c.html', k: 'C', t: 'Field Study' }
    ];
    var sw = document.createElement('div');
    sw.className = 'dir-switch';
    sw.innerHTML = '<span class="dir-switch__lbl">Direction</span>' +
      dirs.map(function (d) {
        var on = (file === d.f || (file === '' && d.f === 'index.html'));
        return '<a href="' + d.f + '" title="' + d.t + '"' + (on ? ' class="on"' : '') + '>' + d.k + '</a>';
      }).join('');
    document.body.appendChild(sw);
  }
})();
