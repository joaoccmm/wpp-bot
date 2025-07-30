const { inicializarPlanilha } = require("./google/sheets");

async function testarInicializacao() {
  try {
    console.log("🔧 Testando inicialização da planilha...");
    await inicializarPlanilha();
    console.log("✅ Inicialização concluída com sucesso!");
  } catch (error) {
    console.error("❌ Erro na inicialização:", error.message);
    console.error("🔍 Stack:", error.stack);
  }
}

testarInicializacao();
