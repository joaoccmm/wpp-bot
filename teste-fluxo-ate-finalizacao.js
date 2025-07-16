// Teste completo seguindo o fluxo até a finalização

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    // Detectar mensagem de finalização
    if (
      msg.includes("salvos com sucesso") ||
      msg.includes("entraremos em contato")
    ) {
      console.log("🚨 MENSAGEM DE FINALIZAÇÃO DETECTADA:");
      console.log(`📱 ${msg}\n`);
      console.log("🎯 Esta é a mensagem que aparece na imagem!");
    } else {
      console.log(
        `📱 Bot: ${msg.substring(0, 80)}${msg.length > 80 ? "..." : ""}\n`
      );
    }
    return Promise.resolve();
  },
};

async function fluxoCompletoAteFinalizacao() {
  console.log("🔍 TESTE COMPLETO - SEGUIR FLUXO ATÉ FINALIZAÇÃO\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  const respostas = [
    { etapa: "pergunta5", resposta: "não", desc: "Transtorno psiquiátrico" },
    { etapa: "pergunta9", resposta: "não", desc: "Diagnóstico psiquiátrico" },
    { etapa: "pergunta12", resposta: "não", desc: "Perdas em propriedade" },
    { etapa: "pergunta14", resposta: "não", desc: "Mudança de casa" },
    { etapa: "pergunta19", resposta: "não", desc: "Perda fonte de alimento" },
    { etapa: "pergunta20", resposta: "não", desc: "Renda afetada" },
    { etapa: "pergunta21", resposta: "não", desc: "Energia afetada" },
    { etapa: "pergunta22", resposta: "não", desc: "Uso de rio/mar afetado" },
    { etapa: "pergunta23", resposta: "não", desc: "Uso da terra afetado" },
    {
      etapa: "pergunta24",
      resposta: "não",
      desc: "Recursos hídricos afetados",
    },
    { etapa: "pergunta25", resposta: "não", desc: "Terra afetada novamente" },
    {
      etapa: "pergunta26",
      resposta: "não",
      desc: "Outros prejuízos materiais",
    },
    { etapa: "pergunta27", resposta: "a", desc: "Indenização recebida" },
    {
      etapa: "pergunta28",
      resposta: "não",
      desc: "Iniciativas de repactuação",
    },
    { etapa: "pergunta29", resposta: "não", desc: "Morador de Bento/Paracatu" },
    {
      etapa: "pergunta30",
      resposta: "não",
      desc: "Compensação não financeira",
    },
    { etapa: "pergunta30_1", resposta: "não", desc: "Cadastro compensação" },
    { etapa: "pergunta30_2", resposta: "não", desc: "Contato compensação" },
    { etapa: "pergunta31", resposta: "Igor", desc: "Quem indicou" },
  ];

  try {
    // Configurar estado inicial
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta5",
      nome: "Usuário Teste",
      telefone: "11999999999",
      email: "teste@email.com",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
    });

    console.log("📋 Iniciando fluxo sequencial...\n");

    for (let i = 0; i < respostas.length; i++) {
      const resposta = respostas[i];

      const estadoAtual = getEstado(userId);
      if (!estadoAtual) {
        console.log(`❌ FINALIZOU PREMATURAMENTE na resposta ${i + 1}!`);
        console.log(
          `📍 Última etapa processada: ${
            i > 0 ? respostas[i - 1].desc : "inicial"
          }`
        );
        console.log(`🎯 Estava tentando processar: ${resposta.desc}`);
        break;
      }

      console.log(
        `🔸 ${i + 1}. ${resposta.desc} (${estadoAtual.etapa3}) → "${
          resposta.resposta
        }"`
      );

      await fluxoPerguntas(mockClient, {
        from: userId,
        body: resposta.resposta,
      });

      const novoEstado = getEstado(userId);
      if (!novoEstado) {
        console.log(
          `🏁 FLUXO FINALIZADO após resposta ${i + 1}: ${resposta.desc}\n`
        );
        console.log(
          "🎯 Esta deve ser a etapa onde aparece a mensagem da imagem!"
        );
        break;
      }

      console.log(`   ✓ Nova etapa: ${novoEstado.etapa3}\n`);

      // Parar se chegou na pergunta 31 (última)
      if (novoEstado.etapa3 === "final" || !novoEstado.etapa3) {
        console.log("🏁 FLUXO COMPLETADO NATURALMENTE");
        break;
      }
    }
  } catch (error) {
    console.error("❌ ERRO:", error.message);
  }

  // Tentar limpar se ainda existir
  if (getEstado(userId)) {
    limparEstado(userId);
  }
}

fluxoCompletoAteFinalizacao().catch(console.error);
