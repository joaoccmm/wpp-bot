// Teste completo do fluxo baseado na imagem do WhatsApp

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { fluxoPerguntas } = require("./flows/fluxoPerguntas.js");

const mockClient = {
  sendText: async (id, msg) => {
    console.log(
      `📱 Bot enviou: ${msg.substring(0, 100)}${
        msg.length > 100 ? "..." : ""
      }\n`
    );
    return Promise.resolve();
  },
};

async function testarFluxoCompleto() {
  console.log("🧪 TESTE COMPLETO - REPRODUZINDO FLUXO DA IMAGEM\n");

  const userId = "5511999999999@c.us";

  // Limpar estado anterior
  limparEstado(userId);

  try {
    // Configurar usuário na pergunta 5 (início do fluxo da imagem)
    setEstado(userId, {
      etapa: "perguntas",
      etapa3: "pergunta5",
      nome: "João Teste",
      telefone: "11999999999",
      email: "joao@teste.com",
      pergunta1: "sim",
      pergunta2: "não",
      pergunta3: "não",
      pergunta4: "não",
    });

    console.log("📋 Simulando fluxo da imagem:");
    console.log("Pergunta 5: Transtorno psiquiátrico → Não");
    console.log("Pergunta 6: Perdas em propriedade → Não");
    console.log("Pergunta 7: Mudança de casa → Não\n");

    // Pergunta 5: Transtorno psiquiátrico - NÃO
    console.log("🔄 Pergunta 5: 'não'");
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    let estado = getEstado(userId);
    console.log(`   ✓ Etapa atual: ${estado?.etapa3}`);
    console.log(`   ✓ Resposta salva: ${estado?.pergunta5}\n`);

    // Pergunta 6: Perdas em propriedade - NÃO
    console.log("🔄 Pergunta 6: 'não'");
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    estado = getEstado(userId);
    console.log(`   ✓ Etapa atual: ${estado?.etapa3}`);
    console.log(`   ✓ Resposta salva: ${estado?.pergunta6}\n`);

    // Pergunta 7: Mudança de casa - NÃO
    console.log("🔄 Pergunta 7: 'não'");
    await fluxoPerguntas(mockClient, { from: userId, body: "não" });

    estado = getEstado(userId);
    console.log(`   ✓ Etapa atual: ${estado?.etapa3}`);
    console.log(`   ✓ Resposta salva: ${estado?.pergunta7}\n`);

    // Continuar até o final ou até encontrar erro
    let tentativas = 0;
    const maxTentativas = 20;

    while (
      estado?.etapa3 &&
      estado.etapa3 !== "final" &&
      tentativas < maxTentativas
    ) {
      tentativas++;
      console.log(`🔄 Continuando fluxo (tentativa ${tentativas})...`);

      // Simular resposta "não" para a próxima pergunta
      await fluxoPerguntas(mockClient, { from: userId, body: "não" });

      const novoEstado = getEstado(userId);

      if (!novoEstado) {
        console.log("❌ Estado foi limpo - fluxo finalizado");
        break;
      }

      if (novoEstado.etapa3 === estado.etapa3) {
        console.log(`⚠️  Pergunta rejeitada, tentando resposta alternativa...`);
        // Tentar outras respostas comuns
        const respostasAlternativas = ["sim", "a", "nenhum", "não se aplica"];

        for (const resp of respostasAlternativas) {
          await fluxoPerguntas(mockClient, { from: userId, body: resp });
          const estadoTeste = getEstado(userId);

          if (estadoTeste?.etapa3 !== estado.etapa3) {
            console.log(`   ✓ Resposta aceita: "${resp}"`);
            break;
          }
        }
      }

      estado = getEstado(userId);
      console.log(`   ✓ Nova etapa: ${estado?.etapa3}\n`);

      // Pequeno delay para evitar sobrecarga
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    if (tentativas >= maxTentativas) {
      console.log("⚠️  Limite de tentativas atingido");
    }

    console.log("📊 ESTADO FINAL:");
    console.log(`   - Etapa: ${estado?.etapa3}`);
    console.log(`   - Estado existe: ${!!estado}`);

    if (estado) {
      console.log("   - Perguntas respondidas:");
      for (let i = 1; i <= 21; i++) {
        const resposta = estado[`pergunta${i}`];
        if (resposta) {
          console.log(`     • Pergunta ${i}: ${resposta}`);
        }
      }
    }
  } catch (error) {
    console.error("❌ ERRO ENCONTRADO:");
    console.error(`   Tipo: ${error.name}`);
    console.error(`   Mensagem: ${error.message}`);
    console.error(`   Stack trace:`);
    console.error(error.stack);

    // Verificar estado do usuário no momento do erro
    const estadoErro = getEstado(userId);
    if (estadoErro) {
      console.log("\n📊 Estado no momento do erro:");
      console.log(`   - Etapa: ${estadoErro.etapa3}`);
      console.log(
        `   - Última pergunta: ${Object.keys(estadoErro)
          .filter((k) => k.startsWith("pergunta") && estadoErro[k])
          .pop()}`
      );
    }
  }

  // Limpar estado
  limparEstado(userId);
  console.log("\n🧹 Estado limpo");
}

testarFluxoCompleto().catch(console.error);
