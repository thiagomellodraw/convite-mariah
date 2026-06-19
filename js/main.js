/**
 * main.js - Controladora Principal do Convite
 * Desenvolvido para o Convite de 15 Anos da Mariah Mello
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Temporizador (Contagem Regressiva)
    // Data do evento: 01 de Agosto de 2026 às 20:00
    const targetDate = new Date('August 1, 2026 20:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const daysNode = document.getElementById('days');
        const hoursNode = document.getElementById('hours');
        const minutesNode = document.getElementById('minutes');
        const secondsNode = document.getElementById('seconds');

        if (!daysNode) return;

        if (difference < 0) {
            // Evento já começou
            document.querySelector('.countdown-container').innerHTML = '<h3 class="event-started-text">A Celebração Começou!</h3>';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Preencher valores com zero à esquerda
        daysNode.innerText = String(days).padStart(2, '0');
        hoursNode.innerText = String(hours).padStart(2, '0');
        minutesNode.innerText = String(minutes).padStart(2, '0');
        secondsNode.innerText = String(seconds).padStart(2, '0');
    }

    // Executar temporizador a cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // 2. Animação de Entrada ao Rolar a Página (Scroll Reveal)
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Parar de observar depois de revelar
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // ativa quando 15% do elemento está visível
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        observer.observe(element);
    });

    // 3. Lógica do Menu (Cardápio Interativo)
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuContents = document.querySelectorAll('.menu-content-group');

    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.getAttribute('data-category');
            
            // Remover ativo de todas as abas
            menuTabs.forEach(t => t.classList.remove('active'));
            // Ocultar todas as seções
            menuContents.forEach(c => c.classList.remove('active'));
            
            // Ativar aba atual
            tab.classList.add('active');
            // Mostrar conteúdo correspondente
            const activeContent = document.getElementById(`menu-${category}`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // 4. Integração do Ônibus (Botão "Confirmar uso do transporte")
    const confirmBusBtn = document.getElementById('confirm-bus-btn');
    if (confirmBusBtn) {
        confirmBusBtn.addEventListener('click', () => {
            const rsvpSection = document.getElementById('rsvp');
            const busSelect = document.getElementById('rsvp-bus');

            if (rsvpSection) {
                // Rolar suavemente para a seção do RSVP
                rsvpSection.scrollIntoView({ behavior: 'smooth' });

                // Marcar automaticamente "Sim" no select do ônibus
                if (busSelect) {
                    busSelect.value = 'sim';
                    // Criar um efeito de brilho/foco temporário no select
                    busSelect.focus();
                    busSelect.classList.add('highlight-field');
                    setTimeout(() => {
                        busSelect.classList.remove('highlight-field');
                    }, 2000);
                }
            }
        });
    }


});
