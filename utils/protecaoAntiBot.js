// Sistema de proteção anti-banimento para WhatsApp
const crypto = require('crypto');

class ProtecaoAntiBot {
    constructor() {
        this.ultimaInteracao = new Map(); // Rastreia última interação por usuário
        this.contadorMensagens = new Map(); // Conta mensagens por usuário
        this.horariosAtivos = new Map(); // Horários de atividade por usuário
        this.resetDiario();
    }

    // Reset diário dos contadores
    resetDiario() {
        setInterval(() => {
            this.contadorMensagens.clear();
            this.horariosAtivos.clear();
            console.log('🔄 Reset diário das proteções anti-bot');
        }, 24 * 60 * 60 * 1000); // 24 horas
    }

    // Delay aleatório baseado no contexto
    async delayAleatorio(tipo = 'normal', userId = null) {
        let min, max;
        
        switch (tipo) {
            case 'inicio_conversa':
                min = 1000; max = 3000; // 1-3 segundos (reduzido)
                break;
            case 'pergunta_sensivel':
                min = 3000; max = 8000; // 3-8 segundos (reduzido drasticamente)
                break;
            case 'envio_arquivo':
                min = 5000; max = 10000; // 5-10 segundos (reduzido)
                break;
            case 'transicao_etapa':
                min = 2000; max = 5000; // 2-5 segundos (reduzido)
                break;
            case 'resposta_rapida':
                min = 500; max = 1500; // 0.5-1.5 segundos
                break;
            case 'digitando':
                min = 1000; max = 3000; // 1-3 segundos (reduzido)
                break;
            default:
                min = 1000; max = 3000; // 1-3 segundos (reduzido)
        }

        // Adicionar variação baseada no histórico do usuário
        if (userId && this.precisaDelayMaior(userId)) {
            min += 1000; // Reduzido de 3000
            max += 2000; // Reduzido de 8000
        }

        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        console.log(`⏳ Delay ${tipo}: ${delay}ms para evitar detecção`);
        
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    // Verifica se usuário precisa de delay maior (muitas mensagens recentes)
    precisaDelayMaior(userId) {
        const contador = this.contadorMensagens.get(userId) || 0;
        const ultimaInteracao = this.ultimaInteracao.get(userId) || 0;
        const agora = Date.now();
        
        // Se enviou muitas mensagens recentemente
        if (contador > 10 && (agora - ultimaInteracao) < 300000) { // 5 minutos
            return true;
        }
        
        return false;
    }

    // Simular "digitando" para humanizar
    async simularDigitando(client, chatId, duracao = null) {
        try {
            if (!duracao) {
                duracao = Math.floor(Math.random() * 5000) + 2000; // 2-7 segundos
            }
            
            console.log(`⌨️ Simulando digitação por ${duracao}ms`);
            
            // Enviar indicador de digitação se disponível
            if (client.startTyping) {
                await client.startTyping(chatId);
                await new Promise(resolve => setTimeout(resolve, duracao));
                await client.stopTyping(chatId);
            } else {
                // Delay simples se não tiver função de digitação
                await new Promise(resolve => setTimeout(resolve, duracao));
            }
        } catch (error) {
            console.log('⚠️ Erro ao simular digitação:', error.message);
            // Fallback para delay simples
            await new Promise(resolve => setTimeout(resolve, duracao || 3000));
        }
    }

    // Verificar se está em horário suspeito (muito cedo/tarde)
    isHorarioSuspeito() {
        const agora = new Date();
        const hora = agora.getHours();
        
        // Entre 23h e 6h é considerado suspeito para bot comercial
        return hora >= 23 || hora <= 6;
    }

    // Adicionar variação natural nas respostas
    adicionarVariacaoNatural(mensagem) {
        const variacoes = {
            'Olá': ['Olá', 'Oi', 'Oi!', 'Olá!', 'E aí'],
            'Tudo bem?': ['Tudo bem?', 'Como vai?', 'Tudo certo?', 'Beleza?'],
            'Obrigado': ['Obrigado', 'Obrigado!', 'Valeu', 'Valeu!', 'Brigadão'],
            'Por favor': ['Por favor', 'Por favor,', 'Se possível', 'Se puder']
        };

        for (const [original, opcoes] of Object.entries(variacoes)) {
            if (mensagem.includes(original)) {
                const novaOpcao = opcoes[Math.floor(Math.random() * opcoes.length)];
                mensagem = mensagem.replace(original, novaOpcao);
                break;
            }
        }

        return mensagem;
    }

    // Registrar atividade do usuário
    registrarAtividade(userId) {
        const agora = Date.now();
        this.ultimaInteracao.set(userId, agora);
        
        const contador = this.contadorMensagens.get(userId) || 0;
        this.contadorMensagens.set(userId, contador + 1);
        
        // Registrar horário de atividade
        if (!this.horariosAtivos.has(userId)) {
            this.horariosAtivos.set(userId, []);
        }
        this.horariosAtivos.get(userId).push(agora);
    }

    // Delay inteligente baseado na conversa
    async delayInteligente(tipo, userId, contexto = {}) {
        await this.registrarAtividade(userId);
        
        // Delay maior em horário suspeito
        if (this.isHorarioSuspeito()) {
            await this.delayAleatorio('transicao_etapa', userId);
        }
        
        // Delay específico por tipo
        await this.delayAleatorio(tipo, userId);
        
        // Simular digitação para mensagens longas
        if (contexto.mensagemLonga) {
            await this.simularDigitando(contexto.client, contexto.chatId);
        }
    }

    // Verificar se deve pausar por suspeita de bot
    deveAguardar(userId) {
        const contador = this.contadorMensagens.get(userId) || 0;
        const ultimaInteracao = this.ultimaInteracao.get(userId) || 0;
        const agora = Date.now();
        
        // Pausar se muitas mensagens em pouco tempo
        if (contador > 15 && (agora - ultimaInteracao) < 600000) { // 10 minutos
            console.log(`🛡️ Ativando proteção anti-bot para usuário ${userId}`);
            return true;
        }
        
        return false;
    }

    // Gerar ID único para rastreamento
    gerarIdRastreamento() {
        return crypto.randomBytes(8).toString('hex');
    }

    // Delay para envio de arquivos (mais crítico)
    async delayEnvioArquivo(userId) {
        await this.delayAleatorio('envio_arquivo', userId);
        
        // Delay adicional para arquivos grandes como PDF
        const delayExtra = Math.floor(Math.random() * 5000) + 3000; // 3-8 segundos
        console.log(`📄 Delay extra para arquivo: ${delayExtra}ms`);
        await new Promise(resolve => setTimeout(resolve, delayExtra));
    }

    // Distribuir mensagens ao longo do tempo
    async distribuirMensagens(mensagens, client, chatId, userId) {
        for (let i = 0; i < mensagens.length; i++) {
            const mensagem = mensagens[i];
            
            // Simular digitação antes de cada mensagem
            await this.simularDigitando(client, chatId);
            
            // Adicionar variação natural
            const mensagemVariada = this.adicionarVariacaoNatural(mensagem);
            
            // Enviar mensagem
            await client.sendText(chatId, mensagemVariada);
            
            // Delay entre mensagens (exceto a última)
            if (i < mensagens.length - 1) {
                await this.delayAleatorio('resposta_rapida', userId);
            }
        }
    }
}

// Instância global para usar em todo o projeto
const protecao = new ProtecaoAntiBot();

module.exports = {  
    protecao,
    ProtecaoAntiBot
};
