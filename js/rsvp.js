/**
 * rsvp.js - Gerenciamento de Confirmação de Presença (RSVP) e Painel do Admin
 * Desenvolvido para o Convite de Mariah Mello
 */

// Insira aqui o link gerado pelo Google Apps Script (Web App URL) após a implantação
// Exemplo: 'https://script.google.com/macros/s/AKfycbz.../exec'
const GOOGLE_SHEETS_WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbxaLFKOk4M9ulYzXKHqTBF81D1IU9wkPpp48gwgFUvmcr_M2shZfkYsLZaunTkx3skg/exec';

document.addEventListener('DOMContentLoaded', () => {
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccessModal = document.getElementById('rsvp-success-modal');
    const closeSuccessBtn = document.getElementById('close-success-btn');
    
    // Admin features
    const footerText = document.querySelector('.footer-text');
    const adminModal = document.getElementById('admin-modal');
    const closeAdminBtn = document.getElementById('close-admin-btn');
    const rsvpTableBody = document.getElementById('rsvp-table-body');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const clearRsvpsBtn = document.getElementById('clear-rsvps-btn');
    
    let clickCount = 0;

    // 1. Lógica de Submissão do Form
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Coletar dados
            const rsvpData = {
                id: 'rsvp_' + Date.now(),
                name: document.getElementById('rsvp-name').value,
                guests: parseInt(document.getElementById('rsvp-guests').value) || 0,
                phone: document.getElementById('rsvp-phone').value,
                email: document.getElementById('rsvp-email').value,
                useBus: document.getElementById('rsvp-bus').value,
                dietary: document.getElementById('rsvp-dietary').value,
                message: document.getElementById('rsvp-message').value,
                date: new Date().toLocaleString('pt-BR')
            };

            // Mostrar estado de envio (loading)
            const submitBtn = rsvpForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Confirmando...';
            submitBtn.disabled = true;

            // Enviar para o Google Planilhas se a URL estiver configurada
            if (GOOGLE_SHEETS_WEBAPP_URL) {
                try {
                    await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                        method: 'POST',
                        mode: 'no-cors', // Evita erro de CORS com o Apps Script Web App
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(rsvpData)
                    });
                    console.log('RSVP enviado com sucesso para o Google Planilhas!');
                } catch (err) {
                    console.error('Erro ao enviar para o Google Planilhas:', err);
                }
            }

            try {
                // Tentar enviar para o servidor Express local (caso esteja rodando local)
                const response = await fetch('/api/rsvp', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rsvpData)
                });
                
                if (!response.ok) throw new Error('Falha no envio para o servidor');
                console.log('RSVP salvo no servidor local!');
            } catch (err) {
                console.log('Servidor local não ativo ou erro no salvamento local.');
            }

            // Salvar no LocalStorage (sempre, como backup e funcionamento estático)
            saveToLocalStorage(rsvpData);

            // Simular e-mail enviado (confirmação visual)
            console.log(`[Simulação] E-mail de confirmação enviado para ${rsvpData.email}`);

            // Exibir modal de sucesso com animação
            setTimeout(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                // Limpar formulário
                rsvpForm.reset();
                
                // Mostrar animação de sucesso
                if (rsvpSuccessModal) {
                    rsvpSuccessModal.classList.add('active');
                    triggerSuccessBubbleExplosion();
                }
            }, 800);
        });
    }

    if (closeSuccessBtn && rsvpSuccessModal) {
        closeSuccessBtn.addEventListener('click', () => {
            rsvpSuccessModal.classList.remove('active');
        });
    }

    // Função para salvar no LocalStorage
    function saveToLocalStorage(data) {
        let rsvps = JSON.parse(localStorage.getItem('mariah_rsvps')) || [];
        rsvps.push(data);
        localStorage.setItem('mariah_rsvps', JSON.stringify(rsvps));
    }

    // Animação de bolhas de sucesso
    function triggerSuccessBubbleExplosion() {
        const container = document.querySelector('.rsvp-success-card');
        if (!container) return;

        for (let i = 0; i < 20; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'success-particle';
            
            const size = Math.random() * 20 + 8;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            
            // Posição inicial no centro do card
            bubble.style.left = '50%';
            bubble.style.top = '40%';
            
            // Direções aleatórias de explosão
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 120 + 50;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance;
            
            bubble.style.setProperty('--tx', `${destX}px`);
            bubble.style.setProperty('--ty', `${destY}px`);
            
            container.appendChild(bubble);
            
            // Remover após a animação
            setTimeout(() => bubble.remove(), 1500);
        }
    }

    // 2. Painel Administrativo Oculto
    // Clicar 5 vezes no texto do rodapé para abrir
    if (footerText) {
        footerText.style.cursor = 'pointer';
        footerText.addEventListener('click', () => {
            clickCount++;
            if (clickCount >= 5) {
                clickCount = 0;
                openAdminPanel();
            }
        });
    }

    function openAdminPanel() {
        renderRsvpList();
        if (adminModal) {
            adminModal.classList.add('active');
        }
    }

    if (closeAdminBtn && adminModal) {
        closeAdminBtn.addEventListener('click', () => {
            adminModal.classList.remove('active');
        });
    }

    async function loadRsvps() {
        // Tentar carregar do servidor
        try {
            const response = await fetch('/api/rsvps');
            if (response.ok) {
                return await response.json();
            }
        } catch (err) {
            console.log('Falha ao conectar com API de listagem, usando dados locais.');
        }
        // Fallback LocalStorage
        return JSON.parse(localStorage.getItem('mariah_rsvps')) || [];
    }

    async function renderRsvpList() {
        if (!rsvpTableBody) return;
        
        rsvpTableBody.innerHTML = '<tr><td colspan="8" class="text-center">Carregando confirmações...</td></tr>';
        
        const rsvps = await loadRsvps();
        
        if (rsvps.length === 0) {
            rsvpTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px;">Nenhuma presença confirmada ainda.</td></tr>';
            return;
        }

        rsvpTableBody.innerHTML = '';
        rsvps.forEach((rsvp, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${rsvp.name}</strong></td>
                <td style="text-align: center;">${rsvp.guests}</td>
                <td>${rsvp.phone}</td>
                <td>${rsvp.email}</td>
                <td style="text-align: center;"><span class="badge ${rsvp.useBus === 'sim' ? 'badge-yes' : 'badge-no'}">${rsvp.useBus.toUpperCase()}</span></td>
                <td>${rsvp.dietary || '-'}</td>
                <td><small>${rsvp.message || '-'}</small></td>
                <td><small>${rsvp.date}</small></td>
            `;
            rsvpTableBody.appendChild(tr);
        });
    }

    // Exportar CSV
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', async () => {
            const rsvps = await loadRsvps();
            if (rsvps.length === 0) {
                alert('Não há RSVPs para exportar.');
                return;
            }

            let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
            csvContent += "Nome Completo,Acompanhantes,Telefone,Email,Utiliza Onibus,Restricoes Alimentares,Mensagem,Data de Envio\n";

            rsvps.forEach(r => {
                const row = [
                    `"${r.name.replace(/"/g, '""')}"`,
                    r.guests,
                    `"${r.phone}"`,
                    `"${r.email}"`,
                    `"${r.useBus}"`,
                    `"${(r.dietary || '').replace(/"/g, '""')}"`,
                    `"${(r.message || '').replace(/"/g, '""')}"`,
                    `"${r.date}"`
                ].join(",");
                csvContent += row + "\n";
            });

            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "confirmacoes_presenca_mariah.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Limpar RSVPs
    if (clearRsvpsBtn) {
        clearRsvpsBtn.addEventListener('click', async () => {
            if (confirm('Tem certeza absoluta que deseja apagar TODAS as confirmações? Esta ação não pode ser desfeita.')) {
                // Tentar limpar no servidor
                try {
                    await fetch('/api/rsvps/clear', { method: 'POST' });
                } catch (e) {}
                
                // Limpar localmente
                localStorage.removeItem('mariah_rsvps');
                alert('Lista de confirmações limpa com sucesso!');
                renderRsvpList();
            }
        });
    }
});
