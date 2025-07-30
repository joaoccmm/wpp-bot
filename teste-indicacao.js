const { salvarNoSheets } = require("./google/sheets");

async function testarIndicacao() {
  console.log("🧪 Testando nova funcionalidade de indicação...");

  const dadosComIndicacao = {
    id: "teste-indicacao-" + Date.now(),
    nome: "Teste Indicação",
    timestamp: new Date().toISOString(),
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
    email: "teste@teste.com",
    contrato_aceito: true,
    texto_autorizacao: "Eu Teste Indicação, li, concordo e autorizo...",
    indicado_por: "Dr. Igor",
    status: "questionario_completo",
  };

  try {
    await salvarNoSheets(dadosComIndicacao);
    console.log("✅ Teste de indicação concluído com sucesso!");
    console.log("📋 Campo indicado_por:", dadosComIndicacao.indicado_por);
  } catch (error) {
    console.error("❌ Erro no teste de indicação:", error);
  }
}

testarIndicacao();
