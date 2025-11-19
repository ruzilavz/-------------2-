(function () {
      const canvas = document.getElementById('reptile-cursor');
      const ctx = canvas.getContext('2d');

      const SEGMENTS = 60;      // сколько позвонков
      const SEG_LEN = 10;       // расстояние между сегментами
      const FOLLOW_SPEED = 0.25;
      const AUTO_DELAY = 2500;  // через сколько мс включать "автопилот"

      let dpr = window.devicePixelRatio || 1;
      let width = 0;
      let height = 0;

      const segments = [];
      const mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        lastMove: performance.now()
      };

      function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const w = width * dpr;
        const h = height * dpr;
        canvas.width = w;
        canvas.height = h;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      window.addEventListener('resize', resize);
      resize();

      // создаём цепочку сегментов
      for (let i = 0; i < SEGMENTS; i++) {
        segments.push({
          x: mouse.x,
          y: mouse.y
        });
      }

      // слежение за мышкой
      window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.lastMove = performance.now();
      }, { passive: true });

      // слежение за касанием на мобильных устройствах
      window.addEventListener('touchstart', (e) => {
        if (e.touches.length > 0) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
          mouse.lastMove = performance.now();
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
          mouse.x = e.touches[0].clientX;
          mouse.y = e.touches[0].clientY;
          mouse.lastMove = performance.now();
        }
      }, { passive: true });

      function getTarget(time) {
        const now = performance.now();
        const idle = now - mouse.lastMove;

        if (idle < AUTO_DELAY) {
          // активный режим — тянемся к курсору
          return { x: mouse.x, y: mouse.y };
        }

        // автопилот — плавная траектория (лисажу/спираль)
        const t = time * 0.0005;
        const cx = width / 2;
        const cy = height / 2;
        const rx = width * 0.35;
        const ry = height * 0.25;

        const x = cx + Math.cos(t) * rx * 0.8 + Math.sin(t * 3) * 40;
        const y = cy + Math.sin(t * 1.5) * ry * 0.8 + Math.cos(t * 2.2) * 25;

        return { x, y };
      }

      function update(target) {
        // двигаем голову к цели
        const head = segments[0];
        head.x += (target.x - head.x) * FOLLOW_SPEED;
        head.y += (target.y - head.y) * FOLLOW_SPEED;

        // остальные сегменты тянутся за предыдущим
        for (let i = 1; i < segments.length; i++) {
          const prev = segments[i - 1];
          const seg = segments[i];

          const dx = prev.x - seg.x;
          const dy = prev.y - seg.y;
          const dist = Math.hypot(dx, dy) || 0.0001;
          const diff = dist - SEG_LEN;

          seg.x += (dx / dist) * diff;
          seg.y += (dy / dist) * diff;
        }
      }

      function draw() {
        ctx.clearRect(0, 0, width, height);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // тело
        for (let i = segments.length - 1; i > 0; i--) {
          const p = segments[i];
          const prev = segments[i - 1];

          const t = i / segments.length;          // 0...1 от головы к хвосту
          const w = 14 - t * 10;                  // толщина
          const light = 40 + t * 30;              // яркость
          const hue = 110 + t * 40;               // зеленоватый градиент

          ctx.strokeStyle = `hsl(${hue}, 80%, ${light}%)`;
          ctx.lineWidth = w;

          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();

          // "лапки" через несколько сегментов
          if (i % 6 === 0) {
            const angle = Math.atan2(prev.y - p.y, prev.x - p.x);
            const legLen = 14;

            ctx.lineWidth = 2;
            ctx.strokeStyle = `hsl(${hue}, 80%, ${light - 10}%)`;

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + Math.cos(angle + Math.PI / 2) * legLen,
              p.y + Math.sin(angle + Math.PI / 2) * legLen
            );
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(
              p.x + Math.cos(angle - Math.PI / 2) * legLen,
              p.y + Math.sin(angle - Math.PI / 2) * legLen
            );
            ctx.stroke();
          }
        }

        // голова — маленький кружок
        const head = segments[0];
        ctx.fillStyle = '#b5ff8a';
        ctx.beginPath();
        ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // маленькие "глазки"
        ctx.fillStyle = '#02130a';
        ctx.beginPath();
        ctx.arc(head.x + 3, head.y - 2, 1.8, 0, Math.PI * 2);
        ctx.arc(head.x + 3, head.y + 2, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      function loop(time) {
        const target = getTarget(time);
        update(target);
        draw();
        requestAnimationFrame(loop);
      }

      requestAnimationFrame(loop);
    })();