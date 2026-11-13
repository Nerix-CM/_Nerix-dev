(() => {
  const C = window.SITE_CONFIG, root = document.documentElement;
  const $ = s => document.querySelector(s);

  /* ---- 3D-голова: основной слой + второй слой, по 6 граней ---- */
  // [x, y, поворот] — область 8×8 в скине. Второй слой смещён на +32 по X и чуть крупнее (×1.125).
  const FACES = [
    [8, 8, ''],                  // перед
    [24, 8, 'rotateY(180deg)'],  // зад
    [0, 8, 'rotateY(-90deg)'],   // правая сторона персонажа
    [16, 8, 'rotateY(90deg)'],   // левая сторона персонажа
    [8, 0, 'rotateX(90deg)'],    // верх
    [16, 0, 'rotateX(-90deg)']   // низ (в скине перевёрнут, поэтому scaleY(-1))
  ];
  const cube = $('#cube');
  [[0, 1], [32, 1.125]].forEach(([dx, grow]) => {
    const layer = document.createElement('div');
    layer.className = 'layer';
    layer.style.cssText = `--dx:${dx};--ls:calc(var(--s) * ${grow})`;
    FACES.forEach(([x, y, rot], i) => {
      const f = document.createElement('div');
      f.className = 'face';
      f.style.cssText = `--x:${x};--y:${y};transform:${rot} translateZ(calc(var(--ls) / 2))${i === 5 ? ' scaleY(-1)' : ''}`;
      layer.append(f);
    });
    cube.append(layer);
  });

  /* ---- загрузка скина: первый источник, который отдал нормальную картинку ---- */
  const probe = url => new Promise(ok => {
    const img = new Image();
    const done = v => { clearTimeout(timer); ok(v); };
    const timer = setTimeout(() => done(null), 5000);
    img.onload = () => done(img.naturalWidth >= 64 && (img.naturalHeight === img.naturalWidth || img.naturalHeight * 2 === img.naturalWidth) ? url : null);
    img.onerror = () => done(null);
    img.src = url;
  });
  (async () => {
    for (const src of C.skinSources) {
      const url = new URL(src.replace('{name}', encodeURIComponent(C.minecraftName)), location.href).href;
      if (await probe(url)) {
        root.style.setProperty('--skin', `url("${url}")`);
        root.classList.add('skin-ready');
        return;
      }
    }
    console.warn('[skin] не удалось загрузить скин: проверь skinSources в js/config.js или положи assets/skin.png');
  })();

  /* ---- клик по голове/нику в панели = перезагрузка ---- */
  $('#brand').addEventListener('click', e => { e.preventDefault(); location.reload(); });

  /* ---- прыжок 2D-головы при наведении (один раз за наведение) ---- */
  const logo = $('.logo-head');
  $('#brand').addEventListener('mouseenter', () => logo.classList.add('hop'));
  logo.addEventListener('animationend', () => logo.classList.remove('hop'));

  /* ---- голова смотрит за курсором + лёгкое покачивание ---- */
  const base = { x: -14, y: -24 };           // поза, пока курсора нет (градусы)
  const head = $('#head3d');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cube.style.transform = `rotateX(${base.x}deg) rotateY(${base.y}deg)`;
    return;
  }
  const DEPTH = 650, DEG = Math.PI / 180;   // DEPTH — «расстояние» до курсора в px: больше = спокойнее повороты
  let tx = base.x, ty = base.y, cx = tx, cy = ty, last = performance.now();
  addEventListener('pointermove', e => {
    const r = head.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    // голова поворачивается лицом к курсору; курсор в центре головы = смотрит прямо
    ty = clamp(Math.atan2(dx, DEPTH) / DEG, -60, 60);
    tx = clamp(Math.atan2(-dy, DEPTH) / DEG, -40, 40);
  });
  root.addEventListener('mouseleave', () => { tx = base.x; ty = base.y; });
  requestAnimationFrame(function frame(t) {
    const k = 1 - Math.exp(-(t - last) / 1000 * 7);
    last = t;
    cx += (tx - cx) * k;
    cy += (ty - cy) * k;
    cube.style.transform = `rotateX(${cx + Math.cos(t / 1900) * 2}deg) rotateY(${cy + Math.sin(t / 1400) * 4}deg)`;
    requestAnimationFrame(frame);
  });
})();
