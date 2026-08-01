// ============================================================
// PETALS — ambient floating background
// ============================================================
(function petals(){
  const wrap = document.getElementById('petals');
  const glyphs = ['❀','✿','❁','♡'];
  const COUNT = window.innerWidth < 600 ? 14 : 24;
  for(let i=0;i<COUNT;i++){
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = glyphs[Math.floor(Math.random()*glyphs.length)];
    p.style.left = Math.random()*100 + 'vw';
    p.style.fontSize = (10 + Math.random()*14) + 'px';
    p.style.setProperty('--drift', (Math.random()*120-60) + 'px');
    const duration = 10 + Math.random()*14;
    p.style.animationDuration = duration + 's';
    p.style.animationDelay = (-Math.random()*duration) + 's';
    p.style.opacity = (0.25 + Math.random()*0.5).toFixed(2);
    wrap.appendChild(p);
  }
})();

// ============================================================
// BACKGROUND MUSIC
// ============================================================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicStarted = false;

function playMusic(){
  bgMusic.volume = 0.55;
  bgMusic.play().then(()=>{
    musicToggle.classList.add('playing');
    musicStarted = true;
  }).catch(()=>{ /* autoplay blocked, wait for explicit click */ });
}
function toggleMusic(){
  if(bgMusic.paused){
    playMusic();
  } else {
    bgMusic.pause();
    musicToggle.classList.remove('playing');
  }
}
musicToggle.addEventListener('click', toggleMusic);

// ============================================================
// GATE / ENVELOPE INTRO
// ============================================================
const gate = document.getElementById('gate');
const envelope = document.getElementById('envelope');
const body = document.body;
body.style.overflow = 'hidden';

envelope.addEventListener('click', () => {
  if(envelope.classList.contains('open')) return;
  envelope.classList.add('open');
  playMusic(); // first real user gesture — safe to start audio
  setTimeout(() => {
    gate.classList.add('hidden');
    body.style.overflow = '';
  }, 750);
});

// ============================================================
// GIR VIDEO — pause bg music while her video plays with sound
// ============================================================
const girVideo = document.getElementById('girVideo');
girVideo.addEventListener('play', () => {
  if(!bgMusic.paused){ bgMusic.pause(); musicToggle.classList.remove('playing'); }
});

// ============================================================
// LETTER ENVELOPE
// ============================================================
const letterEnvelope = document.getElementById('letterEnvelope');
const letterPaper = document.getElementById('letterPaper');
letterEnvelope.addEventListener('click', () => {
  letterEnvelope.classList.add('opened');
  letterPaper.classList.add('visible');
  setTimeout(()=> letterPaper.scrollIntoView({behavior:'smooth', block:'center'}), 300);
});

// ============================================================
// VOICE NOTE PLAYER
// ============================================================
const voiceAudio = document.getElementById('voiceAudio');
const voicePlayBtn = document.getElementById('voicePlayBtn');
const voicePlayIcon = document.getElementById('voicePlayIcon');
const voiceProgress = document.getElementById('voiceProgress');
const voiceCurrent = document.getElementById('voiceCurrent');
const voiceStatus = document.getElementById('voiceStatus');

const ICON_PLAY = '<path fill="currentColor" d="M8 5v14l11-7z"></path>';
const ICON_PAUSE = '<path fill="currentColor" d="M6 5h4v14H6zM14 5h4v14h-4z"></path>';

let voiceReady = false;
voiceAudio.addEventListener('loadedmetadata', () => {
  voiceReady = true;
  voiceStatus.textContent = 'tap play to listen';
});
voiceAudio.addEventListener('error', () => {
  voiceReady = false;
  voiceStatus.textContent = 'add your voice note to activate this player';
});

function formatTime(s){
  if(!isFinite(s)) return '0:00';
  const m = Math.floor(s/60), sec = Math.floor(s%60);
  return m + ':' + String(sec).padStart(2,'0');
}

voicePlayBtn.addEventListener('click', () => {
  if(!voiceReady){
    voiceStatus.textContent = "no voice note yet — add assets/audio/voice-note.mp3";
    return;
  }
  if(voiceAudio.paused){
    if(!bgMusic.paused){ bgMusic.pause(); musicToggle.classList.remove('playing'); }
    voiceAudio.play();
    voicePlayIcon.innerHTML = ICON_PAUSE;
  } else {
    voiceAudio.pause();
    voicePlayIcon.innerHTML = ICON_PLAY;
  }
});
voiceAudio.addEventListener('timeupdate', () => {
  if(voiceAudio.duration){
    voiceProgress.style.width = (voiceAudio.currentTime/voiceAudio.duration*100) + '%';
    voiceCurrent.textContent = formatTime(voiceAudio.currentTime);
  }
});
voiceAudio.addEventListener('ended', () => {
  voicePlayIcon.innerHTML = ICON_PLAY;
  voiceProgress.style.width = '0%';
  voiceCurrent.textContent = '0:00';
});

// ============================================================
// SCROLL REVEAL (light fade-up for sections)
// ============================================================
const revealTargets = document.querySelectorAll('.polaroid, .reason-card, .intro, .video-caption');
revealTargets.forEach(el => { el.style.opacity = 0; el.style.transform = 'translateY(24px)'; el.style.transition = 'opacity .7s ease, transform .7s ease'; });

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealTargets.forEach(el => io.observe(el));
