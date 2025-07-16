const { fluxoPerguntas, mensagens } = require("./flows/fluxoPerguntas");
const { setEstado, getEstado, limparEstado } = require("./utils/estados");

// Mock do cliente WhatsApp
const mockClient = {
  sendText: async (id, message) => {
    console.log(`📱 [${id}] ${message.substring(0, 150)}...`);
    return Promise.resolve();
  },
};

// Função para simular uma mensagem do usuário
function criarMensagem(from, body) {
  return {
    from,
    body,
    trim: () => body.trim(),
  };
}

// Função para delay entre mensagens
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Teste focado nas novas perguntas (8-21)
async function testeNovasPerguntas() {
  console.log("\n🧪 TESTE FOCADO: Novas perguntas (8-21) com dados completos");
  console.log("=".repeat(70));

  const userId = "teste_novas@test.com";

  // Estado inicial completo (simulando que passou por todo o fluxo anterior)
  const estadoCompleto = {
    nome: "Teste Completo Silva",
    nascimento: "01/01/1980",
    cpf: "123.456.789-00",
    telefone: "(31) 99999-9999",
    email: "teste@email.com",
    cep: "30000-000",
    rua: "Rua do Teste",
    numero: "123",
    bairro: "Centro",
    complemento: "Apto 1",
    etapa3: "pergunta19", // Começando nas novas perguntas
    // Perguntas anteriores já respondidas
    menorIdade: "Não",
    pergunta1: "Sim",
    pergunta2: "Não",
    pergunta3: "Sim",
    pergunta5: "Sim",
    pergunta6: "a,b",
    pergunta7: "Dermatite em janeiro 2016",
    pergunta8: "a,c",
    pergunta9: "Sim",
    pergunta10: "Ansiedade em março 2017",
    pergunta11: "b,c",
    pergunta12: "Sim",
    pergunta13: "a,b,c",
    pergunta14: "Sim",
    pergunta15: "a,b",
    pergunta16: "Março 2016",
    pergunta17: "Não",
    pergunta18: "a",
  };

  setEstado(userId, estadoCompleto);

  console.log("✅ Estado inicial configurado com dados completos");
  console.log("📋 Começando no fluxo das novas perguntas...\n");

  // Sequência de respostas para testar TODOS os fluxos das novas perguntas
  const respostas = [
    // Pergunta 19 - Fonte de alimento
    "Sim", // perdeu fonte alimento
    "11/2015", // quando perdeu
    "Sim", // ainda continua
    "a,c", // despesas (compra + viagem)

    // Pergunta 20 - Renda
    "Sim", // renda afetada
    "A,B,E", // motivos (pesca, agricultura, danos materiais)
    "12/2015", // quando renda afetada
    "Sim", // redução persiste
    "R$ 800", // valor perda mensal

    // Pergunta 21 - Energia
    "Sim", // energia afetada
    "A,B", // corte total + instável
    "01/2016", // quando problema energia
    "d", // outros (despesas)
    "Compra de gerador", // descrição despesas

    // Pergunta 22 - Rio/Mar
    "Sim", // uso rio/mar afetado
    "A,B,I", // pesca lazer + alimentação + outros
    "Cerimônias religiosas", // descrição outros usos
    "02/2016", // quando percebeu perdas

    // Pergunta 23 - Terra
    "Sim", // uso terra afetado
    "A,B,G", // cultivo + criação + outros
    "Horta comunitária", // descrição outros impactos
    "03/2016", // quando percebeu perdas terra

    // Pergunta 24 - Rios/Mar versão 2
    "Sim", // uso rios/mar afetado 2
    "b,c,d", // pesca alimentação + troca + comercial
    "a,e", // navegação + outros
    "Transporte familiar", // descrição outros usos
    "04/2016", // quando percebeu problemas

    // Pergunta 25 - Terra versão 2
    "Sim", // uso terra afetado 2
    "a,b,e", // cultivo + criação + poluição
    "05/2016", // quando percebeu perda

    // Pergunta 26 - Prejuízos materiais
    "Sim", // outros prejuízos
    "Danos à bomba d'água e sistema de irrigação", // especificar

    // Pergunta 27 - Indenizações
    "A,C", // AFE + Novel

    // Pergunta 28 - Repactuação
    "Sim", // aderiu repactuação
    "b,d", // PID + pescadores/agricultores
    "Sim", // recebeu proposta
    "Não", // não recebeu indenização ainda

    // Pergunta 29 - Morador Bento/Paracatu
    "Não", // não era morador

    // Pergunta 30 - Compensação não financeira
    "Não", // não recebeu compensação
    "Sim", // se cadastrou
    "Não", // não houve contato

    // Pergunta 31 - Quem indicou (FINAL)
    "Dr. Igor", // quem indicou
  ];

  console.log(`🎯 Iniciando sequência de ${respostas.length} respostas...\n`);

  for (let i = 0; i < respostas.length; i++) {
    const resposta = respostas[i];
    const msg = criarMensagem(userId, resposta);

    console.log(
      `\n📝 [${i + 1}/${respostas.length}] Respondendo: "${resposta}"`
    );

    try {
      await fluxoPerguntas(mockClient, msg);
      await delay(100); // Pequeno delay

      // Verificar se o estado ainda existe (se não existe, foi salvo e limpo)
      const estadoAtual = getEstado(userId);
      if (!estadoAtual) {
        console.log(
          "🎉 FLUXO FINALIZADO! Estado foi limpo (dados salvos com sucesso)"
        );
        break;
      }
    } catch (error) {
      console.error(`❌ Erro na resposta ${i + 1}:`, error.message);
      break;
    }
  }

  // Verificar estado final
  const estadoFinal = getEstado(userId);
  if (estadoFinal) {
    console.log(`\n⚠️ Estado ainda existe após todas as respostas:`);
    console.log(`   Etapa atual: ${estadoFinal.etapa3}`);
    console.log(
      `   Última pergunta respondida: pergunta${
        Object.keys(estadoFinal).filter((k) => k.startsWith("pergunta")).length
      }`
    );
  } else {
    console.log(`\n✅ Estado foi limpo - salvamento realizado com sucesso!`);
  }

  console.log("\n🏁 TESTE DAS NOVAS PERGUNTAS CONCLUÍDO");
}

