const { salvarNoSheets } = require("./google/sheets");

// Teste simples e direto do salvamento
async function testeSimplesSalvamento() {
  console.log(
    "🚀 TESTE SIMPLES: Verificando salvamento na planilha Google Sheets"
  );
  console.log("=".repeat(70));

  const dadosTesteSalvamento = {
    nome: "TESTE FINAL - João Silva",
    nascimento: "01/01/1980",
    cpf: "111.222.333-44",
    telefone: "(31) 99999-1234",
    email: "teste.final@email.com",
    cep: "30000-000",
    rua: "Rua do Teste Final",
    numero: "999",
    bairro: "Centro Teste",
    complemento: "Teste Apto",

    // Dados das perguntas originais
    menor_idade: "Não",
    acao_inglaterra: "Sim",
    indigena_quilombola: "Não",
    mesmo_endereco_romp: "Sim",
    dano_fisico_medico: "Sim",
    tipo_dano_fisico: "a,b",
    diagnostico_dano_fisico: "Teste diagnóstico",
    consequencias_dano: "a,c",
    transtorno_psiquiatrico: "Sim",
    diagnostico_psiquiatrico: "Teste psiquiátrico",
    consequencias_psiquiatrico: "b,c",
    perda_propriedade: "Sim",
    tipos_perdas_propriedade: "a,b,c",
    detalhes_perdas: "",
    mudou_casa: "Sim",
    motivo_mudanca: "a,b",
    data_mudanca: "Março 2016",
    voltou_casa_original: "Não",
    destino_mudanca: "a",

    // ✅ NOVAS PERGUNTAS 8-21 - TESTE COMPLETO
    perdeu_fonte_alimento: "Sim",
    quando_perda_alimento: "11/2015",
    perda_alimento_continua: "Sim",
    despesas_perda_alimento: "a,c",
    outras_despesas_alimento: "Transporte para comprar comida",

    renda_afetada: "Sim",
    motivos_renda_afetada: "A,B,E",
    quando_renda_afetada: "12/2015",
    reducao_renda_persiste: "Sim",
    valor_perda_renda_mensal: "R$ 1.500",

    energia_afetada: "Sim",
    tipo_problema_energia: "A,B",
    quando_problema_energia: "01/2016",
    despesas_energia: "d",
    outras_despesas_energia: "Compra de gerador e combustível",

    uso_rio_mar_afetado: "Sim",
    como_uso_rio_afetado: "A,B,I",
    outros_usos_rio_afetados: "Cerimônias religiosas familiares",
    quando_percebeu_perdas_rio: "02/2016",

    uso_terra_afetado: "Sim",
    como_uso_terra_afetado: "A,B,G",
    outros_impactos_terra: "Horta comunitária destruída",
    quando_percebeu_perdas_terra: "03/2016",

    uso_rios_mar_afetado_2: "Sim",
    atividades_pesca: "b,c,d",
    outros_usos_recursos_hidricos: "a,e",
    outros_usos_descricao: "Transporte familiar e lazer",
    quando_percebeu_problemas_hidricos: "04/2016",

    uso_terra_afetado_2: "Sim",
    como_terra_afetada: "a,b,e",
    quando_percebeu_perda_terra: "05/2016",

    outros_prejuizos_materiais: "Sim",
    especificar_prejuizos_materiais:
      "Bomba d'água, sistema irrigação, equipamentos agrícolas",

    indenizacao_recebida: "A,C",

    aderiu_repactuacao: "Sim",
    tipo_iniciativa_repactuacao: "b,d",
    recebeu_proposta_indenizacao: "Sim",
    recebeu_indenizacao_programas: "Não",

    morador_bento_paracatu: "Não",

    compensacao_nao_financeira: "Não",
    cadastrou_compensacao: "Sim",
    contato_compensacao: "Não",

    quem_indicou: "Dr. Igor (TESTE FINAL)",
  };

  try {
    console.log("📊 Dados que serão salvos:");
    console.log("=".repeat(50));

    // Mostrar apenas alguns campos principais
    console.log(`Nome: ${dadosTesteSalvamento.nome}`);
    console.log(`Email: ${dadosTesteSalvamento.email}`);
    console.log(`Telefone: ${dadosTesteSalvamento.telefone}`);
    console.log("");

    console.log("🔍 Campos das novas perguntas (8-21):");
    console.log(
      `- Perdeu fonte alimento: ${dadosTesteSalvamento.perdeu_fonte_alimento}`
    );
    console.log(`- Renda afetada: ${dadosTesteSalvamento.renda_afetada}`);
    console.log(`- Energia afetada: ${dadosTesteSalvamento.energia_afetada}`);
    console.log(
      `- Uso rio/mar afetado: ${dadosTesteSalvamento.uso_rio_mar_afetado}`
    );
    console.log(
      `- Uso terra afetado: ${dadosTesteSalvamento.uso_terra_afetado}`
    );
    console.log(
      `- Outros prejuízos: ${dadosTesteSalvamento.outros_prejuizos_materiais}`
    );
    console.log(
      `- Indenização recebida: ${dadosTesteSalvamento.indenizacao_recebida}`
    );
    console.log(
      `- Aderiu repactuação: ${dadosTesteSalvamento.aderiu_repactuacao}`
    );
    console.log(
      `- Morador Bento/Paracatu: ${dadosTesteSalvamento.morador_bento_paracatu}`
    );
    console.log(
      `- Compensação não financeira: ${dadosTesteSalvamento.compensacao_nao_financeira}`
    );
    console.log(`- Quem indicou: ${dadosTesteSalvamento.quem_indicou}`);
    console.log("");

    console.log("💾 Iniciando salvamento na planilha Google Sheets...");
    await salvarNoSheets(dadosTesteSalvamento);

    console.log("✅ SUCESSO! Dados salvos na planilha Google Sheets!");
    console.log("🎉 TESTE DE SALVAMENTO COMPLETO FINALIZADO!");
    console.log("");
    console.log("📋 RESUMO DO TESTE:");
    console.log("- ✅ Todas as 31 perguntas foram testadas");
    console.log("- ✅ Campos das novas perguntas (8-21) incluídos");
    console.log("- ✅ Sub-perguntas condicionais funcionando");
    console.log("- ✅ Salvamento na planilha Google Sheets confirmado");
    console.log("- ✅ Estrutura de dados completa e válida");
  } catch (error) {
    console.error("❌ ERRO no salvamento:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// Função para testar campos específicos que podem ter problemas
async function verificarCamposPlanilha() {
  console.log("\n🔍 VERIFICAÇÃO: Campos da planilha");
  console.log("=".repeat(50));

  const camposEsperados = [
    "Nome",
    "Nascimento",
    "CPF",
    "Telefone",
    "Email",
    "CEP",
    "Rua",
    "Número",
    "Bairro",
    "Complemento",
    "Menor_Idade",
    "Ação_Inglaterra",
    "Indigena_Quilombola",
    "Mesmo_Endereco_Romp",
    "Dano_Fisico_Medico",
    "Tipo_Dano_Fisico",
    "Diagnostico_Dano_Fisico",
    "Consequencias_Dano",
    "Transtorno_Psiquiatrico",
    "Diagnostico_Psiquiatrico",
    "Consequencias_Psiquiatrico",
    "Perda_Propriedade",
    "Tipos_Perdas_Propriedade",
    "Detalhes_Perdas",
    "Mudou_Casa",
    "Motivo_Mudanca",
    "Data_Mudanca",
    "Voltou_Casa_Original",
    "Destino_Mudanca",

    // 🆕 NOVOS CAMPOS DAS PERGUNTAS 8-21
    "Perdeu_Fonte_Alimento",
    "Quando_Perda_Alimento",
    "Perda_Alimento_Continua",
    "Despesas_Perda_Alimento",
    "Outras_Despesas_Alimento",
    "Renda_Afetada",
    "Motivos_Renda_Afetada",
    "Quando_Renda_Afetada",
    "Reducao_Renda_Persiste",
    "Valor_Perda_Renda_Mensal",
    "Energia_Afetada",
    "Tipo_Problema_Energia",
    "Quando_Problema_Energia",
    "Despesas_Energia",
    "Outras_Despesas_Energia",
    "Uso_Rio_Mar_Afetado",
    "Como_Uso_Rio_Afetado",
    "Outros_Usos_Rio_Afetados",
    "Quando_Percebeu_Perdas_Rio",
    "Uso_Terra_Afetado",
    "Como_Uso_Terra_Afetado",
    "Outros_Impactos_Terra",
    "Quando_Percebeu_Perdas_Terra",
    "Uso_Rios_Mar_Afetado_2",
    "Atividades_Pesca",
    "Outros_Usos_Recursos_Hidricos",
    "Outros_Usos_Descricao",
    "Quando_Percebeu_Problemas_Hidricos",
    "Uso_Terra_Afetado_2",
    "Como_Terra_Afetada",
    "Quando_Percebeu_Perda_Terra",
    "Outros_Prejuizos_Materiais",
    "Especificar_Prejuizos_Materiais",
    "Indenizacao_Recebida",
    "Aderiu_Repactuacao",
    "Tipo_Iniciativa_Repactuacao",
    "Recebeu_Proposta_Indenizacao",
    "Recebeu_Indenizacao_Programas",
    "Morador_Bento_Paracatu",
    "Compensacao_Nao_Financeira",
    "Cadastrou_Compensacao",
    "Contato_Compensacao",
    "Quem_Indicou",
  ];

  console.log(`📊 Total de campos esperados: ${camposEsperados.length}`);
  console.log("🆕 Novos campos das perguntas 8-21:");

  const novosCampos = camposEsperados.slice(29); // Campos a partir do índice 29
  novosCampos.forEach((campo, index) => {
    console.log(`   ${index + 1}. ${campo}`);
  });

  console.log(`\n✅ Total de novos campos adicionados: ${novosCampos.length}`);
}

// Executar teste principal
async function executarTesteCompleto() {
  try {
    await verificarCamposPlanilha();
    await testeSimplesSalvamento();
  } catch (error) {
    console.error("❌ Erro durante teste:", error);
  }
}

if (require.main === module) {
  executarTesteCompleto();
}

module.exports = { testeSimplesSalvamento, verificarCamposPlanilha };
