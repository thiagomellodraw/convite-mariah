/**
 * shell.js - Animação Cinematográfica de Abertura (Concha e Pérola)
 * Desenvolvido para o Convite de Mariah Mello
 */

document.addEventListener('DOMContentLoaded', () => {
    const openingOverlay = document.getElementById('opening-overlay');
    const shellContainer = document.querySelector('.shell-container');
    const startButton = document.getElementById('start-celebration-btn');
    const pearlGlowOverlay = document.getElementById('pearl-glow-overlay');
    const birthdayNameNode = document.getElementById('opening-debutante-name');
    const bgAudio = document.getElementById('bg-music');
    const audioToggle = document.getElementById('audio-toggle-btn');
    const audioIcon = audioToggle ? audioToggle.querySelector('i') : null;

    if (!shellContainer || !startButton) return;

    // Lógica para abrir o convite
    startButton.addEventListener('click', () => {
        // Tentar iniciar música
        if (bgAudio) {
            bgAudio.play().then(() => {
                if (audioToggle) {
                    audioToggle.classList.add('playing');
                }
            }).catch(err => {
                console.log("Áudio bloqueado pelo navegador. Interação necessária.");
            });
        }

        // 1. Iniciar animação da concha abrindo
        shellContainer.classList.add('opened');
        startButton.style.opacity = '0';
        startButton.style.pointerEvents = 'none';

        // 2. Revelar a pérola e iniciar brilho
        setTimeout(() => {
            pearlGlowOverlay.classList.add('active');
            
            // 3. Revelar nome da aniversariante no centro do brilho
            setTimeout(() => {
                birthdayNameNode.classList.add('visible');
            }, 800);

            // 4. Fade out completo do overlay de abertura
            setTimeout(() => {
                openingOverlay.classList.add('fade-out');
                
                // Habilitar rolagem na página principal
                document.body.classList.remove('no-scroll');
                
                // Iniciar animação do Hero
                const heroSection = document.querySelector('.hero-section');
                if (heroSection) {
                    heroSection.classList.add('animate-in');
                }
                
                // Limpar do DOM após fade
                setTimeout(() => {
                    openingOverlay.style.display = 'none';
                }, 1500);

            }, 4200); // tempo de exibição do nome e transição

        }, 1500); // concha leva 1.5s para abrir e revelar pérola
    });

    // Controlar botão flutuante de som
    if (audioToggle && bgAudio) {
        audioToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play();
                audioToggle.classList.add('playing');
                if (audioIcon) {
                    audioIcon.className = 'fas fa-volume-up';
                }
            } else {
                bgAudio.pause();
                audioToggle.classList.remove('playing');
                if (audioIcon) {
                    audioIcon.className = 'fas fa-volume-mute';
                }
            }
        });
    }
});
