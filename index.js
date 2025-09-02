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

function checkSectionInView() {
    const invitationSection = document.getElementById('invitation');
    if (!invitationSection) return;

    const rect = invitationSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const isVisible = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;

    if (isVisible && !musicStarted) {
        musicStarted = true;
        fadeIn(music, 2000);
    } else if (!isVisible && musicStarted) {
        musicStarted = false;
        fadeOut(music, 1500);
    }
}

window.addEventListener('scroll', checkSectionInView, {passive: true});
window.addEventListener('resize', checkSectionInView);
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkSectionInView, 100);
});

// PDF Generation Functionality
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const loadingSpinner = document.getElementById('loadingSpinner');

    try {
        // Afficher le spinner de chargement
        loadingSpinner.style.display = 'block';

        // Sélectionner la section invitation
        const invitationSection = document.getElementById('invitation');

        // Créer un clone de la section pour la modifier pour le PDF
        const clone = invitationSection.cloneNode(true);
        clone.classList.add('pdf-section');

        // Supprimer le bouton de téléchargement du clone
        const downloadBtn = clone.querySelector('#downloadPdf');
        if (downloadBtn) downloadBtn.remove();

        // Ajouter le clone au body temporairement (caché)
        clone.style.position = 'absolute';
        clone.style.top = '-10000px';
        clone.style.left = '-10000px';
        clone.style.width = '800px'; // Largeur fixe pour le PDF
        document.body.appendChild(clone);

        // Attendre que les polices se chargent
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Capturer la section avec html2canvas
        const canvas = await html2canvas(clone, {
            scale: 2, // Haute qualité
            useCORS: true,
            backgroundColor: '#ffffff',
            width: 800,
            height: clone.offsetHeight,
        });

        // Supprimer le clone
        document.body.removeChild(clone);

        // Créer le PDF
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculer les dimensions pour centrer l'image
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const canvasAspectRatio = canvas.height / canvas.width;
        const maxWidth = pdfWidth - 20; // Marges de 10mm de chaque côté
        const maxHeight = pdfHeight - 20; // Marges de 10mm en haut et en bas

        let imgWidth = maxWidth;
        let imgHeight = imgWidth * canvasAspectRatio;

        // Si l'image est trop haute, ajuster
        if (imgHeight > maxHeight) {
            imgHeight = maxHeight;
            imgWidth = imgHeight / canvasAspectRatio;
        }

        const xPos = (pdfWidth - imgWidth) / 2;
        const yPos = (pdfHeight - imgHeight) / 2;

        // Ajouter l'image au PDF
        pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);

        // Télécharger le PDF
        pdf.save('Invitation-Mariage-Levana-Hillel.pdf');

    } catch (error) {
        console.error('Erreur lors de la génération du PDF:', error);
        alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
        // Cacher le spinner de chargement
        loadingSpinner.style.display = 'none';
    }
}


document.addEventListener('click', () => {
    if (musicStarted && music.paused) {
        fadeIn(music, 1000);
    }
}, {once: true});