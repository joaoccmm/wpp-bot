const { inicializarPlanilha, salvarNoSheets } = require("./google/sheets");

async function testarSheets() {
  try {
    console.log("🔧 Inicializando planilha...");
    await inicializarPlanilha();
    console.log("✅ Planilha inicializada com sucesso!");

    console.log("💾 Testando salvamento...");
    await salvarNoSheets({
      nome: "Teste Bot",
      nascimento: "01/01/1990",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-9999",
      email: "teste@teste.com",
      cep: "01000-000",
      rua: "Rua Teste",
      numero: "123",
      bairro: "Centro",
      complemento: "Apto 1",
      menor_idade: "Não",
      acao_inglaterra: "Não",
      indigena_quilombola: "Não",
      mesmo_endereco_romp: "Sim",
      dano_fisico_medico: "Não",
      tipo_dano_fisico: "",
      diagnostico_dano_fisico: "",
      consequencias_dano: "",
      transtorno_psiquiatrico: "Não",
      diagnostico_psiquiatrico: "",
      consequencias_psiquiatrico: "",
      perda_propriedade: "Não",
      tipos_perdas_propriedade: "",
      detalhes_perdas: "",
      mudou_casa: "Não",
      motivo_mudanca: "",
      data_mudanca: "",
      voltou_casa_original: "",
      destino_mudanca: "",
    });
    console.log("✅ Teste de salvamento bem-sucedido!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
    console.error("Stack:", error.stack);
  }
}

testarSheets();
