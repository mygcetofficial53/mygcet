/* ============================================================
   MyGCET — Planner theme interactions
   ============================================================ */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    /* ---------- Intro splash ---------- */
    (function intro() {
        const el = document.getElementById('intro');
        if (!el) return;
        const unlock = () => document.body.classList.remove('intro-lock');
        const dismiss = () => {
            el.classList.add('done');
            unlock();
            window.removeEventListener('keydown', onKey);
            setTimeout(() => { el.style.display = 'none'; }, 650);
        };
        const onKey = (e) => { if (['Escape', 'Enter', ' '].includes(e.key)) dismiss(); };
        if (reduceMotion) { el.style.display = 'none'; unlock(); return; }
        const skip = document.getElementById('introSkip');
        if (skip) skip.addEventListener('click', dismiss);
        el.addEventListener('click', (e) => { if (e.target === el) dismiss(); });
        window.addEventListener('keydown', onKey);
        setTimeout(dismiss, 3000);
    })();

    /* ---------- Nav condense + back-to-top ---------- */
    const nav = $('#nav');
    const toTop = $('#toTop');
    const onScroll = () => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 20);
        if (toTop) toTop.classList.toggle('show', y > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener('click', () =>
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));

    /* ---------- Reveal on scroll ---------- */
    const reveals = $$('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('in'));
    }

    /* ---------- Animated counters ---------- */
    const counters = $$('.count');
    const runCounter = (el) => {
        const target = parseFloat(el.dataset.target);
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const dur = 1300;
        const start = performance.now();
        const step = (now) => {
            const p = Math.min((now - start) / dur, 1);
            const val = Math.round(target * (1 - Math.pow(1 - p, 3)));
            el.textContent = prefix + val + suffix;
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window && !reduceMotion) {
        const cio = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
            });
        }, { threshold: 0.6 });
        counters.forEach((el) => cio.observe(el));
    } else {
        counters.forEach((el) => {
            el.textContent = (el.dataset.prefix || '') + el.dataset.target + (el.dataset.suffix || '');
        });
    }

    /* ---------- Drag-to-scroll gallery ---------- */
    const gallery = $('#gallery');
    if (gallery) {
        let down = false, startX = 0, startScroll = 0, moved = false;
        gallery.addEventListener('pointerdown', (e) => {
            down = true; moved = false;
            startX = e.clientX; startScroll = gallery.scrollLeft;
            gallery.classList.add('dragging');
        });
        gallery.addEventListener('pointermove', (e) => {
            if (!down) return;
            const dx = e.clientX - startX;
            if (Math.abs(dx) > 4) moved = true;
            gallery.scrollLeft = startScroll - dx;
        });
        const end = () => { down = false; gallery.classList.remove('dragging'); };
        gallery.addEventListener('pointerup', end);
        gallery.addEventListener('pointerleave', end);
        gallery.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
        gallery.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) { gallery.scrollLeft += e.deltaY; e.preventDefault(); }
        }, { passive: false });
    }

    /* ---------- Smooth anchor offset for fixed nav ---------- */
    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length < 2) return;
            const el = document.querySelector(id);
            if (!el) return;
            e.preventDefault();
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
    });
})();
