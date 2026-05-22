/* tweaks-app.jsx — палитра / анимации / акцент */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "beige",
  "accent": "#C9B59C",
  "animations": true,
  "showProgress": true,
  "videoMode": false
}/*EDITMODE-END*/;

const PALETTES = {
  beige: {
    "--bg": "#F9F8F6",
    "--bg-2": "#EFE9E3",
    "--accent-1": "#D9CFC7",
    "--accent-2": "#C9B59C",
    "--accent-3": "#8C7558",
    "--ink": "#1F2937",
    "--ink-2": "#6B7280",
    "--ink-3": "#9CA3AF",
    "--line": "#E5DED6",
    "--black": "#15130F"
  },
  graphite: {
    "--bg": "#F4F4F2",
    "--bg-2": "#E8E7E2",
    "--accent-1": "#D4D2CB",
    "--accent-2": "#9C9C8F",
    "--accent-3": "#4A4A40",
    "--ink": "#13120E",
    "--ink-2": "#5C5B53",
    "--ink-3": "#8C8B82",
    "--line": "#DEDDD5",
    "--black": "#0E0D0A"
  },
  warm: {
    "--bg": "#FFF8F0",
    "--bg-2": "#FBEEDB",
    "--accent-1": "#F0D6A8",
    "--accent-2": "#D9A45B",
    "--accent-3": "#8A5520",
    "--ink": "#1B130A",
    "--ink-2": "#6B5538",
    "--ink-3": "#9C8765",
    "--line": "#EBDDC5",
    "--black": "#1B130A"
  },
  noir: {
    "--bg": "#15130F",
    "--bg-2": "#1F1D18",
    "--accent-1": "#3A352D",
    "--accent-2": "#C9B59C",
    "--accent-3": "#D9CFC7",
    "--ink": "#F4ECE0",
    "--ink-2": "#A9A294",
    "--ink-3": "#6B665C",
    "--line": "#2A2620",
    "--black": "#F4ECE0"
  }
};

const ACCENT_OPTIONS = ['#C9B59C', '#8C7558', '#D9A45B', '#7A8C5E', '#6B7280'];

function applyPalette(name, accent) {
  const root = document.documentElement;
  const p = PALETTES[name] || PALETTES.beige;
  Object.entries(p).forEach(([k, v]) => root.style.setProperty(k, v));
  if (accent) root.style.setProperty('--accent-2', accent);

  // noir flips the whole light/dark relationship — adjust slide default bg
  if (name === 'noir') {
    document.body.classList.add('palette-noir');
  } else {
    document.body.classList.remove('palette-noir');
  }
}

function applyAnimations(on) {
  document.body.classList.toggle('no-anim', !on);
}

function applyProgress(on) {
  // we don't have a global progress bar — controlled by per-slide page-num/progress; here we just toggle visibility of page numbers
  document.body.classList.toggle('hide-page-num', !on);
}

function applyVideoMode(on) {
  document.body.classList.toggle('video-mode', !!on);
}

function FormulaTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => { applyPalette(t.palette, t.accent); }, [t.palette, t.accent]);
  React.useEffect(() => { applyAnimations(t.animations); }, [t.animations]);
  React.useEffect(() => { applyProgress(t.showProgress); }, [t.showProgress]);
  React.useEffect(() => { applyVideoMode(t.videoMode); }, [t.videoMode]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Палитра" />
      <TweakRadio
        label="Тема"
        value={t.palette}
        options={[
          { value: 'beige',    label: 'Бежевый' },
          { value: 'graphite', label: 'Графит' },
          { value: 'warm',     label: 'Тёплый' },
          { value: 'noir',     label: 'Тёмный' },
        ]}
        onChange={(v) => setTweak('palette', v)}
      />
      <TweakColor
        label="Акцент"
        value={t.accent}
        options={ACCENT_OPTIONS}
        onChange={(v) => setTweak('accent', v)}
      />

      <TweakSection label="Поведение" />
      <TweakToggle
        label="Анимации"
        value={t.animations}
        onChange={(v) => setTweak('animations', v)}
      />
      <TweakToggle
        label="Номера слайдов"
        value={t.showProgress}
        onChange={(v) => setTweak('showProgress', v)}
      />

      <TweakSection label="Видео" />
      <TweakToggle
        label="Превью с камерой слева"
        value={t.videoMode}
        onChange={(v) => setTweak('videoMode', v)}
      />
    </TweaksPanel>
  );
}

// CSS for noir-mode auto-flip of section default bg
const noirStyle = document.createElement('style');
noirStyle.textContent = `
  body.palette-noir deck-stage > section:not([class*="bg-"]) {
    background: var(--bg);
    color: var(--ink);
  }
  body.palette-noir deck-stage > section:not([class*="bg-"]) h1,
  body.palette-noir deck-stage > section:not([class*="bg-"]) h2,
  body.palette-noir deck-stage > section:not([class*="bg-"]) h3 {
    color: var(--ink);
  }
  body.palette-noir deck-stage > section.bg-cream {
    background: var(--bg-2);
  }
  body.palette-noir deck-stage > section.bg-cream .muted { color: var(--ink-2); }
  body.palette-noir .card,
  body.palette-noir .card-flat {
    background: var(--bg-2);
    color: var(--ink);
    border-color: var(--line);
  }
  body.hide-page-num .page-num,
  body.hide-page-num .page-head { display: none; }

  /* Floating "Video mode" toggle button */
  .video-mode-toggle {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 2147483647;
    appearance: none;
    border: none;
    padding: 12px 20px;
    background: #15130F;
    color: #F4ECE0;
    font-family: 'Unbounded', sans-serif;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,.25);
    display: flex;
    align-items: center;
    gap: 10px;
    user-select: none;
  }
  .video-mode-toggle:hover {
    background: #2A2620;
  }
  .video-mode-toggle .dot {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: #6B665C;
  }
  body.video-mode .video-mode-toggle {
    background: #C9B59C;
    color: #15130F;
  }
  body.video-mode .video-mode-toggle .dot {
    background: #DC2626;
    box-shadow: 0 0 0 4px rgba(220,38,38,0.2);
  }

  /* Video mode: scale deck-stage to fit right 2/3, camera placeholder on left 1/3 */
  body.video-mode {
    background: #0a0a0a;
    overflow: hidden;
  }
  body.video-mode deck-stage {
    position: fixed !important;
    left: 33.333vw !important;
    top: 0 !important;
    width: 66.667vw !important;
    height: 100vh !important;
  }
  body.video-mode::before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    width: 33.333vw;
    height: 100vh;
    background: repeating-linear-gradient(45deg, #1a1a1a 0 24px, #131313 24px 48px);
    z-index: 2147483645;
    pointer-events: none;
    box-shadow: inset -2px 0 0 rgba(201,181,156,0.3);
  }
  body.video-mode::after {
    content: 'КАМЕРА · 1/3';
    position: fixed;
    left: 0;
    top: 0;
    width: 33.333vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Unbounded', sans-serif;
    font-weight: 700;
    font-size: 28px;
    letter-spacing: 0.3em;
    color: rgba(255,255,255,0.35);
    z-index: 2147483646;
    pointer-events: none;
  }`;
document.head.appendChild(noirStyle);

// Mount once React + tweaks-panel are ready
(function mount() {
  if (typeof TweaksPanel === 'undefined' || typeof useTweaks === 'undefined') {
    return setTimeout(mount, 30);
  }
  const root = document.createElement('div');
  root.id = 'tweaks-root';
  document.body.appendChild(root);
  ReactDOM.createRoot(root).render(<FormulaTweaks />);
})();
