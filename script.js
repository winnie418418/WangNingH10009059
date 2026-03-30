// 优雅音符飘落动画 - 全站通用
function initMusicNotes() {
  const style = document.createElement('style');
  style.innerHTML = `
    .music-note {
      position: fixed;
      top: -50px;
      z-index: 99;
      user-select: none;
      pointer-events: none;
      color: #ffc107;
      opacity: 0.6;
      font-size: 18px;
    }
    @keyframes noteFall {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.7;
      }
      100% {
        transform: translateY(110vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  function createNote() {
    const notes = ['♪', '♩', '♫', '♬'];
    const el = document.createElement('div');
    el.className = 'music-note';
    el.textContent = notes[Math.floor(Math.random() * notes.length)];

    const size = Math.random() * 14 + 14;
    el.style.fontSize = `${size}px`;
    el.style.left = Math.random() * window.innerWidth + 'px';
    el.style.animation = `noteFall ${Math.random() * 4 + 5}s linear infinite`;

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 8000);
  }

  setInterval(createNote, 1500);
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', initMusicNotes);
// 🩰 芭蕾 emoji 鼠标跟随
function initBalletEmojiFollower() {
  const style = document.createElement("style");
  style.textContent = `
    #ballet-emoji {
      position: fixed;
      font-size: 26px;
      z-index: 999;
      pointer-events: none;
      user-select: none;
      transition: transform 0.12s ease-out;
      will-change: transform;
    }
  `;
  document.head.appendChild(style);

  const ballet = document.createElement("div");
  ballet.id = "ballet-emoji";
  ballet.textContent = "🩰";
  document.body.appendChild(ballet);

  document.addEventListener("mousemove", (e) => {
    requestAnimationFrame(() => {
      ballet.style.left = e.clientX - 13 + "px";
      ballet.style.top = e.clientY - 20 + "px";
    });
  });
}

window.addEventListener("DOMContentLoaded", initBalletEmojiFollower);
// 追光灯跟随鼠标
function initSpotlight() {
  const light = document.createElement('div');
  light.id = 'spotlight';
  document.body.appendChild(light);

  document.addEventListener('mousemove', e => {
    requestAnimationFrame(() => {
      light.style.left = e.clientX - 175 + 'px';
      light.style.top = e.clientY - 175 + 'px';
    });
  });
}
window.addEventListener('DOMContentLoaded', initSpotlight);
// 滚动触发动画
function initScrollFade() {
  const els = document.querySelectorAll('.content-card p, .content-card h2, .content-card img');
  els.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => e.target.classList.toggle('visible', e.isIntersecting));
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}
window.addEventListener('DOMContentLoaded', initScrollFade);

// 全局背景音乐（切换页面记忆进度）
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('musicFloatBtn')) return;

  const bgMusic = new Audio();
  bgMusic.src = '音樂.mp3';
  bgMusic.loop = true;

  const btn = document.createElement('button');
  btn.id = 'musicFloatBtn';
  btn.textContent = '🎵';
  document.body.appendChild(btn);

  const panel = document.createElement('div');
  panel.className = 'music-panel';
  panel.innerHTML = `
    <h5>Cool with you</h5>
    <p class="lang-tc">推薦伴隨音樂一起瀏覽喔！</p >
    <p class="lang-en" style="display:none;">Enjoy browsing with the music~</p >
  `;
  document.body.appendChild(panel);

  // 语言同步
  function syncMusicPanelLang() {
    const isEn = localStorage.getItem('lang') === 'en';
    panel.querySelectorAll('.lang-tc').forEach(el => {
      el.style.display = isEn ? 'none' : 'block';
    });
    panel.querySelectorAll('.lang-en').forEach(el => {
      el.style.display = isEn ? 'block' : 'none';
    });
  }
  syncMusicPanelLang();
  document.getElementById('langToggle')?.addEventListener('click', () => {
    setTimeout(syncMusicPanelLang, 0);
  });

  // 播放状态记忆
  let isPlaying = localStorage.getItem('musicPlaying') === 'true';
  let lastTime = parseFloat(localStorage.getItem('musicCurrentTime') || 0);

  if (isPlaying) {
    bgMusic.currentTime = lastTime;
    bgMusic.play().catch(()=>{});
    btn.textContent = '▶️';
    btn.classList.add('playing');
  }

  btn.addEventListener('click', function() {
    if (!isPlaying) {
      bgMusic.play();
      btn.textContent = '▶️';
      btn.classList.add('playing');
      isPlaying = true;
    } else {
      bgMusic.pause();
      btn.textContent = '🎵';
      btn.classList.remove('playing');
      isPlaying = false;
    }

    panel.classList.toggle('show');
    const rect = btn.getBoundingClientRect();
    panel.style.left = rect.left - 270 + 'px';
    panel.style.top = rect.top + 'px';

    localStorage.setItem('musicPlaying', isPlaying);
  });

  window.addEventListener('beforeunload', function() {
    localStorage.setItem('musicCurrentTime', bgMusic.currentTime);
  });

  // 可拖动
  let isDragging = false;
  let ox, oy;

  btn.addEventListener('mousedown', function(e) {
    isDragging = true;
    ox = e.clientX - btn.getBoundingClientRect().left;
    oy = e.clientY - btn.getBoundingClientRect().top;
    btn.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    btn.style.left = e.clientX - ox + 'px';
    btn.style.top = e.clientY - oy + 'px';
    btn.style.right = 'auto';
    btn.style.bottom = 'auto';
    panel.classList.remove('show');
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
    btn.style.cursor = 'grab';
  });
});