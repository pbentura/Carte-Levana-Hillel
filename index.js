// Reveal on scroll
const onScroll = () => {
    document.querySelectorAll('.reveal').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 80) el.classList.add('visible');
    });
};
onScroll();
document.addEventListener('scroll', onScroll, {passive: true});

// Countdown to a specific date (set to 2026-04-01 17:00 local)
const target = new Date('2025-10-20T18:00:00');

function tick() {
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('days').textContent = "0";
        document.getElementById('hours').textContent = "0";
        document.getElementById('minutes').textContent = "0";
        document.getElementById('seconds').textContent = "0";

// Afficher le message spécial
        const countdown = document.getElementById('countdown');
        countdown.innerHTML = `<p class="invitation-font text-4xl text-gold mt-4">C’est aujourd’hui !</p>`;
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
tick(); // lancement immédiat


// Add to Calendar (.ics)
// document.getElementById('addToCalendar').addEventListener('click', () => {
//     const dtStart = '20240401T150000Z'; // 17:00 Paris ≈ 15:00Z heure d'hiver -> ajustez si besoin
//     const dtEnd = '20240401T210000Z';
//     const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Wedding Card//FR\nBEGIN:VEVENT\nUID:${Date.now()}@wedding\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nSUMMARY:Mariage – Aurélia & Eythan\nLOCATION:Palace de Villiers, 12 Avenue des Entrepreneurs, 95400 Villiers-le-Bel\nDESCRIPTION:Houppa 17h00 — Réception à suivre\nEND:VEVENT\nEND:VCALENDAR`;
//     const blob = new Blob([ics], {type: 'text/calendar'});
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'mariage-aurelia-eythan.ics';
//     a.click();
//     setTimeout(() => URL.revokeObjectURL(url), 2000);
// });

// --- Reveal + HERO Animations ---
// window.addEventListener('DOMContentLoaded', () => {
//     const heroTitle = document.querySelector('.hero-title');
//     setTimeout(() => heroTitle.style.opacity = '1', 100); // fade in léger
//
//     // Générer des particules dans le HERO
//     const heroSection = document.querySelector('header');
//     for (let i = 0; i < 30; i++) {
//         const p = document.createElement('div');
//         p.className = 'particle';
//         p.style.top = Math.random() * 70 + '%';
//         p.style.left = Math.random() * 90 + '%';
//         p.style.animationDuration = (3 + Math.random() * 10) + 's';
//         heroSection.appendChild(p);
//     }
// });

const music = document.getElementById('weddingMusic');
let musicPlayed = false;

function fadeOut(audio, duration = 3000) {
    let step = 0.02; // incrément du volume
    let interval = duration / (1 / step * 50); // ajuster l'intervalle
    const fade = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0);
        } else {
            clearInterval(fade);
        }
    }, interval);
}
// Fonction pour faire un fade-in progressif
function fadeIn(audio, duration = 3000) {
    audio.volume = 0;
    audio.play().catch(() => {
// si autoplay bloqué, attendre clic utilisateur
        document.body.addEventListener('click', () => {
            fadeIn(audio, duration);
        }, {once: true});
    });

    let step = 0.02; // incrément du volume
    let interval = duration / (1 / step * 50); // ajuster l'intervalle
    const fade = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + step, 1);
        } else {
            clearInterval(fade);
        }
    }, interval);
}

// Détecter quand la section #invitation entre dans la fenêtre
const invitationSection = document.getElementById('invitation');

// Variables pour gérer la musique
let musicStarted = false;
const weddingMusic = document.getElementById('weddingMusic');

// Fonction pour vérifier si la section invitation est visible
function checkSectionInView() {
    const invitationSection = document.getElementById('invitation');
    if (!invitationSection) return;

    const rect = invitationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Section visible si elle occupe au moins 30% de l'écran
    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

    if (isVisible && !musicStarted) {
        // Démarrer la musique avec fade-in
        musicStarted = true;
        fadeIn(weddingMusic, 2000); // fade-in sur 2 secondes
        console.log('Musique démarrée - Section invitation visible');
    } else if (!isVisible && musicStarted) {
        // Arrêter la musique avec fade-out
        musicStarted = false;
        fadeOut(weddingMusic, 1500); // fade-out sur 1.5 secondes
        console.log('Musique arrêtée - Section invitation non visible');
    }
}

// Détecter quand la section #invitation entre dans la fenêtre
window.addEventListener('scroll', checkSectionInView, {passive: true});
window.addEventListener('resize', checkSectionInView);

// Vérifier immédiatement au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Petite temporisation pour s'assurer que tout est chargé
    setTimeout(checkSectionInView, 100);
});

// Gérer les interactions utilisateur pour l'autoplay
document.addEventListener('click', () => {
    if (musicStarted && weddingMusic.paused) {
        fadeIn(weddingMusic, 1000);
    }
}, {once: true});