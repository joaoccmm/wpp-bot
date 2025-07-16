const { GoogleSpreadsheet } = require("google-spreadsheet");
const criarAuth = require("./auth");

const SPREADSHEET_ID = "1zl7xGfRZaV9Bu_Ur3n5lluUrEneAT6O-Qy4mCDNBB5g";
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

async function inicializarPlanilha() {
  try {
    console.log("🔧 Criando autenticação...");
    doc.auth = criarAuth();

    console.log("📊 Carregando informações da planilha...");
    await doc.loadInfo();

    console.log("📋 Planilha carregada:", doc.title);
    console.log("📊 Total de abas:", doc.sheetCount);

    const sheet = doc.sheetsByIndex[0];
    console.log("📄 Aba selecionada:", sheet.title);

    console.log("🔧 Configurando cabeçalhos...");
    await sheet.setHeaderRow([
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
    ]);

    console.log("✅ Planilha inicializada com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inicializar planilha:", error.message);
    console.error("🔍 Detalhes do erro:", error);
    throw error;
  }
}

async function salvarNoSheets(dados) {
  try {
    console.log("🔍 Iniciando salvamento no Sheets com dados:", dados);

    if (!doc.auth) {
      console.log("🔧 Inicializando autenticação...");
      doc.auth = criarAuth();
      await doc.loadInfo();
    }

    const sheet = doc.sheetsByIndex[0];
    console.log("📊 Planilha encontrada:", sheet.title);

    const dadosParaSalvar = {
      Nome: dados.nome || "",
      Nascimento: dados.nascimento || "",
      CPF: dados.cpf || "",
      Telefone: dados.telefone || "",
      Email: dados.email || "",
      CEP: dados.cep || "",
      Rua: dados.rua || "",
      Número: dados.numero || "",
      Bairro: dados.bairro || "",
      Complemento: dados.complemento || "",
      Menor_Idade: dados.menor_idade || "",
      Ação_Inglaterra: dados.acao_inglaterra || "",
      Indigena_Quilombola: dados.indigena_quilombola || "",
      Mesmo_Endereco_Romp: dados.mesmo_endereco_romp || "",
      Dano_Fisico_Medico: dados.dano_fisico_medico || "",
      Tipo_Dano_Fisico: dados.tipo_dano_fisico || "",
      Diagnostico_Dano_Fisico: dados.diagnostico_dano_fisico || "",
      Consequencias_Dano: dados.consequencias_dano || "",
      Transtorno_Psiquiatrico: dados.transtorno_psiquiatrico || "",
      Diagnostico_Psiquiatrico: dados.diagnostico_psiquiatrico || "",
      Consequencias_Psiquiatrico: dados.consequencias_psiquiatrico || "",
      Perda_Propriedade: dados.perda_propriedade || "",
      Tipos_Perdas_Propriedade: dados.tipos_perdas_propriedade || "",
      Detalhes_Perdas: dados.detalhes_perdas || "",
      Mudou_Casa: dados.mudou_casa || "",
      Motivo_Mudanca: dados.motivo_mudanca || "",
      Data_Mudanca: dados.data_mudanca || "",
      Voltou_Casa_Original: dados.voltou_casa_original || "",
      Destino_Mudanca: dados.destino_mudanca || "",
      Perdeu_Fonte_Alimento: dados.perdeu_fonte_alimento || "",
      Quando_Perda_Alimento: dados.quando_perda_alimento || "",
      Perda_Alimento_Continua: dados.perda_alimento_continua || "",
      Despesas_Perda_Alimento: dados.despesas_perda_alimento || "",
      Outras_Despesas_Alimento: dados.outras_despesas_alimento || "",
      Renda_Afetada: dados.renda_afetada || "",
      Motivos_Renda_Afetada: dados.motivos_renda_afetada || "",
      Quando_Renda_Afetada: dados.quando_renda_afetada || "",
      Reducao_Renda_Persiste: dados.reducao_renda_persiste || "",
      Valor_Perda_Renda_Mensal: dados.valor_perda_renda_mensal || "",
      Energia_Afetada: dados.energia_afetada || "",
      Tipo_Problema_Energia: dados.tipo_problema_energia || "",
      Quando_Problema_Energia: dados.quando_problema_energia || "",
      Despesas_Energia: dados.despesas_energia || "",
      Outras_Despesas_Energia: dados.outras_despesas_energia || "",
      Uso_Rio_Mar_Afetado: dados.uso_rio_mar_afetado || "",
      Como_Uso_Rio_Afetado: dados.como_uso_rio_afetado || "",
      Outros_Usos_Rio_Afetados: dados.outros_usos_rio_afetados || "",
      Quando_Percebeu_Perdas_Rio: dados.quando_percebeu_perdas_rio || "",
      Uso_Terra_Afetado: dados.uso_terra_afetado || "",
      Como_Uso_Terra_Afetado: dados.como_uso_terra_afetado || "",
      Outros_Impactos_Terra: dados.outros_impactos_terra || "",
      Quando_Percebeu_Perdas_Terra: dados.quando_percebeu_perdas_terra || "",
      Uso_Rios_Mar_Afetado_2: dados.uso_rios_mar_afetado_2 || "",
      Atividades_Pesca: dados.atividades_pesca || "",
      Outros_Usos_Recursos_Hidricos: dados.outros_usos_recursos_hidricos || "",
      Outros_Usos_Descricao: dados.outros_usos_descricao || "",
      Quando_Percebeu_Problemas_Hidricos:
        dados.quando_percebeu_problemas_hidricos || "",
      Uso_Terra_Afetado_2: dados.uso_terra_afetado_2 || "",
      Como_Terra_Afetada: dados.como_terra_afetada || "",
      Quando_Percebeu_Perda_Terra: dados.quando_percebeu_perda_terra || "",
      Outros_Prejuizos_Materiais: dados.outros_prejuizos_materiais || "",
      Especificar_Prejuizos_Materiais:
        dados.especificar_prejuizos_materiais || "",
      Indenizacao_Recebida: dados.indenizacao_recebida || "",
      Aderiu_Repactuacao: dados.aderiu_repactuacao || "",
      Tipo_Iniciativa_Repactuacao: dados.tipo_iniciativa_repactuacao || "",
      Recebeu_Proposta_Indenizacao: dados.recebeu_proposta_indenizacao || "",
      Recebeu_Indenizacao_Programas: dados.recebeu_indenizacao_programas || "",
      Morador_Bento_Paracatu: dados.morador_bento_paracatu || "",
      Compensacao_Nao_Financeira: dados.compensacao_nao_financeira || "",
      Cadastrou_Compensacao: dados.cadastrou_compensacao || "",
      Contato_Compensacao: dados.contato_compensacao || "",
      Quem_Indicou: dados.quem_indicou || "",
    };

    console.log("💾 Dados formatados para salvamento:", dadosParaSalvar);

    await sheet.addRow(dadosParaSalvar);
    console.log("✅ Dados salvos com sucesso na planilha!");
  } catch (error) {
    console.error("❌ Erro detalhado ao salvar na planilha:", error);
    console.error("Stack trace:", error.stack);
    throw error;
  }
}

module.exports = { inicializarPlanilha, salvarNoSheets };
