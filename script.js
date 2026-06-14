const meetDate = new Date("2026-02-28T00:00:00");

const loader = document.getElementById("loader");
const giftIntro = document.getElementById("giftIntro");
const giftBox = document.getElementById("giftBox");
const giftRevealCard = document.getElementById("giftRevealCard");
const enterSite = document.getElementById("enterSite");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const petalsLayer = document.getElementById("petals");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const progressBar = document.getElementById("progressBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeBar = document.getElementById("volumeBar");
const audioStatus = document.getElementById("audioStatus");
const player = document.getElementById("musicPlayer");
const closePlayer = document.getElementById("closePlayer");
const showPlayer = document.getElementById("showPlayer");
const openLetter = document.getElementById("openLetter");
const loveLetter = document.getElementById("loveLetter");
const sparkBtn = document.getElementById("sparkBtn");

let particles = [];
let isPlaying = false;
let petalTimer;
let siteOpened = false;
let giftOpened = false;

window.addEventListener("load", () => {
  window.setTimeout(() => {
    loader.classList.add("is-hidden");
  }, 1400);
});

function padNumber(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function updateCounter() {
  const now = new Date();
  const diff = Math.max(0, now - meetDate);
  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  daysEl.textContent = Math.floor(diff / day);
  hoursEl.textContent = padNumber(Math.floor((diff % day) / hour));
  minutesEl.textContent = padNumber(Math.floor((diff % hour) / minute));
  secondsEl.textContent = padNumber(Math.floor((diff % minute) / 1000));
}

updateCounter();
window.setInterval(updateCounter, 1000);

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = window.innerWidth < 600 ? 46 : 86;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + .6,
    vx: (Math.random() - .5) * .18,
    vy: (Math.random() - .5) * .18,
    alpha: Math.random() * .42 + .16
  }));
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -10) particle.x = window.innerWidth + 10;
    if (particle.x > window.innerWidth + 10) particle.x = -10;
    if (particle.y < -10) particle.y = window.innerHeight + 10;
    if (particle.y > window.innerHeight + 10) particle.y = -10;

    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.r * 7
    );

    gradient.addColorStop(0, `rgba(255, 209, 220, ${particle.alpha})`);
    gradient.addColorStop(1, "rgba(255, 59, 167, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r * 7, 0, Math.PI * 2);
    ctx.fill();
  });

  window.requestAnimationFrame(animateParticles);
}

resizeCanvas();
animateParticles();
window.addEventListener("resize", resizeCanvas);

function createPetal() {
  const petal = document.createElement("span");
  const size = Math.random() * 13 + 9;

  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--size", `${size}px`);
  petal.style.setProperty("--drift", `${Math.random() * 170 - 85}px`);
  petal.style.setProperty("--rotate", `${Math.random() * 520 + 160}deg`);
  petal.style.setProperty("--duration", `${Math.random() * 6 + 8}s`);
  petalsLayer.appendChild(petal);

  window.setTimeout(() => petal.remove(), 15000);
}

function startPetals() {
  const delay = window.innerWidth < 600 ? 620 : 360;
  petalTimer = window.setInterval(createPetal, delay);
}

startPetals();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .16 });

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

function revealVisibleSections() {
  document.querySelectorAll(".reveal").forEach((item) => {
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      item.classList.add("is-visible");
    }
  });
}

function openGiftIntro() {
  if (giftOpened) return;

  giftOpened = true;
  giftIntro.classList.add("is-opening");
  tryStartMusic();

  for (let index = 0; index < 64; index += 1) {
    window.setTimeout(() => {
      createSpark(window.innerWidth / 2, window.innerHeight * .48);
    }, index * 10);
  }

  window.setTimeout(() => {
    giftIntro.classList.add("is-card-ready");
    giftRevealCard.classList.add("is-visible");
    giftRevealCard.setAttribute("aria-hidden", "false");
  }, 780);
}

function enterMainSite() {
  if (siteOpened) return;

  siteOpened = true;
  tryStartMusic();
  document.body.classList.add("site-open");
  document.body.classList.remove("intro-locked");
  giftIntro.classList.add("is-gone");
  revealVisibleSections();
  window.scrollTo({ top: 0, behavior: "auto" });
}

giftBox.addEventListener("click", openGiftIntro);
enterSite.addEventListener("click", enterMainSite);

openLetter.addEventListener("click", () => {
  const isOpen = openLetter.classList.toggle("is-open");
  openLetter.setAttribute("aria-expanded", String(isOpen));
  loveLetter.classList.toggle("is-visible", isOpen);
  loveLetter.setAttribute("aria-hidden", String(!isOpen));
});

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

function updatePlayState() {
  musicBtn.textContent = isPlaying ? "Pause" : "Play";
  player.classList.toggle("is-playing", isPlaying);
}

function setAudioStatus(message, isError = false) {
  audioStatus.textContent = message;
  audioStatus.classList.toggle("is-error", isError);
}

music.volume = Number(volumeBar.value) / 100;
music.load();
updatePlayState();

async function tryStartMusic() {
  try {
    setAudioStatus("Loading Apocalypse...");
    music.muted = false;
    music.volume = Number(volumeBar.value) / 100;
    if (music.readyState === 0) {
      music.load();
    }
    await music.play();
    isPlaying = !music.paused;
    setAudioStatus(isPlaying ? "Playing Apocalypse" : "Tap Play to start the song");
    updatePlayState();
  } catch (error) {
    isPlaying = false;
    setAudioStatus(`Audio blocked: ${error.name}. Tap Play again.`, true);
    updatePlayState();
  }
}

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    await tryStartMusic();
  } else {
    music.pause();
    isPlaying = false;
    setAudioStatus("Paused");
    updatePlayState();
  }
});

music.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(music.duration);
  setAudioStatus("Ready. Tap Play if it does not start automatically.");
});

music.addEventListener("canplay", () => {
  if (!isPlaying) {
    setAudioStatus("Ready. Tap Play to start Apocalypse.");
  }
});

music.addEventListener("timeupdate", () => {
  if (!music.duration) return;
  progressBar.value = String((music.currentTime / music.duration) * 100);
  currentTimeEl.textContent = formatTime(music.currentTime);
});

music.addEventListener("ended", () => {
  isPlaying = false;
  setAudioStatus("Ended");
  updatePlayState();
});

music.addEventListener("error", () => {
  const code = music.error ? music.error.code : "unknown";
  setAudioStatus(`Audio file error (${code}). The MP3 may be unsupported.`, true);
});

progressBar.addEventListener("input", () => {
  if (!music.duration) return;
  music.currentTime = (Number(progressBar.value) / 100) * music.duration;
});

volumeBar.addEventListener("input", () => {
  music.volume = Number(volumeBar.value) / 100;
});

closePlayer.addEventListener("click", () => {
  player.classList.add("is-hidden");
  showPlayer.classList.add("is-visible");
});

showPlayer.addEventListener("click", () => {
  player.classList.remove("is-hidden");
  showPlayer.classList.remove("is-visible");
});

function createSpark(x, y) {
  const spark = document.createElement("span");
  spark.className = "spark";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.setProperty("--x", `${Math.random() * 180 - 90}px`);
  spark.style.setProperty("--y", `${Math.random() * 180 - 90}px`);
  document.body.appendChild(spark);
  window.setTimeout(() => spark.remove(), 900);
}

sparkBtn.addEventListener("click", () => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  for (let index = 0; index < 34; index += 1) {
    window.setTimeout(() => createSpark(centerX, centerY), index * 14);
  }
});

window.addEventListener("beforeunload", () => {
  window.clearInterval(petalTimer);
});
