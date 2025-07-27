// Configuração de proteções anti-banimento para WhatsApp
const { protecao } = require("../utils/protecaoAntiBot");

// Configurações gerais de segurança
const CONFIG_SEGURANCA = {
  // Limites para evitar detecção
  MAX_MENSAGENS_POR_HORA: 50,
  MAX_MENSAGENS_RAPIDAS: 10,
  DELAY_MINIMO_ENTRE_MSGS: 2000, // 2 segundos

  // Horários considerados suspeitos (24h)
  HORARIO_SUSPEITO_INICIO: 23, // 23h
  HORARIO_SUSPEITO_FIM: 6, // 6h

  // Delays específicos (em milissegundos)
  DELAYS: {
    INICIO_CONVERSA: { min: 3000, max: 6000 },
    PERGUNTA_SENSIVEL: { min: 15000, max: 30000 },
    ENVIO_ARQUIVO: { min: 8000, max: 15000 },
    TRANSICAO_ETAPA: { min: 5000, max: 12000 },
    RESPOSTA_RAPIDA: { min: 1000, max: 3000 },
    DIGITANDO: { min: 3000, max: 8000 },
    CONTRATO: { min: 20000, max: 40000 }, // Extra longo para contratos
  },

  // Variações naturais nas mensagens
  VARIACOES_NATURAIS: {
    Olá: ["Olá", "Oi", "Oi!", "Olá!", "E aí", "Opa"],
    "Tudo bem?": [
      "Tudo bem?",
      "Como vai?",
      "Tudo certo?",
      "Beleza?",
      "Como está?",
    ],
    Obrigado: [
      "Obrigado",
      "Obrigado!",
      "Valeu",
      "Valeu!",
      "Brigadão",
      "Muito obrigado",
    ],
    "Por favor": [
      "Por favor",
      "Por favor,",
      "Se possível",
      "Se puder",
      "Por gentileza",
    ],
    Perfeito: ["Perfeito", "Ótimo", "Excelente", "Muito bom", "Perfeito!"],
    "Vamos continuar": [
      "Vamos continuar",
      "Continuando",
      "Próximo passo",
      "Agora vamos",
    ],
  },
};

// Função para inicializar as proteções
function inicializarProtecoes() {
  console.log("🛡️ Inicializando sistema de proteção anti-banimento...");

  // Verificar se estamos em ambiente de produção
  const isProducao =
    process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT;

  if (isProducao) {
    console.log("🚨 MODO PRODUÇÃO: Todas as proteções ativadas");
    // Aumentar delays em produção
    Object.keys(CONFIG_SEGURANCA.DELAYS).forEach((key) => {
      CONFIG_SEGURANCA.DELAYS[key].min *= 1.5;
      CONFIG_SEGURANCA.DELAYS[key].max *= 1.5;
    });
  } else {
    console.log("🔧 MODO DESENVOLVIMENTO: Proteções básicas ativadas");
  }

  // Configurar monitoramento
  setInterval(() => {
    const agora = new Date();
    const usuarios = protecao.contadorMensagens.size;
    console.log(
      `📊 Status proteção: ${usuarios} usuários ativos às ${agora.toLocaleTimeString()}`
    );
  }, 300000); // A cada 5 minutos

  console.log("✅ Sistema de proteção inicializado com sucesso");
}

// Função para verificar se o sistema está sobrecarregado
function verificarSobrecarga() {
  const totalMensagens = Array.from(protecao.contadorMensagens.values()).reduce(
    (total, count) => total + count,
    0
  );

  if (totalMensagens > CONFIG_SEGURANCA.MAX_MENSAGENS_POR_HORA) {
    console.log(
      "⚠️ ALERTA: Sistema com muitas mensagens, aplicando delays extras"
    );
    return true;
  }

  return false;
}

// Função para aplicar delay inteligente baseado no contexto
async function aplicarDelayContextual(tipo, userId, contexto = {}) {
  const config =
    CONFIG_SEGURANCA.DELAYS[tipo.toUpperCase()] ||
    CONFIG_SEGURANCA.DELAYS.RESPOSTA_RAPIDA;

  let { min, max } = config;

  // Aumentar delay se sistema sobrecarregado
  if (verificarSobrecarga()) {
    min *= 2;
    max *= 2;
  }

  // Aumentar delay em horário suspeito
  if (protecao.isHorarioSuspeito()) {
    min *= 1.5;
    max *= 1.5;
  }

  // Aumentar delay se usuário muito ativo
  if (protecao.precisaDelayMaior(userId)) {
    min *= 2;
    max *= 3;
  }

  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  console.log(`⏳ Delay contextual (${tipo}): ${delay}ms`);

  return new Promise((resolve) => setTimeout(resolve, delay));
}

// Função para criar relatório de atividade
function gerarRelatorioAtividade() {
  const agora = new Date();
  const relatorio = {
    timestamp: agora.toISOString(),
    usuarios_ativos: protecao.contadorMensagens.size,
    total_mensagens: Array.from(protecao.contadorMensagens.values()).reduce(
      (total, count) => total + count,
      0
    ),
    horario_suspeito: protecao.isHorarioSuspeito(),
    sistema_sobrecarregado: verificarSobrecarga(),
    environment: process.env.NODE_ENV || "development",
  };

  console.log("📊 Relatório de Atividade:", JSON.stringify(relatorio, null, 2));
  return relatorio;
}

// Middleware para aplicar proteções em todas as mensagens
async function middlewareProtecao(client, msg, proximaFuncao) {
  const userId = msg.from;

  try {
    // Verificar se usuário está sendo muito ativo
    if (protecao.deveAguardar(userId)) {
      console.log(`🛡️ Usuário ${userId} em cooldown - aplicando delay maior`);
      await aplicarDelayContextual("TRANSICAO_ETAPA", userId);
    }

    // Registrar atividade
    protecao.registrarAtividade(userId);

    // Executar função original
    await proximaFuncao();
  } catch (error) {
    console.error("❌ Erro no middleware de proteção:", error);
    throw error;
  }
}

// Exportar configurações e funções
module.exports = {
  CONFIG_SEGURANCA,
  inicializarProtecoes,
  verificarSobrecarga,
  aplicarDelayContextual,
  gerarRelatorioAtividade,
  middlewareProtecao,
  protecao,
};
