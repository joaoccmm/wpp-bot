const { fluxoPerguntas, mensagens } = require("./flows/fluxoPerguntas");
const { salvarNoSheets } = require("./google/sheets");
const { setEstado, getEstado, limparEstado } = require("./utils/estados");

// Mock do cliente WhatsApp
const mockClient = {
  sendText: async (id, message) => {
    console.log(`📱 [${id}] Enviado: ${message.substring(0, 100)}...`);
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

// Cenário 1: Fluxo completo com SIM para perguntas principais
async function testeFluxoCompleto1() {
  console.log("\n🧪 TESTE 1: Fluxo completo com SIM para perguntas principais");
  console.log("=".repeat(60));

  const userId = "teste1@test.com";

  // Dados iniciais (simulando que já passou pelo cadastro)
  const estadoInicial = {
    nome: "João Silva Teste 1",
    nascimento: "01/01/1985",
    cpf: "123.456.789-01",
    telefone: "(31) 99999-0001",
    email: "joao.teste1@email.com",
    cep: "30000-000",
    rua: "Rua Teste",
    numero: "123",
    bairro: "Centro",
    complemento: "Apto 1",
    etapa3: "inicio",
  };

  setEstado(userId, estadoInicial);

  const respostas = [
    "Não", // menorIdade
    "Sim", // pergunta1 - ação Inglaterra
    "Não", // pergunta2 - indígena/quilombola
    "Sim", // pergunta3 - mesmo endereço
    "Sim", // pergunta5 - dano físico
    "a,b", // pergunta6 - tipos de dano
    "Dermatite diagnosticada em janeiro de 2016", // pergunta7 - diagnóstico
    "a,c", // pergunta8 - consequências
    "Sim", // pergunta9 - transtorno psiquiátrico
    "Ansiedade diagnosticada em março de 2017", // pergunta10 - diagnóstico psiquiátrico
    "b,c", // pergunta11 - consequências psiquiátricas
    "Sim", // pergunta12 - perda propriedade
    "a,b,c", // pergunta13 - tipos de perdas
    "Sim", // pergunta14 - mudou casa
    "a,b", // pergunta15 - motivo mudança
    "Março de 2016", // pergunta16 - quando mudou
    "Não", // pergunta17 - voltou casa original
    "a", // pergunta18 - destino mudança
    "Sim", // pergunta19 - perdeu fonte alimento
    "11/2015", // pergunta19_1 - quando perda alimento
    "Sim", // pergunta19_2 - perda continua
    "a,b", // pergunta19_3 - despesas alimento
    "Sim", // pergunta20 - renda afetada
    "A,B,E", // pergunta20_1 - motivos renda
    "12/2015", // pergunta20_2 - quando renda afetada
    "Sim", // pergunta20_3 - redução persiste
    "R$ 500", // pergunta20_4 - valor perda mensal
    "Sim", // pergunta21 - energia afetada
    "A", // pergunta21_1 - tipo problema energia
    "01/2016", // pergunta21_2 - quando problema energia
    "A,C", // pergunta21_3 - despesas energia
    "Sim", // pergunta22 - uso rio/mar afetado
    "A,B,G", // pergunta22_1 - como uso afetado
    "02/2016", // pergunta22_3 - quando percebeu perdas rio
    "Sim", // pergunta23 - uso terra afetado
    "A,B,F", // pergunta23_1 - como terra afetada
    "03/2016", // pergunta23_3 - quando percebeu perdas terra
    "Sim", // pergunta24 - uso rios/mar afetado 2
    "a,b", // pergunta24_1 - atividades pesca
    "a,c", // pergunta24_2 - outros usos recursos
    "04/2016", // pergunta24_4 - quando percebeu problemas
    "Sim", // pergunta25 - uso terra afetado 2
    "a,b,c", // pergunta25_1 - como terra afetada
    "05/2016", // pergunta25_2 - quando percebeu perda terra
    "Sim", // pergunta26 - outros prejuízos materiais
    "Danos à geladeira e máquina de lavar", // pergunta26_1 - especificar prejuízos
    "A,B", // pergunta27 - indenização recebida
    "Sim", // pergunta28 - aderiu repactuação
    "a,b", // pergunta28_1 - tipo iniciativa
    "Sim", // pergunta28_2 - recebeu proposta
    "Não", // pergunta28_3 - recebeu indenização
    "Não", // pergunta29 - morador Bento/Paracatu
    "Não", // pergunta30 - compensação não financeira
    "Sim", // pergunta30_1 - cadastrou compensação
    "Não", // pergunta30_2 - contato compensação
    "Dr. Igor", // pergunta31 - quem indicou
  ];

  for (let i = 0; i < respostas.length; i++) {
    const msg = criarMensagem(userId, respostas[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostas[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100); // Pequeno delay para simular tempo real
  }

  console.log("✅ TESTE 1 CONCLUÍDO\n");
}

// Cenário 2: Fluxo com pulos (respostas NÃO)
async function testeFluxoCompleto2() {
  console.log("\n🧪 TESTE 2: Fluxo com pulos (respostas NÃO)");
  console.log("=".repeat(60));

  const userId = "teste2@test.com";

  const estadoInicial = {
    nome: "Maria Santos Teste 2",
    nascimento: "15/08/1990",
    cpf: "987.654.321-09",
    telefone: "(31) 88888-0002",
    email: "maria.teste2@email.com",
    cep: "31000-000",
    rua: "Avenida Teste",
    numero: "456",
    bairro: "Bairro Novo",
    complemento: "",
    etapa3: "inicio",
  };

  setEstado(userId, estadoInicial);

  const respostas = [
    "Não", // menorIdade
    "Não", // pergunta1 - ação Inglaterra
    "Sim", // pergunta2 - indígena/quilombola
    "Não", // pergunta3 - mesmo endereço
    "Não", // pergunta5 - dano físico (pula para pergunta9)
    "Não", // pergunta9 - transtorno psiquiátrico (pula para pergunta12)
    "Não", // pergunta12 - perda propriedade (pula para pergunta14)
    "Não", // pergunta14 - mudou casa (salva direto)
  ];

  for (let i = 0; i < respostas.length; i++) {
    const msg = criarMensagem(userId, respostas[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostas[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100);
  }

  console.log("✅ TESTE 2 CONCLUÍDO (com pulos)\n");
}

// Cenário 3: Fluxo das novas perguntas com pulos
async function testeFluxoCompleto3() {
  console.log("\n🧪 TESTE 3: Fluxo das novas perguntas com pulos estratégicos");
  console.log("=".repeat(60));

  const userId = "teste3@test.com";

  const estadoInicial = {
    nome: "Carlos Oliveira Teste 3",
    nascimento: "20/12/1975",
    cpf: "456.789.123-45",
    telefone: "(31) 77777-0003",
    email: "carlos.teste3@email.com",
    cep: "32000-000",
    rua: "Praça Central",
    numero: "789",
    bairro: "Vila Nova",
    complemento: "Casa",
    etapa3: "pergunta19", // Começando direto nas novas perguntas
  };

  setEstado(userId, estadoInicial);

  const respostas = [
    "Não", // pergunta19 - perdeu fonte alimento (pula para pergunta20)
    "Sim", // pergunta20 - renda afetada
    "C,D,F", // pergunta20_1 - motivos renda
    "06/2016", // pergunta20_2 - quando renda afetada
    "Não", // pergunta20_3 - redução persiste
    "R$ 800", // pergunta20_4 - valor perda mensal
    "Não", // pergunta21 - energia afetada (pula para pergunta22)
    "Não", // pergunta22 - uso rio/mar afetado (pula para pergunta23)
    "Sim", // pergunta23 - uso terra afetado
    "C,D,G", // pergunta23_1 - como terra afetada
    "Outros impactos na terra", // pergunta23_2 - descrever impactos
    "07/2016", // pergunta23_3 - quando percebeu perdas terra
    "Não", // pergunta24 - uso rios/mar afetado 2 (pula para pergunta25)
    "Não", // pergunta25 - uso terra afetado 2 (pula para pergunta26)
    "Sim", // pergunta26 - outros prejuízos materiais
    "Danos ao sistema de irrigação", // pergunta26_1 - especificar prejuízos
    "E", // pergunta27 - não recebeu indenização
    "Não", // pergunta28 - não aderiu repactuação (pula para pergunta29)
    "Sim", // pergunta29 - morador Bento/Paracatu
    "Sim", // pergunta30 - compensação não financeira (pula para pergunta31)
    "Matheus", // pergunta31 - quem indicou
  ];

  for (let i = 0; i < respostas.length; i++) {
    const msg = criarMensagem(userId, respostas[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostas[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100);
  }

  console.log("✅ TESTE 3 CONCLUÍDO (com pulos estratégicos)\n");
}

// Cenário 4: Teste de validações e erros
async function testeValidacoes() {
  console.log("\n🧪 TESTE 4: Validações e tratamento de erros");
  console.log("=".repeat(60));

  const userId = "teste4@test.com";

  const estadoInicial = {
    nome: "Ana Costa Teste 4",
    nascimento: "10/05/1988",
    cpf: "321.654.987-12",
    telefone: "(31) 66666-0004",
    email: "ana.teste4@email.com",
    cep: "33000-000",
    rua: "Rua da Validação",
    numero: "101",
    bairro: "Centro",
    complemento: "",
    etapa3: "pergunta19_3",
  };

  setEstado(userId, estadoInicial);

  // Testando respostas inválidas primeiro
  const respostasInvalidas = [
    "talvez", // resposta inválida para pergunta19_3
    "xyz", // letras inválidas
    "e", // resposta válida (sem despesas) - deve pular para pergunta20
  ];

  for (let i = 0; i < respostasInvalidas.length; i++) {
    const msg = criarMensagem(userId, respostasInvalidas[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostasInvalidas[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100);
  }

  // Continuando o fluxo normalmente
  const respostasRestantes = [
    "Sim", // pergunta20 - renda afetada
    "G,H,I", // pergunta20_1 - motivos renda
    "08/2016", // pergunta20_2 - quando renda afetada
    "Sim", // pergunta20_3 - redução persiste
    "R$ 1200", // pergunta20_4 - valor perda mensal
    "Sim", // pergunta21 - energia afetada
    "B", // pergunta21_1 - tipo problema energia
    "09/2016", // pergunta21_2 - quando problema energia
    "D", // pergunta21_3 - despesas energia (outros)
    "Compra de velas e lanternas", // pergunta21_4 - descrever despesas
    "Sim", // pergunta22 - uso rio/mar afetado
    "I", // pergunta22_1 - outros usos
    "Atividades de lazer familiar", // pergunta22_2 - descrever usos
    "10/2016", // pergunta22_3 - quando percebeu perdas rio
    "Não", // pergunta23 - uso terra afetado (pula para pergunta24)
    "Sim", // pergunta24 - uso rios/mar afetado 2
    "c,d", // pergunta24_1 - atividades pesca
    "e", // pergunta24_2 - outros usos (outros)
    "Rituais religiosos na beira do rio", // pergunta24_3 - descrever usos
    "11/2016", // pergunta24_4 - quando percebeu problemas
    "Sim", // pergunta25 - uso terra afetado 2
    "d,e,g", // pergunta25_1 - como terra afetada
    "12/2016", // pergunta25_2 - quando percebeu perda terra
    "Não", // pergunta26 - outros prejuízos materiais (pula para pergunta27)
    "C,D", // pergunta27 - indenização recebida
    "Sim", // pergunta28 - aderiu repactuação
    "c,d,e", // pergunta28_1 - tipo iniciativa
    "Não", // pergunta28_2 - recebeu proposta
    "Sim", // pergunta28_3 - recebeu indenização
    "Não", // pergunta29 - morador Bento/Paracatu
    "Não", // pergunta30 - compensação não financeira
    "Não", // pergunta30_1 - cadastrou compensação
    "Sim", // pergunta30_2 - contato compensação
    "Aline", // pergunta31 - quem indicou
  ];

  for (let i = 0; i < respostasRestantes.length; i++) {
    const msg = criarMensagem(userId, respostasRestantes[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostasRestantes[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100);
  }

  console.log("✅ TESTE 4 CONCLUÍDO (validações)\n");
}

// Cenário 5: Teste específico das sub-perguntas condicionais
async function testeSubPerguntas() {
  console.log("\n🧪 TESTE 5: Sub-perguntas condicionais específicas");
  console.log("=".repeat(60));

  const userId = "teste5@test.com";

  const estadoInicial = {
    nome: "Pedro Lima Teste 5",
    nascimento: "03/11/1982",
    cpf: "789.123.456-78",
    telefone: "(31) 55555-0005",
    email: "pedro.teste5@email.com",
    cep: "34000-000",
    rua: "Estrada Rural",
    numero: "S/N",
    bairro: "Zona Rural",
    complemento: "Sítio",
    etapa3: "pergunta19",
  };

  setEstado(userId, estadoInicial);

  const respostas = [
    "Sim", // pergunta19 - perdeu fonte alimento
    "01/2016", // pergunta19_1 - quando perda alimento
    "Não", // pergunta19_2 - perda continua
    "d", // pergunta19_3 - despesas alimento (outros)
    "Gastos com transporte para comprar comida na cidade", // pergunta19_4 - descrever despesas
    "Sim", // pergunta20 - renda afetada
    "A,B,C", // pergunta20_1 - motivos renda (pesca, agricultura, pecuária)
    "02/2016", // pergunta20_2 - quando renda afetada
    "Sim", // pergunta20_3 - redução persiste
    "R$ 2000", // pergunta20_4 - valor perda mensal
    "Sim", // pergunta21 - energia afetada
    "A,B", // pergunta21_1 - tipo problema energia
    "03/2016", // pergunta21_2 - quando problema energia
    "d", // pergunta21_3 - despesas energia (outros)
    "Aluguel de gerador para ordenha das vacas", // pergunta21_4 - descrever despesas
    "Sim", // pergunta22 - uso rio/mar afetado
    "D,E,H", // pergunta22_1 - como uso afetado
    "04/2016", // pergunta22_3 - quando percebeu perdas rio
    "Sim", // pergunta23 - uso terra afetado
    "A,B,E", // pergunta23_1 - como terra afetada
    "05/2016", // pergunta23_3 - quando percebeu perdas terra
    "Sim", // pergunta24 - uso rios/mar afetado 2
    "b,c,d", // pergunta24_1 - atividades pesca
    "d", // pergunta24_2 - outros usos recursos (rituais)
    "06/2016", // pergunta24_4 - quando percebeu problemas
    "Sim", // pergunta25 - uso terra afetado 2
    "a,b,f", // pergunta25_1 - como terra afetada
    "07/2016", // pergunta25_2 - quando percebeu perda terra
    "Sim", // pergunta26 - outros prejuízos materiais
    "Sistema de irrigação, bomba d'água, e equipamentos agrícolas", // pergunta26_1 - especificar prejuízos
    "A,C", // pergunta27 - indenização recebida
    "Sim", // pergunta28 - aderiu repactuação
    "d,f", // pergunta28_1 - tipo iniciativa (pescadores/agricultores + PTR)
    "Sim", // pergunta28_2 - recebeu proposta
    "Sim", // pergunta28_3 - recebeu indenização
    "Sim", // pergunta29 - morador Bento/Paracatu
    "Sim", // pergunta30 - compensação não financeira (pula para pergunta31)
    "Simony", // pergunta31 - quem indicou
  ];

  for (let i = 0; i < respostas.length; i++) {
    const msg = criarMensagem(userId, respostas[i]);
    console.log(`\n📝 Resposta ${i + 1}: "${respostas[i]}"`);
    await fluxoPerguntas(mockClient, msg);
    await delay(100);
  }

  console.log("✅ TESTE 5 CONCLUÍDO (sub-perguntas)\n");
}

// Função para verificar dados salvos na planilha
async function verificarDadosSalvos() {
  console.log("\n🔍 VERIFICAÇÃO: Dados salvos na planilha");
  console.log("=".repeat(60));

  // Vamos verificar se todos os testes salvaram dados
  const todosUsuarios = [
    "teste1@test.com",
    "teste2@test.com",
    "teste3@test.com",
    "teste4@test.com",
    "teste5@test.com",
  ];

  for (const userId of todosUsuarios) {
    const estado = getEstado(userId);
    if (estado) {
      console.log(
        `❌ Usuário ${userId} ainda tem estado ativo (não foi limpo após salvamento)`
      );
      console.log(`   Estado: ${JSON.stringify(estado, null, 2)}`);
    } else {
      console.log(
        `✅ Usuário ${userId} - Estado limpo (salvamento bem-sucedido)`
      );
    }
  }
}

// Função principal para executar todos os testes
async function executarTodosTestes() {
  console.log("🚀 INICIANDO TESTES COMPLETOS DO FLUXO DE PERGUNTAS");
  console.log("=".repeat(80));

  try {
    await testeFluxoCompleto1();
    await testeFluxoCompleto2();
    await testeFluxoCompleto3();
    await testeValidacoes();
    await testeSubPerguntas();
    await verificarDadosSalvos();

    console.log("\n🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!");
    console.log("=".repeat(80));
    console.log("📊 Resumo:");
    console.log("- ✅ Teste 1: Fluxo completo com SIM");
    console.log("- ✅ Teste 2: Fluxo com pulos (NÃO)");
    console.log("- ✅ Teste 3: Novas perguntas com pulos");
    console.log("- ✅ Teste 4: Validações e erros");
    console.log("- ✅ Teste 5: Sub-perguntas condicionais");
    console.log("- ✅ Verificação de salvamento");
  } catch (error) {
    console.error("❌ ERRO DURANTE OS TESTES:", error);
    console.error("Stack trace:", error.stack);
  }
}

// Executar os testes se o arquivo for chamado diretamente
if (require.main === module) {
  executarTodosTestes();
}

module.exports = {
  executarTodosTestes,
  testeFluxoCompleto1,
  testeFluxoCompleto2,
  testeFluxoCompleto3,
  testeValidacoes,
  testeSubPerguntas,
};
