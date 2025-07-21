const { getEstado, setEstado, limparEstado } = require("../utils/estados");

const mensagens = {
  boasVindas:
    "Olá! 👋\n\nSou o assistente virtual do Dr. Igor Rodrigues e vou te ajudar no cadastro.\n\n" +
    "💡 *Dica importante:* Digite *cancelar* a qualquer momento para encerrar a conversa.\n\n" +
    "Digite *Sim* para começar ou *Cancelar* para sair.",
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
      `👉 Sim ou Não`
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
