/* ГИРИКОВА О.Н. — отделочные работы */
(function () {
  'use strict';

  var WA = 'https://wa.me/375444834555';
  var PHONE_LABEL = '+375 (44) 483-45-45';

  /* ---------- шапка ---------- */
  var head = document.querySelector('.head');
  function onScroll() {
    if (!head) return;
    var stuck = window.scrollY > 24;
    head.classList.toggle('is-stuck', stuck && !document.body.classList.contains('inner'));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- меню ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var closeBtn = document.getElementById('drawer-close');
  var lastFocus = null;

  function focusables() {
    if (!drawer) return [];
    return Array.prototype.slice.call(
      drawer.querySelectorAll('a[href],button:not([disabled]),input,select,textarea')
    ).filter(function (el) { return el.offsetParent !== null; });
  }
  function openDrawer() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var f = focusables();
    if (f.length) f[0].focus();
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.hidden = true;
    document.body.classList.remove('is-locked');
    if (burger) burger.setAttribute('aria-expanded', 'false');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  if (burger) burger.addEventListener('click', function () {
    if (drawer && drawer.hidden) openDrawer(); else closeDrawer();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (drawer) {
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) closeDrawer();
    });
    drawer.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = focusables();
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        document.body.classList.remove('is-locked');
        if (burger) burger.setAttribute('aria-expanded', 'false');
      });
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && !drawer.hidden) closeDrawer();
  });

  /* ---------- появление блоков ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- проверка плоскости ---------- */
  var plane = document.querySelector('.plane');
  if (plane) {
    var range = plane.querySelector('.plane__range');
    var devEl = plane.querySelector('[data-dev]');
    var wall = plane.querySelector('[data-wall]');
    var rule = plane.querySelector('[data-rule]');
    var gap = plane.querySelector('[data-gap]');
    var verdict = plane.querySelector('.plane__verdict');
    var W = 800, base = 250, span = 250;

    function draw(dev) {
      var amp = dev * 5;                       /* мм -> пиксели схемы */
      var d = 'M0,' + base;
      for (var x = 0; x <= W; x += 8) {
        var y = base - amp * Math.sin(Math.PI * x / W);
        d += ' L' + x + ',' + y.toFixed(1);
      }
      wall.setAttribute('d', d);
      var ruleY = (base - amp - 4).toFixed(1);
      rule.setAttribute('y1', ruleY);
      rule.setAttribute('y2', ruleY);
      gap.setAttribute('d', d + ' L' + W + ',' + ruleY + ' L0,' + ruleY + ' Z');
      if (devEl) devEl.textContent = dev;
      if (verdict) {
        verdict.textContent = dev <= 2
          ? 'Допуск по нашему стандарту: до 2 мм на 2 метра. Такой результат принимаем.'
          : 'Выше допуска 2 мм. Такую стену под покраску не сдаём, переделываем за свой счёт.';
      }
    }
    if (range) {
      range.addEventListener('input', function () { draw(Number(range.value)); });
      draw(Number(range.value));
    }
  }

  /* ---------- заявка в WhatsApp ---------- */
  var form = document.getElementById('lead');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('#f-name') || {}).value || '';
      var phone = (form.querySelector('#f-phone') || {}).value || '';
      var obj = (form.querySelector('#f-obj') || {}).value || '';
      var what = (form.querySelector('#f-what') || {}).value || '';
      var note = (form.querySelector('#f-note') || {}).value || '';
      var err = form.querySelector('.form__err');
      if (name.trim().length < 2 || phone.replace(/\D/g, '').length < 9) {
        if (err) { err.hidden = false; err.textContent = 'Укажите имя и телефон, чтобы мы могли ответить.'; }
        return;
      }
      if (err) err.hidden = true;
      var text =
        'Заявка с сайта\n' +
        'Имя: ' + name.trim() + '\n' +
        'Телефон: ' + phone.trim() + '\n' +
        (obj ? 'Объект: ' + obj + '\n' : '') +
        (what ? 'Работы: ' + what + '\n' : '') +
        (note.trim() ? 'Комментарий: ' + note.trim() + '\n' : '');
      var url = WA + '?text=' + encodeURIComponent(text);
      var ok = form.querySelector('.form__ok');
      var link = ok ? ok.querySelector('a') : null;
      if (link) link.href = url;
      if (ok) ok.hidden = false;
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ---------- текущий раздел в меню ---------- */
  var here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a, .drawer__nav a, .foot__nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href === here || (here === 'index.html' && href === './')) a.classList.add('is-current');
  });
})();
