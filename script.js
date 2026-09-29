/* =========================================================
   KREATURES · v2.0
   Vanilla JS, no build step, no dependencies.
   ========================================================= */
(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('js');

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    /* ---------- footer year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* ---------- mobile menu ---------- */
    var burger = document.getElementById('burger');
    var menu = document.getElementById('menu');

    function setMenu(open) {
        if (!menu || !burger) return;
        menu.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (burger && menu) {
        burger.addEventListener('click', function () {
            setMenu(!menu.classList.contains('is-open'));
        });
        menu.addEventListener('click', function (e) {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') setMenu(false);
        });
        window.addEventListener('resize', function () {
            if (window.innerWidth > 860) setMenu(false);
        });
    }

    /* ---------- scroll progress ---------- */
    var bar = document.getElementById('progressBar');
    var topbar = document.getElementById('topbar');
    var ticking = false;

    function onScroll() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0;
        if (bar) bar.style.width = pct.toFixed(2) + '%';
        if (topbar) {
            topbar.style.background = window.scrollY > 40
                ? 'rgba(0, 32, 47, 0.92)'
                : 'rgba(0, 32, 47, 0.72)';
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /* ---------- reveal on scroll (staggered) ---------- */
    var revealables = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    function stagger() {
        revealables.forEach(function (el) {
            var parent = el.parentElement;
            var siblings = parent ? parent.querySelectorAll(':scope > .reveal') : null;
            var i = siblings ? Array.prototype.indexOf.call(siblings, el) : 0;
            el.style.setProperty('--reveal-delay', Math.min(i, 6) * 90 + 'ms');
        });
    }
    stagger();

    if ('IntersectionObserver' in window && !reduced) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

        revealables.forEach(function (el) { revealObserver.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------- active nav link ---------- */
    var links = Array.prototype.slice.call(document.querySelectorAll('.menu a'));
    var sections = links
        .map(function (a) { return document.querySelector(a.getAttribute('href')); })
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        var navObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (a) {
                    a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
                });
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
        sections.forEach(function (s) { navObserver.observe(s); });
    }


    /* ---------- hero: word highlight cycle + pointer parallax ---------- */
    var megaWord = document.getElementById('megaWord');
    if (megaWord && !reduced) {
        setInterval(function () {
            megaWord.classList.toggle('is-lit');
        }, 2600);
    }

    var hero = document.querySelector('.slide-hero');
    var mega = document.querySelector('.mega');
    if (hero && mega && canHover && !reduced) {
        hero.addEventListener('pointermove', function (e) {
            var r = hero.getBoundingClientRect();
            var dx = (e.clientX - r.left) / r.width - 0.5;
            var dy = (e.clientY - r.top) / r.height - 0.5;
            mega.style.transform = 'translate3d(' + (dx * -18).toFixed(2) + 'px,' + (dy * -10).toFixed(2) + 'px,0)';
        });
        hero.addEventListener('pointerleave', function () {
            mega.style.transform = 'translate3d(0,0,0)';
        });
    }

    /* ---------- creature cards: subtle tilt ---------- */
    if (canHover && !reduced) {
        document.querySelectorAll('[data-tilt], .beast, .card').forEach(function (el) {
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                var dx = (e.clientX - r.left) / r.width - 0.5;
                var dy = (e.clientY - r.top) / r.height - 0.5;
                el.style.setProperty('transform',
                    'perspective(900px) rotateX(' + (dy * -4).toFixed(2) + 'deg) rotateY(' +
                    (dx * 5).toFixed(2) + 'deg) translateY(-6px)');
            });
            el.addEventListener('pointerleave', function () {
                el.style.removeProperty('transform');
            });
        });
    }

    /* ---------- contact form → mailto ---------- */
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    var MAILTO = 'hello@kreatures.studio';

    function markTouched(el) {
        el.classList.add('touched');
    }

    if (form && status) {
        Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (field) {
            field.addEventListener('blur', function () { markTouched(field); });
            field.addEventListener('input', function () {
                if (field.classList.contains('touched') && field.checkValidity()) {
                    field.classList.remove('touched');
                }
            });
        });

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var fields = Array.prototype.slice.call(form.querySelectorAll('input, select, textarea'));
            var firstInvalid = null;

            fields.forEach(function (field) {
                if (!field.checkValidity()) {
                    markTouched(field);
                    if (!firstInvalid) firstInvalid = field;
                }
            });

            if (firstInvalid) {
                status.classList.remove('is-ok');
                status.textContent = 'Please fill in every field with a valid value.';
                firstInvalid.focus();
                return;
            }

            var data = new FormData(form);
            var name = String(data.get('name') || '').trim();
            var email = String(data.get('email') || '').trim();
            var need = String(data.get('need') || '');
            var message = String(data.get('message') || '').trim();

            var subject = 'New project enquiry — ' + (need || 'Kreatures');
            var body = message +
                '\n\n—\n' + name +
                '\n' + email +
                '\nDomain: ' + need +
                '\n\nSent from kreatures-studio.github.io';

            status.classList.add('is-ok');
            status.textContent = 'Opening your email app with the message ready…';
            window.location.href = 'mailto:' + MAILTO +
                '?subject=' + encodeURIComponent(subject) +
                '&body=' + encodeURIComponent(body);

            setTimeout(function () {
                status.textContent = 'Email app launched. If nothing opened, write to ' + MAILTO + '.';
            }, 1200);
        });
    }
})();