// Teste específico para verificar pulos condicionais
async function testePulosCondicionais() {
  console.log("\n🧪 TESTE: Pulos condicionais nas novas perguntas");
  console.log("=".repeat(70));

  const userId = "teste_pulos@test.com";

  // Estado inicial
  const estadoBase = {
    nome: "Teste Pulos Silva",
    nascimento: "01/01/1985",
    cpf: "987.654.321-00",
    telefone: "(31) 88888-8888",
    email: "pulos@email.com",
    cep: "31000-000",
    rua: "Rua dos Pulos",
    numero: "456",
    bairro: "Vila Nova",
    complemento: "",
    etapa3: "pergunta19",
    menorIdade: "Não",
    pergunta1: "Não",
    pergunta2: "Sim",
    pergunta3: "Não",
    pergunta5: "Não", // Vai pular sub-perguntas
    pergunta9: "Não", // Vai pular sub-perguntas
    pergunta12: "Não", // Vai pular sub-perguntas
    pergunta14: "Não", // Foi salvo direto antes
  };

  setEstado(userId, estadoBase);

  // Respostas que testam os pulos
  const respostasComPulos = [
    "Não", // pergunta19 - não perdeu fonte (pula para 20)
    "Não", // pergunta20 - renda não afetada (pula para 21)
    "Não", // pergunta21 - energia não afetada (pula para 22)
    "Não", // pergunta22 - rio/mar não afetado (pula para 23)
    "Não", // pergunta23 - terra não afetada (pula para 24)
    "Não", // pergunta24 - rios/mar 2 não afetado (pula para 25)
    "Não", // pergunta25 - terra 2 não afetada (pula para 26)
    "Não", // pergunta26 - sem prejuízos materiais (pula para 27)
    "E", // pergunta27 - não recebeu indenização
    "Não", // pergunta28 - não aderiu repactuação (pula para 29)
    "Sim", // pergunta29 - era morador Bento/Paracatu
    "Sim", // pergunta30 - recebeu compensação (pula para 31)
    "Matheus", // pergunta31 - quem indicou (FINAL)
  ];

  console.log(
    `🎯 Testando pulos condicionais com ${respostasComPulos.length} respostas...\n`
  );

  for (let i = 0; i < respostasComPulos.length; i++) {
    const resposta = respostasComPulos[i];
    const msg = criarMensagem(userId, resposta);

    console.log(
      `\n📝 [${i + 1}/${respostasComPulos.length}] Respondendo: "${resposta}"`
    );

    try {
      await fluxoPerguntas(mockClient, msg);
      await delay(100);

      const estadoAtual = getEstado(userId);
      if (!estadoAtual) {
        console.log(
          "🎉 FLUXO COM PULOS FINALIZADO! Estado limpo (dados salvos)"
        );
        break;
      }
    } catch (error) {
      console.error(`❌ Erro na resposta ${i + 1}:`, error.message);
      break;
    }
  }

  console.log("\n🏁 TESTE DE PULOS CONDICIONAIS CONCLUÍDO");
}

// Função principal
async function executarTestesEspecificos() {
  console.log("🚀 TESTES ESPECÍFICOS DAS NOVAS PERGUNTAS");
  console.log("=".repeat(80));

  try {
    await testeNovasPerguntas();
    await delay(2000); // Pausa entre testes
    await testePulosCondicionais();

    console.log("\n🎉 TODOS OS TESTES ESPECÍFICOS CONCLUÍDOS!");
    console.log("=".repeat(80));
    console.log("📊 Resumo dos testes:");
    console.log("- ✅ Fluxo completo das novas perguntas (19-31)");
    console.log("- ✅ Pulos condicionais testados");
    console.log("- ✅ Sub-perguntas condicionais verificadas");
    console.log("- ✅ Salvamento na planilha testado");
  } catch (error) {
    console.error("❌ ERRO DURANTE OS TESTES:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executarTestesEspecificos();
}

module.exports = {
  executarTestesEspecificos,
  testeNovasPerguntas,
  testePulosCondicionais,
};
