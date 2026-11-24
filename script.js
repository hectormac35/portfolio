/* Portfolio · Héctor Macarrilla */
(function () {
  'use strict';

  const root = document.documentElement;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Año del footer ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Modo oscuro ---------- */
  document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    const dark = root.classList.toggle('dark-mode');
    store.set('theme', dark ? 'dark' : 'light');
  });

  /* ---------- Idioma ES / EN ---------- */
  const langBtn = document.getElementById('lang-toggle');
  const a11y = {
    es: { lang: 'Switch to English', theme: 'Cambiar modo claro u oscuro', menu: 'Abrir menú', top: 'Volver arriba', close: 'Cerrar', prev: 'Anterior', next: 'Siguiente' },
    en: { lang: 'Cambiar a español', theme: 'Toggle light or dark mode', menu: 'Open menu', top: 'Back to top', close: 'Close', prev: 'Previous', next: 'Next' }
  };

  function setLang(lang) {
    root.lang = lang;
    document.querySelectorAll('[data-es]').forEach(el => {
      const html = el.getAttribute('data-' + lang);
      if (html !== null) el.innerHTML = html;
    });
    document.querySelectorAll('[data-ph-es]').forEach(el => {
      el.placeholder = el.getAttribute('data-ph-' + lang);
    });
    const t = a11y[lang];
    langBtn.textContent = lang === 'es' ? 'EN' : 'ES';
    langBtn.setAttribute('aria-label', t.lang);
    document.getElementById('dark-mode-toggle').setAttribute('aria-label', t.theme);
    document.getElementById('hamburger').setAttribute('aria-label', t.menu);
    document.getElementById('toTop').setAttribute('aria-label', t.top);
    document.querySelector('.lb-close').setAttribute('aria-label', t.close);
    document.querySelector('.lb-prev').setAttribute('aria-label', t.prev);
    document.querySelector('.lb-next').setAttribute('aria-label', t.next);
    if (lightbox.open) showSlide();
    store.set('lang', lang);
  }
  langBtn.addEventListener('click', () => setLang(root.lang === 'es' ? 'en' : 'es'));

  /* ---------- Menú móvil ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  function closeMenu() { navLinks.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false'); }
  hamburger.addEventListener('click', e => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', e => { if (!e.target.closest('.navbar')) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- Navbar al hacer scroll + botón arriba ---------- */
  const navbar = document.querySelector('.navbar');
  const toTop = document.getElementById('toTop');
  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Aparición al hacer scroll + sección activa ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));

    const links = [...navLinks.querySelectorAll('a')];
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(s => spy.observe(s));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Visor de capturas ---------- */
  const galleries = {
    onboarding: [
      ['onboarding-panel', 'Panel de RR. HH.: progreso de cada incorporación, documentos por revisar y quién está conectado', 'HR dashboard: progress of each onboarding, documents to review and who is online'],
      ['onboarding-avisos', 'Campana de avisos en tiempo real', 'Real-time notification bell'],
      ['onboarding-comentarios', 'Comentarios por tarea con indicador «escribiendo…»', 'Task comments with a “typing…” indicator'],
      ['onboarding-metricas', 'Métricas: incorporaciones por mes, tareas a tiempo y resultados de la encuesta', 'Metrics: onboardings per month, on-time tasks and survey results'],
      ['onboarding-bienvenida', 'Plan de bienvenida de la persona nueva, por fases', 'The new hire’s welcome plan, by phase'],
      ['onboarding-plantilla', 'Plantillas de tareas: se reordenan arrastrando', 'Task templates: drag and drop to reorder'],
      ['onboarding-subida', 'Subida de documentos con barra de progreso', 'Document upload with progress bar'],
      ['onboarding-panel-en', 'La misma interfaz en inglés (Gettext)', 'The same UI in English (Gettext)'],
      ['onboarding-movil', 'Vista en el móvil', 'Mobile view']
    ],
    nexus: [
      ['nexus-arquitectura', 'Arquitectura: API Gateway, microservicios, RabbitMQ con Outbox, Kubernetes y observabilidad', 'Architecture: API Gateway, microservices, RabbitMQ with Outbox, Kubernetes and observability'],
      ['nexus-jaeger', 'Trazas distribuidas en Jaeger (OpenTelemetry)', 'Distributed traces in Jaeger (OpenTelemetry)'],
      ['nexus-kubernetes', 'Todos los servicios corriendo en Kubernetes', 'All services running on Kubernetes']
    ],
    cloudforge: [
      ['cloudforge-banner', 'CloudForge: API de despliegues con .NET 10, Terraform y Azure', 'CloudForge: deployment API with .NET 10, Terraform and Azure'],
      ['cloudforge-arquitectura', 'Arquitectura: capas de Clean Architecture y recursos de Azure creados con Terraform', 'Architecture: Clean Architecture layers and Azure resources created with Terraform'],
      ['cloudforge-estados', 'Ciclo de vida de un despliegue: las transiciones no válidas devuelven 409', 'Deployment lifecycle: invalid transitions return 409'],
      ['cloudforge-api', 'Salida real de la API: 201 al registrar, 409 con ProblemDetails, start y succeed con duración', 'Real API output: 201 on create, 409 with ProblemDetails, start and succeed with duration'],
      ['cloudforge-pipelines', 'Pipelines: tests, terraform validate, Trivy antes de publicar en GHCR y CodeQL', 'Pipelines: tests, terraform validate, Trivy before publishing to GHCR, and CodeQL']
    ],
    elyndra: [
      ['elyndra-acto1', 'Acto I · El bosque', 'Act I · The forest'],
      ['elyndra-acto2', 'Acto II', 'Act II'],
      ['elyndra-acto3', 'Acto III', 'Act III'],
      ['elyndra-acto4', 'Acto IV', 'Act IV'],
      ['elyndra-acto5', 'Acto V', 'Act V']
    ],
    acortador: [
      ['acortador-estadisticas', 'Estadísticas de un enlace: clics por día, dispositivos, webs de origen y código QR', 'Link analytics: clicks per day, devices, referring sites and QR code'],
      ['acortador-mis-enlaces', 'Panel «Mis enlaces» con resumen, buscador y acciones', '“My links” dashboard with summary, search and actions'],
      ['acortador-enlace-creado', 'Enlace creado con su código QR listo para descargar', 'New link with its QR code ready to download'],
      ['acortador-inicio', 'Página de inicio', 'Home page'],
      ['acortador-editar', 'Editar el destino sin cambiar el enlace corto', 'Edit the target without changing the short link'],
      ['acortador-movil', 'Vista en el móvil', 'Mobile view']
    ],
    seguridad: [
      ['seguridad-grafana-dashboard', 'Grafana durante un incidente: fuerza bruta, 90 s de base de datos caída y la API disponible en todo momento', 'Grafana during an incident: brute force, 90 s of database outage and the API available throughout'],
      ['seguridad-alertmanager', 'Alertmanager agrupa las alertas activas y las envía a Telegram', 'Alertmanager groups the firing alerts and sends them to Telegram'],
      ['seguridad-demo-incidente', 'Ejecución real de la demo: cae la BD, saltan las alertas y el sistema se recupera solo', 'Real demo run: the DB goes down, alerts fire and the system recovers on its own'],
      ['seguridad-prometheus-alertas', 'Alertas activas en Prometheus durante el incidente', 'Firing alerts in Prometheus during the incident'],
      ['seguridad-prometheus-errores-datos', 'Respuestas 200 frente a 503 en /datos durante tres caídas de la base de datos', '200 vs 503 responses on /datos during three database outages'],
      ['seguridad-prometheus-fuerza-bruta', 'Logins fallidos por minuto durante los ataques de fuerza bruta', 'Failed logins per minute during the brute-force attacks']
    ],
    gitops: [
      ['gitops-demo', 'make demo con Docker real: cambio por commit, deriva corregida y rollback con git revert', 'make demo with real Docker: change by commit, drift corrected and rollback with git revert'],
      ['gitops-arquitectura', 'Arquitectura: repo Git, controlador, Docker y API', 'Architecture: Git repo, controller, Docker and API'],
      ['gitops-api-estado', 'Respuesta real de GET /estado con los servicios desplegados', 'Real GET /estado response with the deployed services']
    ],
    ausencias: [
      ['ausencias-panel', 'Panel del responsable: pendientes, quién está fuera hoy y días por departamento', 'Manager dashboard: pending requests, who is out today and days per department'],
      ['ausencias-calendario', 'Calendario del equipo en tiempo real', 'Real-time team calendar'],
      ['ausencias-mis-ausencias', 'Mis ausencias y saldo de vacaciones', 'My time off and holiday balance'],
      ['ausencias-rechazo', 'Rechazar una solicitud exige explicar el motivo', 'Rejecting a request requires a reason'],
      ['ausencias-festivos', 'Festivos nacionales, de Aragón y de Zaragoza', 'National, Aragon and Zaragoza public holidays'],
      ['ausencias-login', 'Inicio de sesión', 'Sign in']
    ]
  };

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  const lbCap = document.getElementById('lb-cap');
  let current = null, idx = 0;

  function showSlide() {
    const list = galleries[current];
    const [file, es, en] = list[idx];
    const cap = root.lang === 'en' ? en : es;
    lbImg.src = 'img/proyectos/' + file + '.webp';
    lbImg.alt = cap;
    lbCap.textContent = cap + '  ·  ' + (idx + 1) + ' / ' + list.length;
  }
  function openGallery(name) {
    current = name; idx = 0; showSlide();
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
    else lightbox.setAttribute('open', '');
  }
  function step(d) { const n = galleries[current].length; idx = (idx + d + n) % n; showSlide(); }

  document.querySelectorAll('[data-gallery]').forEach(b => b.addEventListener('click', () => openGallery(b.dataset.gallery)));
  lightbox.querySelector('.lb-close').addEventListener('click', () => lightbox.close());
  lightbox.querySelector('.lb-prev').addEventListener('click', () => step(-1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  let touchX = null;
  lightbox.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  });

  /* ---------- Filtros de proyectos ---------- */
  const filterBtns = document.querySelectorAll('.filter');
  const projectCards = document.querySelectorAll('#proyectos [data-cat]');
  const miniTitle = document.querySelector('.subsection-title');
  const noResults = document.querySelector('.no-results');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filterBtns.forEach(b => { b.classList.toggle('active', b === btn); b.setAttribute('aria-pressed', String(b === btn)); });
    let visibles = 0, minis = 0;
    projectCards.forEach(card => {
      const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
      card.classList.toggle('is-hidden', !show);
      if (show) { visibles++; card.classList.add('visible'); if (card.classList.contains('mini')) minis++; }
    });
    if (miniTitle) miniTitle.classList.toggle('is-hidden', minis === 0);
    if (noResults) noResults.hidden = visibles > 0;
  }));

  /* ---------- Idioma inicial ---------- */
  const savedLang = store.get('lang');
  const startLang = savedLang || ((navigator.language || 'es').toLowerCase().startsWith('es') ? 'es' : 'en');
  if (startLang !== 'es') setLang(startLang);

  /* ---------- Partículas del hero ---------- */
  const canvas = document.getElementById('particles');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const hero = document.querySelector('.hero');
    let W = 0, H = 0, parts = [], running = true;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.offsetWidth; H = hero.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, W * H / 18000));
      parts = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        for (let j = i + 1; j < parts.length; j++) {
          const q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy;
          if (d2 < 120 * 120) {
            ctx.strokeStyle = 'rgba(255,255,255,' + (0.14 * (1 - Math.sqrt(d2) / 120)) + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    function loop() { if (!running) return; draw(); requestAnimationFrame(loop); }

    resize();
    if (reduce) draw();
    else {
      // Solo anima mientras el hero se ve
      new IntersectionObserver(([e]) => {
        const was = running; running = e.isIntersecting;
        if (running && !was) loop();
      }).observe(hero);
      loop();
    }
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduce) draw(); }, 150); });
  }
})();
