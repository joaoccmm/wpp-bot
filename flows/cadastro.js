const { getEstado, setEstado, limparEstado } = require("../utils/estados");
const { protecao } = require("../utils/protecaoAntiBot");

// Helper para enviar mensagens com log e proteção anti-bot
async function sendMessage(client, id, message, tipo = "normal") {
  try {
    console.log(
      `📤 Enviando para ${id}: ${message.substring(0, 100)}${
        message.length > 100 ? "..." : ""
      }`
    );

    // Aplicar proteções anti-bot
    await protecao.delayInteligente(tipo, id, {
      client,
      chatId: id,
      mensagemLonga: message.length > 100,
    });

    // Simular digitação
    await protecao.simularDigitando(client, id);

    // Adicionar variação natural
    const mensagemVariada = protecao.adicionarVariacaoNatural(message);

    await client.sendText(id, mensagemVariada);

    // Registrar atividade
    protecao.registrarAtividade(id);

    console.log(`✅ Mensagem enviada com sucesso com proteção anti-bot`);
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem para ${id}:`, error);
    throw error;
  }
}

const mensagens = {
  saudacaoInicial:
    "👋 *Olá!*\n\n" +
    "Sou a assistente virtual do Dr. Igor, responsável por realizar seu cadastro no processo jurídico relacionado à Holanda.\n\n" +
    "Este procedimento leva entre 10 e 15 minutos e é fundamental para dar continuidade ao seu atendimento.\n\n" +
    "Caso você esteja respondendo por outra pessoa, por favor, responda com base nos dados e vivências dela.\n\n" +
    "💡 Dica: Digite *cancelar* a qualquer momento para encerrar.\n\n" +
    "Vamos começar?\n👉 *Sim* ou *Não*",

  maiorIdade: "Você é maior de idade (18 anos ou mais)?\n👉 Sim ou Não",

  incapacidade:
    "Você está respondendo por uma pessoa considerada *incapaz* ou que possua alguma *dificuldade que comprometa seu entendimento ou comunicação*?\n👉 Sim ou Não",

  // Perguntas básicas do cadastro
  nome: "1️⃣ Qual é o seu nome completo?",
  cpf: "2️⃣ Por favor, me informe seu CPF:",
  nascimento: "3️⃣ Informe sua data de nascimento (DD/MM/AAAA):",
  telefone: "4️⃣ Informe seu número de telefone com DDD:",
  email: "5️⃣ Informe seu e-mail:",

  confirmacao: (dados) => {
    return (
      `📋 *CONFIRMAÇÃO DOS DADOS*\n\n` +
      `👤 *Nome:* ${dados.nome}\n` +
      `🆔 *CPF:* ${dados.cpf}\n` +
      `📅 *Nascimento:* ${dados.nascimento}\n` +
      `📱 *Telefone:* ${dados.telefone}\n` +
      `📧 *E-mail:* ${dados.email}\n\n` +
      `❓ *Os dados estão corretos?*\n\n` +
      `👉 Digite *Sim* para confirmar ou *Não* para corrigir`
    );
  },

  // Mensagem de correção simplificada
  corrigirDados:
    `🔄 *Vamos corrigir seus dados!*\n\n` +
    `Digite o nome do campo que deseja alterar:\n\n` +
    `• *nome* - para alterar o nome\n` +
    `• *cpf* - para alterar o CPF\n` +
    `• *nascimento* - para alterar a data\n` +
    `• *telefone* - para alterar o telefone\n` +
    `• *email* - para alterar o e-mail\n` +
    `• *tudo* - para refazer tudo do início`,
};

async function fluxoCadastro(client, msg) {
  const id = msg.from;
  const userMessage = (msg.body || "").trim().toLowerCase();
  let estado = getEstado(id);

  // Não precisa mais verificar "cancelar" aqui pois é tratado globalmente no whatsapp.js

  if (!estado) {
    setEstado(id, { etapa: "confirmar_inicio" });
    // Enviar mensagem unificada de saudação e pergunta inicial
    await sendMessage(client, id, mensagens.saudacaoInicial, "inicio_conversa");
    return;
  }

  switch (estado.etapa) {
    case "confirmar_inicio":
      if (
        ["sim", "s", "ok", "começar", "comecar", "iniciar"].includes(
          userMessage
        )
      ) {
        estado.etapa = "verificar_maioridade";
        setEstado(id, estado);
        await sendMessage(client, id, mensagens.maiorIdade);
      } else if (
        ["cancelar", "não", "nao", "n", "sair"].includes(userMessage)
      ) {
        limparEstado(id);
        await sendMessage(
          client,
          id,
          "✅ Tudo bem! Quando quiser começar, é só mandar mensagem!"
        );
      } else {
        await sendMessage(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* para começar o cadastro\n• *CANCELAR* para sair"
        );
      }
      break;

    case "verificar_maioridade":
      if (["sim", "s", "ok", "maior", "18"].includes(userMessage)) {
        estado.maiorIdade = true;
        estado.etapa = "verificar_incapacidade";
        setEstado(id, estado);
        await sendMessage(client, id, mensagens.incapacidade);
      } else if (
        ["não", "nao", "n", "menor", "não sou"].includes(userMessage)
      ) {
        estado.maiorIdade = false;
        limparEstado(id);
        await sendMessage(
          client,
          id,
          "📞 *Obrigado pela informação!*\n\nEm casos de menor de idade, alguém da nossa equipe entrará em contato diretamente para orientações específicas.\n\nAguarde nosso contato! 😊"
        );
      } else {
        await sendMessage(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se você tem 18 anos ou mais\n• *NÃO* se você é menor de idade"
        );
      }
      break;

    case "verificar_incapacidade":
      if (["sim", "s", "ok", "incapaz", "dificuldade"].includes(userMessage)) {
        estado.incapacidade = true;
        limparEstado(id);
        await sendMessage(
          client,
          id,
          "📞 *Obrigado pela informação!*\n\nEm casos de incapacidade ou dificuldades de entendimento/comunicação, alguém da nossa equipe entrará em contato diretamente para orientações específicas.\n\nAguarde nosso contato! 😊"
        );
      } else if (["não", "nao", "n", "capaz", "normal"].includes(userMessage)) {
        estado.incapacidade = false;
        estado.etapa = "nome";
        setEstado(id, estado);
        await sendMessage(client, id, mensagens.nome);
      } else {
        await sendMessage(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se está respondendo por pessoa incapaz ou com dificuldades\n• *NÃO* se a pessoa tem plena capacidade"
        );
      }
      break;

    case "nome":
      estado.nome = (msg.body || "").trim();
      estado.etapa = "cpf";
      setEstado(id, estado);
      await client.sendText(id, mensagens.cpf);
      break;

    case "cpf":
      const cpfInput = msg.body || "";
      // Remover pontos e hífen para validação
      const cpfLimpo = cpfInput.replace(/[.-]/g, "");

      // Validar se tem 11 dígitos após limpeza
      if (!/^\d{11}$/.test(cpfLimpo)) {
        await client.sendText(
          id,
          "CPF inválido. Digite 11 números ou no formato xxx.xxx.xxx-xx"
        );
        return;
      }

      // Salvar CPF limpo (apenas números)
      estado.cpf = cpfLimpo;
      estado.etapa = "nascimento";
      setEstado(id, estado);
      await client.sendText(id, mensagens.nascimento);
      break;

    case "nascimento":
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(msg.body || "")) {
        await client.sendText(id, "Data inválida. Use o formato DD/MM/AAAA.");
        return;
      }
      estado.nascimento = msg.body || "";
      estado.etapa = "telefone";
      setEstado(id, estado);
      await client.sendText(id, mensagens.telefone);
      break;

    case "telefone":
      const telefoneInput = msg.body || "";
      // Remover espaços, traços e parênteses para validação
      const telefoneLimpo = telefoneInput.replace(/[\s\-\(\)]/g, "");

      // Validar se tem 10 ou 11 dígitos após limpeza
      if (!/^\d{10,11}$/.test(telefoneLimpo)) {
        await client.sendText(
          id,
          "Número inválido. Use DDD + número (10 ou 11 dígitos).\n\n*Exemplos:*\n• 11987654321\n• 11 9876-5432\n• 11 9876 5432"
        );
        return;
      }

      // Salvar telefone limpo (apenas números)
      estado.telefone = telefoneLimpo;
      estado.etapa = "email";
      setEstado(id, estado);
      await client.sendText(id, mensagens.email);
      break;

    case "email":
      estado.email = (msg.body || "").trim();
      estado.etapa = "confirmar_dados";
      setEstado(id, estado);

      // Mostrar resumo dos dados para confirmação
      await client.sendText(id, mensagens.confirmacao(estado));
      break;

    case "confirmar_dados":
      if (["sim", "s", "ok", "correto", "certo"].includes(userMessage)) {
        // Dados confirmados, prosseguir para endereço
        estado.etapa = "endereco";
        estado.etapaEndereco = "cep";
        setEstado(id, estado);

        await client.sendText(
          id,
          "✅ *Dados confirmados!*\n\nAgora vamos para a segunda etapa: *endereço*."
        );
        await client.sendText(
          id,
          "6️⃣ Informe seu *CEP* (formato: 12345-678 ou 12345678):"
        );
      } else if (
        ["não", "nao", "n", "errado", "incorreto"].includes(userMessage)
      ) {
        // Solicitar correção
        estado.etapa = "escolher_correcao";
        setEstado(id, estado);
        await client.sendText(id, mensagens.corrigirDados);
      } else {
        await client.sendText(
          id,
          "❓ Por favor, responda com:\n\n" +
            "• *SIM* para confirmar os dados\n" +
            "• *NÃO* para fazer correções\n\n" +
            "_Você também pode usar: S, Sim, N, Não, Nao_"
        );
      }
      break;

    case "escolher_correcao":
      switch (userMessage) {
        case "nome":
        case "1":
          estado.etapa = "nome";
          setEstado(id, estado);
          await client.sendText(id, `🔄 ${mensagens.nome}`);
          break;

        case "cpf":
        case "2":
          estado.etapa = "cpf";
          setEstado(id, estado);
          await client.sendText(id, `🔄 ${mensagens.cpf}`);
          break;

        case "nascimento":
        case "data":
        case "3":
          estado.etapa = "nascimento";
          setEstado(id, estado);
          await client.sendText(id, `🔄 ${mensagens.nascimento}`);
          break;

        case "telefone":
        case "fone":
        case "4":
          estado.etapa = "telefone";
          setEstado(id, estado);
          await client.sendText(id, `🔄 ${mensagens.telefone}`);
          break;

        case "email":
        case "e-mail":
        case "5":
          estado.etapa = "email";
          setEstado(id, estado);
          await client.sendText(id, `🔄 ${mensagens.email}`);
          break;

        case "tudo":
        case "todos":
        case "recomeçar":
        case "recomeco":
          // Limpar dados mas manter na primeira etapa
          estado = { etapa: "nome" };
          setEstado(id, estado);
          await client.sendText(
            id,
            "🔄 *Vamos recomeçar!*\n\n" + mensagens.nome
          );
          break;

        default:
          await client.sendText(
            id,
            "❌ Opção inválida.\n\n" + mensagens.corrigirDados
          );
      }
      break;

    default:
      await client.sendText(id, "Não entendi. Vamos começar de novo?");
      limparEstado(id);
      break;
  }
}

module.exports = fluxoCadastro;
