// Sistema de proteção anti-banimento para WhatsApp
const crypto = require("crypto");

class ProtecaoAntiBot {
  constructor() {
    this.ultimaInteracao = new Map();
    this.contadorMensagens = new Map();
    this.horariosAtivos = new Map();
    this.resetDiario();
  }

  resetDiario() {
    setInterval(() => {
      this.contadorMensagens.clear();
      this.horariosAtivos.clear();
      console.log("🔄 Reset diário das proteções anti-bot");
    }, 24 * 60 * 60 * 1000);
  }

  async delayAleatorio(tipo = "normal", userId = null) {
    let min, max;

    switch (tipo) {
      case "inicio_conversa":
        min = 1000;
        max = 3000;
        break;
      case "pergunta_sensivel":
        min = 3000;
        max = 8000;
        break;
      case "envio_arquivo":
        min = 5000;
        max = 10000;
        break;
      case "transicao_etapa":
        min = 2000;
        max = 5000;
        break;
      case "resposta_rapida":
        min = 500;
        max = 1500;
        break;
      case "digitando":
        min = 1000;
        max = 3000;
        break;
      default:
        min = 1000;
        max = 3000;
    }

    if (userId && this.precisaDelayMaior(userId)) {
      min += 1000;
      max += 2000;
    }

    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(`⏳ Delay ${tipo}: ${delay}ms para evitar detecção`);

    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  precisaDelayMaior(userId) {
    const contador = this.contadorMensagens.get(userId) || 0;
    const ultimaInteracao = this.ultimaInteracao.get(userId) || 0;
    const agora = Date.now();

    if (contador > 10 && agora - ultimaInteracao < 300000) {
      return true;
    }

    return false;
  }

  async simularDigitando(client, chatId, duracao = null) {
    try {
      if (!duracao) {
        duracao = Math.floor(Math.random() * 5000) + 2000;
      }

      console.log(`⌨️ Simulando digitação por ${duracao}ms`);

      if (client.startTyping) {
        await client.startTyping(chatId);
        await new Promise((resolve) => setTimeout(resolve, duracao));
        await client.stopTyping(chatId);
      } else {
        await new Promise((resolve) => setTimeout(resolve, duracao));
      }
    } catch (error) {
      console.log("⚠️ Erro ao simular digitação:", error.message);
      await new Promise((resolve) => setTimeout(resolve, duracao || 3000));
    }
  }

  isHorarioSuspeito() {
    const agora = new Date();
    const hora = agora.getHours();

    return hora >= 23 || hora <= 6;
  }

  adicionarVariacaoNatural(mensagem) {
    const variacoes = {
      Olá: ["Olá", "Oi", "Oi!", "Olá!", "E aí"],
      "Tudo bem?": ["Tudo bem?", "Como vai?", "Tudo certo?", "Beleza?"],
      Obrigado: ["Obrigado", "Obrigado!", "Valeu", "Valeu!", "Brigadão"],
      "Por favor": ["Por favor", "Por favor,", "Se possível", "Se puder"],
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

  registrarAtividade(userId) {
    const agora = Date.now();
    this.ultimaInteracao.set(userId, agora);

    const contador = this.contadorMensagens.get(userId) || 0;
    this.contadorMensagens.set(userId, contador + 1);

    if (!this.horariosAtivos.has(userId)) {
      this.horariosAtivos.set(userId, []);
    }
    this.horariosAtivos.get(userId).push(agora);
  }

  async delayInteligente(tipo, userId, contexto = {}) {
    await this.registrarAtividade(userId);

    if (this.isHorarioSuspeito()) {
      await this.delayAleatorio("transicao_etapa", userId);
    }

    await this.delayAleatorio(tipo, userId);

    if (contexto.mensagemLonga) {
      await this.simularDigitando(contexto.client, contexto.chatId);
    }
  }

  deveAguardar(userId) {
    const contador = this.contadorMensagens.get(userId) || 0;
    const ultimaInteracao = this.ultimaInteracao.get(userId) || 0;
    const agora = Date.now();

    if (contador > 15 && agora - ultimaInteracao < 600000) {
      console.log(`🛡️ Ativando proteção anti-bot para usuário ${userId}`);
      return true;
    }

    return false;
  }

  gerarIdRastreamento() {
    return crypto.randomBytes(8).toString("hex");
  }

  async delayEnvioArquivo(userId) {
    await this.delayAleatorio("envio_arquivo", userId);

    const delayExtra = Math.floor(Math.random() * 5000) + 3000;
    console.log(`📄 Delay extra para arquivo: ${delayExtra}ms`);
    await new Promise((resolve) => setTimeout(resolve, delayExtra));
  }

  async distribuirMensagens(mensagens, client, chatId, userId) {
    for (let i = 0; i < mensagens.length; i++) {
      const mensagem = mensagens[i];

      await this.simularDigitando(client, chatId);

      const mensagemVariada = this.adicionarVariacaoNatural(mensagem);

      await client.sendText(chatId, mensagemVariada);

      if (i < mensagens.length - 1) {
        await this.delayAleatorio("resposta_rapida", userId);
      }
    }
  }
}

const protecao = new ProtecaoAntiBot();

module.exports = {
  protecao,
  ProtecaoAntiBot,
};
