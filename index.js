// Reveal on scroll
const onScroll = () => {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
    });
};
onScroll();
document.addEventListener('scroll', onScroll, {passive: true});

// Countdown to a specific date
const target = new Date('2025-10-20T18:00:00');

function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = "0";
        document.getElementById('hours').textContent = "0";
        document.getElementById('minutes').textContent = "0";
        document.getElementById('seconds').textContent = "0";

        const countdown = document.getElementById('countdown');
        countdown.innerHTML = `<p class="invitation-font text-4xl text-gold mt-4">C'est aujourd'hui !</p>`;
        return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    document.getElementById('days').textContent = d;
    document.getElementById('hours').textContent = h.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = m.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = s.toString().padStart(2, '0');
}

setInterval(tick, 1000);
tick();

// Music functionality (simplified)
const music = document.getElementById('weddingMusic');
let musicStarted = false;

function fadeIn(audio, duration = 3000) {
    audio.volume = 0;
    audio.play().catch(() => {
        document.body.addEventListener('click', () => {
            fadeIn(audio, duration);
        }, {once: true});
    });

    let step = 0.02;
    let interval = duration / (1 / step * 50);
    const fade = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + step, 1);
        } else {
            clearInterval(fade);
        }
    }, interval);
}

function fadeOut(audio, duration = 3000) {
    let step = 0.02;
    let interval = duration / (1 / step * 50);
    const fade = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            clearInterval(fade);
        }
    }, interval);
}

const musicControlBtn = document.getElementById('musicControlBtn');

function checkSectionInView() {
    const invitationSection = document.getElementById('invitation');
    if (!invitationSection) return;

    const rect = invitationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

    if (isVisible && !musicStarted) {
        musicStarted = true;

        fadeIn(music, 2000);

        musicControlBtn.classList.remove('hidden');
        musicControlBtn.querySelector('i').className = 'fa-solid fa-volume-xmark';
    }
}

musicControlBtn.addEventListener('click', () => {
    console.log(music.paused);
    if (music.paused) {

        fadeIn(music, 1000);
        musicControlBtn.querySelector('i').className = 'fa-solid fa-volume-high';
    } else {
        fadeOut(music, 1000);
        musicControlBtn.querySelector('i').className = 'fa-solid fa-volume-xmark';
    }
});


window.addEventListener('scroll', checkSectionInView, {passive: true});
window.addEventListener('resize', checkSectionInView);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkSectionInView, 100);
});

document.addEventListener('click', () => {
    if (musicStarted && music.paused) {
        fadeIn(music, 1000);
    }
}, {once: true});