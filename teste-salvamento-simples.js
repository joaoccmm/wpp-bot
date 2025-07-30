const { salvarNoSheets } = require("./google/sheets");

async function testarSalvamento() {
  console.log("Testando conexão com Google Sheets...");

  const dadosTeste = {
    id: "teste-" + Date.now(),
    nome: "Teste Salvamento",
    timestamp: new Date().toISOString(),
    cpf: "123.456.789-00",
    telefone: "(11) 99999-9999",
    email: "teste@teste.com",
  };

  try {
    await salvarNoSheets(dadosTeste);
    console.log("✅ Teste de salvamento concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro no teste de salvamento:", error);
  }
}

testarSalvamento();
