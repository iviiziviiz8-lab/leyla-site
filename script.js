// Loader

window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("fade-out");

        const main = document.getElementById("main-site");

        if(main){
            main.classList.add("visible");
        }

    }, 1800);
});

// Compteur

const targetDate = new Date("February 28, 2026 00:00:00");

function updateCounter() {

    const now = new Date();

    const diff = now - targetDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (diff % (1000 * 60 * 60))
        /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (diff % (1000 * 60))
        /
        1000
    );

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;
}

setInterval(updateCounter, 1000);

updateCounter();

// Pétales

function createPetal(layerId) {

    const layer = document.getElementById(layerId);

    const petal = document.createElement("div");

    petal.classList.add("petal");

    const size = Math.random() * 20 + 10;

    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.5}px`;

    petal.style.left = `${Math.random() * 100}%`;

    petal.style.background =
        "rgba(255,182,193,0.7)";

    petal.style.setProperty(
        "--drift",
        `${(Math.random() * 200) - 100}px`
    );

    petal.style.setProperty(
        "--spin",
        `${(Math.random() * 720) - 360}deg`
    );

    petal.style.animationDuration =
        `${8 + Math.random() * 10}s`;

    layer.appendChild(petal);

    setTimeout(() => {
        petal.remove();
    }, 18000);
}

setInterval(() => createPetal("petals-bg"), 500);
setInterval(() => createPetal("petals-mid"), 350);
setInterval(() => createPetal("petals-fg"), 250);

// Particules

const canvas =
document.getElementById("particle-canvas");

const ctx =
canvas.getContext("2d");

let particles = [];

function resizeCanvas() {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener(
    "resize",
    resizeCanvas
);

for(let i = 0; i < 80; i++) {

    particles.push({

        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,

        r: Math.random() * 2 + 1,

        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3

    });
}

function animateParticles() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    particles.forEach(p => {

        p.x += p.dx;
        p.y += p.dy;

        if(p.x < 0) p.x = canvas.width;
        if(p.x > canvas.width) p.x = 0;

        if(p.y < 0) p.y = canvas.height;
        if(p.y > canvas.height) p.y = 0;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,182,193,0.25)";

        ctx.fill();
    });

    requestAnimationFrame(
        animateParticles
    );
}

animateParticles();
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

let playing = false;

musicBtn.addEventListener("click",()=>{

if(!playing){

music.play();
musicBtn.innerHTML="❚❚";
playing=true;

}else{

music.pause();
musicBtn.innerHTML="▶";
playing=false;

}

});
const progressBar =
document.getElementById("progressBar");

const currentTime =
document.getElementById("currentTime");

const duration =
document.getElementById("duration");

music.addEventListener("loadedmetadata",()=>{

duration.textContent =
formatTime(music.duration);

});

music.addEventListener("timeupdate",()=>{

const percent =
(music.currentTime / music.duration) * 100;

progressBar.value = percent;

currentTime.textContent =
formatTime(music.currentTime);

});

progressBar.addEventListener("input",()=>{

music.currentTime =
(progressBar.value / 100)
*
music.duration;

});

function formatTime(seconds){

const mins =
Math.floor(seconds / 60);

const secs =
Math.floor(seconds % 60);

return mins + ":" +
(secs < 10 ? "0" : "") +
secs;

}
const volumeBar =
document.getElementById("volumeBar");

music.volume = 0.8;

volumeBar.addEventListener("input",()=>{

music.volume =
volumeBar.value / 100;

});