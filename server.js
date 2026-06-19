/**
 * server.js - Servidor Local para Persistência de RSVPs
 * Desenvolvido para o Convite de 15 Anos de Mariah Mello
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

const DB_FILE = path.join(__dirname, 'rsvps.json');

// Middleware para JSON e arquivos estáticos
app.use(express.json());
app.use(express.static(__dirname));

// Garantir que o arquivo JSON existe e está inicializado
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
}

// Endpoint para registrar um RSVP
app.post('/api/rsvp', (req, res) => {
    try {
        const newRsvp = req.body;
        
        // Ler base existente
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const rsvps = JSON.parse(data);
        
        // Adicionar novo registro
        rsvps.push(newRsvp);
        
        // Salvar base atualizada
        fs.writeFileSync(DB_FILE, JSON.stringify(rsvps, null, 2), 'utf8');
        
        console.log(`[RSVP] Novo convidado confirmado: ${newRsvp.name}`);
        res.status(201).json({ success: true, message: 'Confirmação salva com sucesso!' });
    } catch (err) {
        console.error('Erro ao salvar RSVP:', err);
        res.status(500).json({ success: false, message: 'Erro interno ao processar confirmação.' });
    }
});

// Endpoint para listar os RSVPs (Painel Admin)
app.get('/api/rsvps', (req, res) => {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        const rsvps = JSON.parse(data);
        res.json(rsvps);
    } catch (err) {
        console.error('Erro ao ler RSVPs:', err);
        res.status(500).json({ success: false, message: 'Erro ao ler a lista de convidados.' });
    }
});

// Endpoint para limpar todos os RSVPs
app.post('/api/rsvps/clear', (req, res) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
        console.log('[RSVP] Todas as confirmações foram limpas.');
        res.json({ success: true, message: 'Lista limpa com sucesso!' });
    } catch (err) {
        console.error('Erro ao limpar RSVPs:', err);
        res.status(500).json({ success: false, message: 'Erro ao limpar dados.' });
    }
});

// Rota padrão para servir o index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`===================================================`);
    console.log(`Servidor rodando com sucesso!`);
    console.log(`Acesse o convite interativo localmente em:`);
    console.log(`👉 http://localhost:${PORT}`);
    console.log(`===================================================`);
});
