const { getEstado, setEstado, limparEstado } = require("../utils/estados");

const mensagens = {
  boasVindas:
    "Olá! 👋\n\nSou o assistente virtual do Dr. Igor Rodrigues e vou te ajudar no cadastro.\n\nDigite *Sim* para começar ou *Cancelar* para sair.",
  nome: "1️⃣ Qual é o seu nome completo?",
  cpf: "2️⃣ Por favor, me informe seu CPF (apenas números):",
  nascimento: "3️⃣ Informe sua data de nascimento (DD/MM/AAAA):",
  telefone: "4️⃣ Informe seu número de telefone com DDD:",
  email: "5️⃣ Informe seu e-mail:",
};

async function fluxoCadastro(client, msg) {
  const id = msg.from;
  const userMessage = (msg.body || "").trim().toLowerCase();
  let estado = getEstado(id);

  if (userMessage === "cancelar") {
    limparEstado(id);
    await client.sendText(
      id,
      "Cadastro cancelado. Digite qualquer coisa para recomeçar."
    );
    return;
  }

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
      estado.etapa = "endereco";
      estado.etapaEndereco = "cep"; // define início da etapa de endereço
      setEstado(id, estado);

      await client.sendText(
        id,
        "✅ Primeira etapa concluída!\n\nAgora vamos para o endereço."
      );
      await client.sendText(id, "6️⃣ Informe seu *CEP* (somente números):");
      break;

    default:
      await client.sendText(id, "Não entendi. Vamos começar de novo?");
      limparEstado(id);
      break;
  }
}

module.exports = fluxoCadastro;
