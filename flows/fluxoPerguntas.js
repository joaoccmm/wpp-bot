const { getEstado, setEstado, limparEstado } = require("../utils/estados");
const { salvarNoSheets } = require("../google/sheets");
const { protecao } = require("../utils/protecaoAntiBot");
const { protecaoSimples } = require("../utils/protecaoSimples");
const { enviarMensagemRobusta } = require("../utils/envioRobusto");
const path = require("path");
const fs = require("fs");

// Função para enviar mensagem com proteção anti-bot (versão simplificada)
async function enviarMensagemSegura(client, id, mensagem, tipo = "normal") {
  try {
    console.log(
      `📤 [DEBUG] Enviando mensagem para ${id}: ${mensagem.substring(0, 50)}...`
    );

    // Delay simples de 1-2 segundos
    const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2 segundos
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Enviar mensagem diretamente
    await client.sendText(id, mensagem);

    console.log(`✅ [DEBUG] Mensagem enviada com sucesso para ${id}`);
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao enviar mensagem para ${id}:`, error);
    throw error;
  }
}

// Função helper para envio mais simples
async function enviarComSeguranca(client, id, mensagem) {
  console.log(`📤 Enviando: ${mensagem.substring(0, 100)}...`);
  
  // Delay de 1.5 segundos fixo
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    await client.sendText(id, mensagem);
    console.log(`✅ Mensagem enviada com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem:`, error);
    throw error;
  }
}

// Estrutura de mensagens limpa - pronta para nova configuração
const mensagens = {
  inicio:
    "📝 *Terceira Etapa - Questionário Final*\n\n" +
    "Agora vamos fazer algumas perguntas para finalizar seu cadastro.\n\n" +
    "💡 Digite *cancelar* a qualquer momento para sair.",
  
  // ESTRUTURA LIMPA - PRONTA PARA NOVAS PERGUNTAS
  // Adicione aqui as novas perguntas do formulário reestruturado
  
  // Mensagens finais
  final: "✅ *Cadastro Finalizado!*\n\nSuas informações foram registradas com sucesso.\n\nEntraremos em contato em breve!"
};

// Função principal do fluxo de perguntas - estrutura limpa
async function fluxoPerguntas(client, msg) {
  const id = msg.from;
  const userRaw = msg.body.trim();
  const userMessage = userRaw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const estado = getEstado(id);

  console.log(
    `🎯 FluxoPerguntas - ID: ${id}, Mensagem: "${userMessage}", Etapa atual: ${estado?.etapa3}`
  );

  if (!estado?.etapa3) {
    console.error("[fluxoPerguntas] estado ou etapa3 indefinido!");
    return;
  }

  const etapa3 = estado.etapa3.trim().toLowerCase();

  // Função helper para avançar entre etapas
  const avancar = async (proximaEtapa, mensagem) => {
    console.log(`🔄 Avançando de "${etapa3}" para "${proximaEtapa}"`);
    estado.etapa3 = proximaEtapa;
    setEstado(id, estado);
    console.log(`📤 Enviando mensagem: "${mensagem.substring(0, 50)}..."`);
    await enviarComSeguranca(client, id, mensagem);
    console.log(`✅ Função avancar concluída para etapa "${proximaEtapa}"`);
  };

  switch (etapa3) {
    case "inicio":
      // Enviar mensagem introdutória
      await enviarMensagemSegura(
        client,
        id,
        mensagens.inicio,
        "inicio_conversa"
      );
      
      // Finalizar por enquanto (até reestruturação)
      await client.sendText(
        id,
        "⚠️ *Formulário em reestruturação*\n\n" +
        "Nossa equipe está melhorando o questionário.\n" +
        "Em breve entraremos em contato para finalizar seu cadastro.\n\n" +
        "Obrigado pela paciência! 🙏"
      );
      
      // Salvar dados básicos e limpar estado
      await salvarDadosCompletos(client, id, estado);
      limparEstado(id);
      break;

    // ADICIONE AQUI AS NOVAS ETAPAS DO FORMULÁRIO REESTRUTURADO
    
    default:
      console.log(`⚠️ Etapa não reconhecida: ${etapa3}`);
      await client.sendText(
        id,
        "❓ Não entendi sua resposta. Digite *cancelar* para sair ou aguarde instruções."
      );
      break;
  }
}

// Função para salvar dados completos
async function salvarDadosCompletos(client, id, estado) {
  console.log("🚀 Salvando dados completos diretamente");
  console.log(
    "📦 Estado completo antes do salvamento:",
    JSON.stringify(estado, null, 2)
  );

  try {
    // Preparar dados para salvamento
    const dadosParaSalvar = {
      timestamp: new Date().toISOString(),
      id: id,
      nome: estado.nome || "",
      cpf: estado.cpf || "",
      nascimento: estado.nascimento || "",
      telefone: estado.telefone || "",
      email: estado.email || "",
      cep: estado.cep || "",
      rua: estado.rua || "",
      numero: estado.numero || "",
      complemento: estado.complemento || "",
      bairro: estado.bairro || "",
      status: "formulário_em_reestruturação",
      observacoes: "Dados coletados durante período de reestruturação do questionário"
    };

    console.log("📊 Dados preparados:", dadosParaSalvar);

    // Salvar no Google Sheets
    await salvarNoSheets(dadosParaSalvar);
    console.log("✅ Dados salvos com sucesso no Google Sheets!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar dados:", error);
    throw error;
  }
}

module.exports = {
  fluxoPerguntas,
  mensagens,
  enviarComSeguranca,
};
