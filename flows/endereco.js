const { getEstado, setEstado } = require("../utils/estados");
const fluxoPerguntas = require("./fluxoPerguntas"); // <-- Importa a etapa 3

const mensagensEndereco = {
  cep: "6️⃣ Informe seu *CEP* (somente números):",
  rua: "7️⃣ Informe o *nome da rua* ou *logradouro*:",
  numero: "8️⃣ Informe o *número* da residência:",
  complemento: "9️⃣ Informe o *complemento* (ou digite 'nenhum'):",
  bairro: "🔟 Informe o *bairro*:",
  confirmacao: (estado) =>
    `📦 *Confirmação de Endereço*\n\n` +
    `*CEP:* ${estado.cep}\n` +
    `*Rua:* ${estado.rua}, Nº ${estado.numero}\n` +
    `*Complemento:* ${estado.complemento}\n` +
    `*Bairro:* ${estado.bairro}\n\n` +
    `Essas informações estão corretas?\n\n✅ *Sim*  |  ❌ *Não*`,
};

async function fluxoEndereco(client, msg) {
  const id = msg.from;
  const userMessage = msg.body.trim();
  let estado = getEstado(id);

  if (!estado || !estado.etapaEndereco) return;

  switch (estado.etapaEndereco) {
    case "cep":
      if (!/^\d{8}$/.test(userMessage)) {
        await client.sendText(
          id,
          "❌ CEP inválido. Envie os 8 dígitos do CEP."
        );
        return;
      }
      estado.cep = userMessage;
      estado.etapaEndereco = "rua";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.rua);
      break;

    case "rua":
      estado.rua = userMessage;
      estado.etapaEndereco = "numero";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.numero);
      break;

    case "numero":
      estado.numero = userMessage;
      estado.etapaEndereco = "complemento";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.complemento);
      break;

    case "complemento":
      estado.complemento = userMessage === "" ? "nenhum" : userMessage;
      estado.etapaEndereco = "bairro";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.bairro);
      break;

    case "bairro":
      estado.bairro = userMessage;
      estado.etapaEndereco = "confirmarEndereco";
      setEstado(id, estado);
      await client.sendText(id, mensagensEndereco.confirmacao(estado));
      break;

    case "confirmarEndereco":
      if (/^(sim|✅)$/i.test(userMessage)) {
        estado.etapaEndereco = null;
        estado.etapa3 = "inicio";
        setEstado(id, estado);

        await client.sendText(
          id,
          "📨 Perfeito! Agora vamos para a *terceira e última etapa* do seu cadastro."
        );

        // Inicia a terceira etapa imediatamente
        await fluxoPerguntas(client, { ...msg, body: "" });
      } else if (/^(não|nao|❌)$/i.test(userMessage)) {
        await client.sendText(
          id,
          "🔁 Vamos reiniciar o preenchimento do endereço."
        );
        estado.etapaEndereco = "cep";
        setEstado(id, estado);
        await client.sendText(id, mensagensEndereco.cep);
      } else {
        await client.sendText(
          id,
          "Por favor, responda com ✅ *Sim* se os dados estiverem corretos ou ❌ *Não* para corrigir."
        );
      }
      break;
  }
}

module.exports = fluxoEndereco;
