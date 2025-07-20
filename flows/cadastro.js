const { getEstado, setEstado, limparEstado } = require("../utils/estados");

const mensagens = {
  boasVindas:
    "Olá! 👋\n\nSou o assistente virtual do Dr. Igor Rodrigues e vou te ajudar no cadastro.\n\n" +
    "💡 *Dica importante:* Digite *cancelar* a qualquer momento para encerrar a conversa.\n\n" +
    "Digite *Sim* para começar ou *Cancelar* para sair.",
  nome: "1️⃣ Qual é o seu nome completo?\n\n_Digite 'cancelar' para sair a qualquer momento._",
  cpf: "2️⃣ Por favor, me informe seu CPF (apenas números):\n\n_Digite 'cancelar' para sair a qualquer momento._",
  nascimento:
    "3️⃣ Informe sua data de nascimento (DD/MM/AAAA):\n\n_Digite 'cancelar' para sair a qualquer momento._",
  telefone:
    "4️⃣ Informe seu número de telefone com DDD:\n\n_Digite 'cancelar' para sair a qualquer momento._",
  email:
    "5️⃣ Informe seu e-mail:\n\n_Digite 'cancelar' para sair a qualquer momento._",
  confirmacao: (dados) => {
    return (
      `📋 *CONFIRMAÇÃO DOS DADOS*\n\n` +
      `👤 *Nome:* ${dados.nome}\n` +
      `🆔 *CPF:* ${dados.cpf}\n` +
      `📅 *Nascimento:* ${dados.nascimento}\n` +
      `📱 *Telefone:* ${dados.telefone}\n` +
      `📧 *E-mail:* ${dados.email}\n\n` +
      `❓ *Os dados estão corretos?*\n\n` +
      `Digite:\n` +
      `✅ *SIM* - para continuar\n` +
      `❌ *NÃO* - para corrigir\n` +
      `🚫 *cancelar* - para sair`
    );
  },
  corrigirDados:
    `🔄 *Vamos corrigir seus dados!*\n\n` +
    `Qual dado você gostaria de alterar?\n\n` +
    `Digite:\n` +
    `1️⃣ *nome* - para alterar o nome\n` +
    `2️⃣ *cpf* - para alterar o CPF\n` +
    `3️⃣ *nascimento* - para alterar a data\n` +
    `4️⃣ *telefone* - para alterar o telefone\n` +
    `5️⃣ *email* - para alterar o e-mail\n` +
    `🔄 *tudo* - para refazer tudo do início`,
};

async function fluxoCadastro(client, msg) {
  const id = msg.from;
  const userMessage = (msg.body || "").trim().toLowerCase();
  let estado = getEstado(id);

  // Não precisa mais verificar "cancelar" aqui pois é tratado globalmente no whatsapp.js

  if (!estado) {
    setEstado(id, { etapa: "confirmar_inicio" });
    await client.sendText(id, mensagens.boasVindas);
    return;
  }

  switch (estado.etapa) {
    case "confirmar_inicio":
      if (["sim", "s"].includes(userMessage)) {
        estado.etapa = "nome";
        setEstado(id, estado);
        await client.sendText(id, mensagens.nome);
      } else {
        limparEstado(id);
        await client.sendText(
          id,
          "Tudo bem. Quando quiser começar, é só mandar mensagem!"
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
      if (!/^\d{11}$/.test(msg.body || "")) {
        await client.sendText(id, "CPF inválido. Digite os 11 números.");
        return;
      }
      estado.cpf = msg.body || "";
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
      if (!/^\d{10,11}$/.test(msg.body || "")) {
        await client.sendText(id, "Número inválido. Use DDD + número.");
        return;
      }
      estado.telefone = msg.body || "";
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
        await client.sendText(id, "6️⃣ Informe seu *CEP* (somente números):");
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
          "Por favor, responda com *SIM* para confirmar ou *NÃO* para corrigir."
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
