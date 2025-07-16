const { salvarNoSheets } = require("./google/sheets");

// Simulando um estado completo com todas as respostas
const estadoCompleto = {
  nome: "João Silva",
  nascimento: "15/05/1990",
  cpf: "123.456.789-00",
  telefone: "(11) 99999-9999",
  email: "joao@email.com",
  cep: "01000-000",
  rua: "Rua das Flores",
  numero: "123",
  bairro: "Centro",
  complemento: "Apto 45",
  menorIdade: "Não",
  pergunta1: "Sim",
  pergunta2: "Não",
  pergunta3: "Sim",
  pergunta5: "Sim",
  pergunta6: "a,b,c",
  pergunta7: "Diagnóstico de teste - 01/01/2020",
  pergunta8: "a,d",
  pergunta9: "Não",
  pergunta10: "",
  pergunta11: "",
  pergunta12: "Sim",
  pergunta13: "b,e,g",
  pergunta14: "Sim",
  pergunta15: "a,c",
  pergunta16: "Mudei em março de 2021",
  pergunta17: "Não",
  pergunta18: "a,b",
};

async function testarFluxoCompleto() {
  try {
    console.log("🧪 Testando fluxo completo com estado simulado...");
    console.log("📊 Estado completo:", JSON.stringify(estadoCompleto, null, 2));

    const dadosParaSalvar = {
      nome: estadoCompleto.nome,
      nascimento: estadoCompleto.nascimento,
      cpf: estadoCompleto.cpf,
      telefone: estadoCompleto.telefone,
      email: estadoCompleto.email,
      cep: estadoCompleto.cep,
      rua: estadoCompleto.rua,
      numero: estadoCompleto.numero,
      bairro: estadoCompleto.bairro,
      complemento: estadoCompleto.complemento,
      menor_idade: estadoCompleto.menorIdade,
      acao_inglaterra: estadoCompleto.pergunta1,
      indigena_quilombola: estadoCompleto.pergunta2,
      mesmo_endereco_romp: estadoCompleto.pergunta3,
      dano_fisico_medico: estadoCompleto.pergunta5,
      tipo_dano_fisico: estadoCompleto.pergunta6,
      diagnostico_dano_fisico: estadoCompleto.pergunta7,
      consequencias_dano: estadoCompleto.pergunta8,
      transtorno_psiquiatrico: estadoCompleto.pergunta9,
      diagnostico_psiquiatrico: estadoCompleto.pergunta10,
      consequencias_psiquiatrico: estadoCompleto.pergunta11,
      perda_propriedade: estadoCompleto.pergunta12,
      tipos_perdas_propriedade: estadoCompleto.pergunta13,
      detalhes_perdas: "",
      mudou_casa: estadoCompleto.pergunta14,
      motivo_mudanca: estadoCompleto.pergunta15,
      data_mudanca: estadoCompleto.pergunta16,
      voltou_casa_original: estadoCompleto.pergunta17,
      destino_mudanca: estadoCompleto.pergunta18,
    };

    console.log(
      "💾 Dados estruturados para salvamento:",
      JSON.stringify(dadosParaSalvar, null, 2)
    );

    await salvarNoSheets(dadosParaSalvar);
    console.log("✅ Teste do fluxo completo bem-sucedido!");
  } catch (error) {
    console.error("❌ Erro no teste do fluxo completo:", error);
    console.error("Stack:", error.stack);
  }
}

testarFluxoCompleto();
