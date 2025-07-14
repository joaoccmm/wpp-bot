const { salvarNoSheets } = require("../google/sheets");
const { getEstado, setEstado, limparEstado } = require("../utils/estados");

const mensagens = {
  boasVindas:
    "Olá! 👋\n\n" +
    "Sou o assistente virtual do Dr. Igor Rodrigues e vou te acompanhar no cadastro para o processo da Holanda. 🇳🇱\n\n" +
    "Vamos passar por algumas perguntas simples e objetivas para coletar seus dados — é tudo bem rápido, e normalmente leva menos de *10 minutos* para concluir. ⏱️\n\n" +
    "Ah, e se em algum momento quiser parar, é só digitar *cancelar* que finalizamos o atendimento imediatamente. 😉\n\n" +
    "Podemos começar agora?\n\n" +
    "✅ *Sim*  |  ❌ *Não*",
  nome: "1️⃣ Qual é o seu nome completo?\n(Por favor, informe exatamente como está no seu documento mais recente.)",
  cpf: "2️⃣ Por favor, me informe seu CPF, apenas os dígitos.",
  nascimento:
    "3️⃣ Agora, me informe sua data de nascimento no formato DD/MM/AAAA.",
  telefone:
    "4️⃣ Qual é o seu número de telefone com DDD?\n(Exemplo: 33987654321)",
  email:
    "5️⃣ Me informe seu e-mail para contato.\n\nCaso não tenha um de fácil acesso, digite: não tenho.",
};

async function fluxoCadastro(client, msg) {
  const id = msg.from;
  const userMessage = msg.body.trim().toLowerCase();

  if (userMessage === "cancelar") {
    limparEstado(id);
    await client.sendText(
      id,
      "Cadastro cancelado. Digite qualquer coisa para começar de novo."
    );
    return;
  }

  let estado = getEstado(id);

  // Início do fluxo: ainda sem estado salvo
  if (!estado) {
    setEstado(id, { etapa: "confirmar_inicio" });
    await client.sendText(id, mensagens.boasVindas);
    return;
  }

  switch (estado.etapa) {
    case "confirmar_inicio":
      if (
        userMessage.includes("sim") ||
        userMessage === "s" ||
        userMessage === "ok"
      ) {
        estado.etapa = "nome";
        setEstado(id, estado);
        await client.sendText(id, mensagens.nome);
      } else if (
        userMessage.includes("não") ||
        userMessage.includes("nao") ||
        userMessage === "n"
      ) {
        limparEstado(id);
        await client.sendText(
          id,
          "Tudo bem! Quando quiser iniciar o cadastro, é só mandar uma mensagem. 👋"
        );
      } else {
        await client.sendText(
          id,
          "Por favor, responda com:\n✅ *Sim* – para iniciar o cadastro\n❌ *Não* – para encerrar"
        );
      }
      break;

    case "nome":
      estado.nome = msg.body;
      estado.etapa = "cpf";
      setEstado(id, estado);
      await client.sendText(id, mensagens.cpf);
      break;

    case "cpf":
      if (!/^\d{11}$/.test(msg.body)) {
        await client.sendText(
          id,
          "CPF inválido. Digite os 11 números sem pontos ou traços."
        );
        return;
      }
      estado.cpf = msg.body;
      estado.etapa = "nascimento";
      setEstado(id, estado);
      await client.sendText(id, mensagens.nascimento);
      break;

    case "nascimento":
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(msg.body)) {
        await client.sendText(id, "Data inválida. Use o formato DD/MM/AAAA.");
        return;
      }
      estado.nascimento = msg.body;
      estado.etapa = "telefone";
      setEstado(id, estado);
      await client.sendText(id, mensagens.telefone);
      break;

    case "telefone":
      if (!/^\d{10,11}$/.test(msg.body)) {
        await client.sendText(
          id,
          "Número inválido. Envie o número com DDD (Ex: 11987654321)."
        );
        return;
      }
      estado.telefone = msg.body;
      estado.etapa = "email";
      setEstado(id, estado);
      await client.sendText(id, mensagens.email);
      break;

    case "email":
      estado.email = msg.body;
      estado.etapa = "confirmacao_dados";
      setEstado(id, estado);

      const mensagemConfirmacao =
        `📋 *Confirmação de Dados – Etapa 1*\n\n` +
        `Por favor, verifique se os dados abaixo estão corretos:\n\n` +
        `*Nome:* ${estado.nome}\n` +
        `*Nascimento:* ${estado.nascimento}\n` +
        `*CPF:* ${estado.cpf}\n` +
        `*Telefone:* ${estado.telefone}\n` +
        `*E-mail:* ${estado.email}\n\n` +
        `Está tudo certo com as informações acima?\n\n` +
        `✅ *Sim*  |  ❌ *Não*`;

      await client.sendText(id, mensagemConfirmacao);
      break;

    case "confirmacao_dados":
      const confirmado =
        userMessage.includes("sim") ||
        userMessage.includes("s") ||
        userMessage.includes("confirmar") ||
        userMessage.includes("tudo certo");

      const naoConfirmado =
        userMessage.includes("não") ||
        userMessage.includes("nao") ||
        userMessage.includes("n") ||
        userMessage.includes("corrigir");

      if (confirmado) {
        try {
          estado.etapa = null;
          estado.etapaEndereco = "cep";
          setEstado(id, estado);

          await client.sendText(
            id,
            "✅ Primeira etapa finalizada com sucesso!\n\n📝 Agora vamos para a segunda etapa."
          );
          await client.sendText(
            id,
            "6️⃣ Informe seu *CEP* (somente os números):"
          );
        } catch (e) {
          console.error("Erro ao iniciar segunda etapa:", e);
          await client.sendText(
            id,
            "❌ Ocorreu um erro ao prosseguir. Tente novamente mais tarde."
          );
        }
      } else if (naoConfirmado) {
        limparEstado(id);
        await client.sendText(
          id,
          "Vamos começar novamente o cadastro. Por favor, informe seu nome completo:"
        );
        setEstado(id, { etapa: "nome" });
      } else {
        await client.sendText(
          id,
          "Por favor, responda com:\n\n✅ *Sim* – para confirmar os dados\n❌ *Não* – para corrigir"
        );
      }
      break;
  }
}

module.exports = fluxoCadastro;
