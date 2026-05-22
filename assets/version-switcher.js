/* Version switcher pill — appears in top-right corner.
   Lets the user quickly hop between the full deck and the video-format deck. */

(function () {
  const isVideo = location.pathname.endsWith('index-video.html');
  const otherFile = isVideo ? 'index.html' : 'index-video.html';
  const currentLabel = isVideo ? 'Видео 1280' : 'Полная 1920';
  const otherLabel   = isVideo ? '→ Полная 1920' : '→ Видео 1280';

  const style = document.createElement('style');
  style.textContent = `
    .version-switcher {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px 10px 14px;
      background: rgba(21, 19, 15, 0.92);
      color: #F4ECE0;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(201, 181, 156, 0.35);
      border-radius: 999px;
      font-family: 'Unbounded', 'Inter', sans-serif;
      font-size: 13px;
      letter-spacing: 0.06em;
      box-shadow: 0 8px 28px rgba(0,0,0,.35);
      user-select: none;
    }
    .version-switcher .cur {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #C9B59C;
      font-weight: 600;
    }
    .version-switcher .cur::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 99px;
      background: #C9B59C;
      box-shadow: 0 0 0 3px rgba(201,181,156,0.18);
    }
    .version-switcher .sep {
      width: 1px;
      height: 18px;
      background: rgba(201,181,156,0.25);
    }
    .version-switcher a {
      color: #F4ECE0;
      text-decoration: none;
      font-weight: 500;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background .15s ease;
    }
    .version-switcher a:hover {
      background: rgba(201,181,156,0.15);
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'version-switcher';
  wrap.innerHTML = `
    <span class="cur">${currentLabel}</span>
    <span class="sep"></span>
    <a href="${otherFile}">${otherLabel}</a>
  `;
  document.body.appendChild(wrap);
})();
