// Script de teste completo do fluxo do chatbot
console.log("🧪 TESTE COMPLETO DO FLUXO DO CHATBOT");
console.log("=".repeat(50));

// Simular estruturas necessárias
const { getEstado, setEstado, limparEstado } = require("./utils/estados");

// Teste das validações
console.log("\n📋 1. TESTANDO VALIDAÇÕES:");

// Teste CPF
function testarCPF() {
  console.log("\n🆔 Teste CPF:");

  const cpfs = [
    "12345678901", // formato números
    "123.456.789-01", // formato formatado
    "123.456.789.01", // formato incorreto
    "1234567890", // muito curto
    "123456789012", // muito longo
  ];

  cpfs.forEach((cpf) => {
    const cpfLimpo = cpf.replace(/[.-]/g, "");
    const valido = /^\d{11}$/.test(cpfLimpo);
    console.log(`  ${cpf} → ${cpfLimpo} → ${valido ? "✅" : "❌"}`);
  });
}

// Teste Telefone
function testarTelefone() {
  console.log("\n📱 Teste Telefone:");

  const telefones = [
    "11987654321", // formato números
    "11 9876-5432", // formato com traço
    "11 9876 5432", // formato com espaços
    "(11) 9876-5432", // formato com parênteses
    "1234567890", // 10 dígitos
    "123456789", // muito curto
  ];

  telefones.forEach((tel) => {
    const telLimpo = tel.replace(/[\s\-\(\)]/g, "");
    const valido = /^\d{10,11}$/.test(telLimpo);
    console.log(`  ${tel} → ${telLimpo} → ${valido ? "✅" : "❌"}`);
  });
}

// Teste Data
function testarData() {
  console.log("\n📅 Teste Data:");

  const datas = [
    "01/01/1990", // válido
    "31/12/2000", // válido
    "1/1/1990", // inválido (sem zero)
    "01-01-1990", // inválido (formato)
    "2023/01/01", // inválido (formato)
  ];

  datas.forEach((data) => {
    const valida = /^\d{2}\/\d{2}\/\d{4}$/.test(data);
    console.log(`  ${data} → ${valida ? "✅" : "❌"}`);
  });
}

// Teste Estado
function testarEstado() {
  console.log("\n🔄 Teste Gerenciamento de Estado:");

  const idTeste = "teste@user";

  // Limpar estado
  limparEstado(idTeste);
  console.log("  Estado limpo ✅");

  // Definir estado inicial
  const estadoInicial = {
    etapa: "nome",
    nome: "",
    cpf: "",
    telefone: "",
  };

  setEstado(idTeste, estadoInicial);
  console.log("  Estado inicial definido ✅");

  // Recuperar estado
  const estadoRecuperado = getEstado(idTeste);
  console.log(`  Estado recuperado: ${estadoRecuperado ? "✅" : "❌"}`);

  if (estadoRecuperado) {
    console.log(`    Etapa: ${estadoRecuperado.etapa}`);
  }
}

// Teste Fluxo de Perguntas
function testarFluxoPerguntas() {
  console.log("\n❓ Teste Lógica do Fluxo de Perguntas:");

  // Simular uma resposta da pergunta 7
  const respostaP7 = "Dor de cabeça constante";
  const temDiagnostico =
    respostaP7.toLowerCase() !== "não" &&
    respostaP7.toLowerCase() !== "nao" &&
    respostaP7.toLowerCase() !== "nenhum";

  console.log(`  Resposta P7: "${respostaP7}"`);
  console.log(`  Tem diagnóstico: ${temDiagnostico ? "✅ Sim" : "❌ Não"}`);

  // Simular pergunta 31 (indicação)
  const indicacoes = ["Igor", "Matheus", "Aline", "João", "Outro"];

  indicacoes.forEach((indicacao) => {
    const opcao = indicacao.toLowerCase();
    const valida =
      opcao.includes("igor") ||
      opcao.includes("matheus") ||
      opcao.includes("aline") ||
      opcao.includes("simony") ||
      opcao.includes("joão") ||
      opcao.includes("joao") ||
      opcao.includes("victor");

    console.log(`  Indicação "${indicacao}": ${valida ? "✅" : "❌"}`);
  });
}

// Teste Estrutura de Mensagens
function testarMensagens() {
  console.log("\n💬 Teste Estrutura de Mensagens:");

  try {
    const { mensagens } = require("./flows/fluxoPerguntas");
    console.log("  Mensagens do fluxo carregadas ✅");

    // Verificar algumas mensagens chave
    const mensagensChave = ["inicio", "pergunta1", "pergunta31"];
    mensagensChave.forEach((key) => {
      if (mensagens[key]) {
        console.log(`    ${key}: ✅`);
      } else {
        console.log(`    ${key}: ❌ AUSENTE`);
      }
    });
  } catch (error) {
    console.log(`  ❌ Erro ao carregar mensagens: ${error.message}`);
  }
}

// Executar todos os testes
async function executarTestes() {
  try {
    testarCPF();
    testarTelefone();
    testarData();
    testarEstado();
    testarFluxoPerguntas();
    testarMensagens();

    console.log("\n" + "=".repeat(50));
    console.log("🎉 TESTE COMPLETO FINALIZADO!");
    console.log("✅ Todas as validações foram testadas");
  } catch (error) {
    console.error("\n❌ ERRO DURANTE OS TESTES:", error.message);
    console.error("Stack:", error.stack);
  }
}

// Executar
executarTestes();
