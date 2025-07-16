// Teste específico para identificar o erro no salvamento

const { getEstado, setEstado, limparEstado } = require("./utils/estados");
const { salvarNoSheets } = require("./google/sheets.js");

async function testarSalvamento() {
  console.log("🧪 TESTE ESPECÍFICO - SALVAMENTO NO SHEETS\n");

  // Dados básicos como aparecem no teste
  const dadosCompletos = {
    nome: "João Teste",
    nascimento: "", // Campo em branco
    cpf: "", // Campo em branco
    telefone: "11999999999",
    email: "joao@teste.com",
    cep: "", // Campo em branco
    rua: "", // Campo em branco
    numero: "", // Campo em branco
    bairro: "", // Campo em branco
    complemento: "", // Campo em branco
    menor_idade: "", // Campo em branco
    acao_inglaterra: "sim",
    indigena_quilombola: "não",
    mesmo_endereco_romp: "não",
    dano_fisico_medico: "não",
    tipo_dano_fisico: "",
    diagnostico_dano_fisico: "",
    consequencias_dano: "",
    transtorno_psiquiatrico: "não",
    diagnostico_psiquiatrico: "",
    consequencias_psiquiatrico: "",
    perda_propriedade: "não",
    tipos_perdas_propriedade: "",
    detalhes_perdas: "",
    mudou_casa: "não",
    motivo_mudanca: "",
    data_mudanca: "",
    voltou_casa_original: "",
    destino_mudanca: "",
    perdeu_fonte_alimento: "",
    quando_perda_alimento: "",
    perda_alimento_continua: "",
    despesas_perda_alimento: "",
    outras_despesas_alimento: "",
    renda_afetada: "",
    motivos_renda_afetada: "",
    quando_renda_afetada: "",
    reducao_renda_persiste: "",
    valor_perda_renda_mensal: "",
    energia_afetada: "",
    tipo_problema_energia: "",
    quando_problema_energia: "",
    despesas_energia: "",
    outras_despesas_energia: "",
    uso_rio_mar_afetado: "",
    como_uso_rio_afetado: "",
    outros_usos_rio_afetados: "",
    quando_percebeu_perdas_rio: "",
    uso_terra_afetado: "",
    como_uso_terra_afetado: "",
    outros_impactos_terra: "",
    quando_percebeu_perdas_terra: "",
    uso_rios_mar_afetado_2: "",
    atividades_pesca: "",
    outros_usos_recursos_hidricos: "",
    outros_usos_descricao: "",
    quando_percebeu_problemas_hidricos: "",
    uso_terra_afetado_2: "",
    como_terra_afetada: "",
    quando_percebeu_perda_terra: "",
    outros_prejuizos_materiais: "",
    especificar_prejuizos_materiais: "",
    indenizacao_recebida: "",
    aderiu_repactuacao: "",
    tipo_iniciativa_repactuacao: "",
    recebeu_proposta_indenizacao: "",
    recebeu_indenizacao_programas: "",
    morador_bento_paracatu: "",
    compensacao_nao_financeira: "",
    cadastrou_compensacao: "",
    contato_compensacao: "",
    quem_indicou: "",
  };

  console.log("📊 Testando salvamento com dados limpos (sem undefined):");
  console.log(`   - Nome: ${dadosCompletos.nome}`);
  console.log(`   - Telefone: ${dadosCompletos.telefone}`);
  console.log(`   - Email: ${dadosCompletos.email}`);
  console.log(
    `   - Campos vazios: ${
      Object.values(dadosCompletos).filter((v) => v === "").length
    }`
  );
  console.log(
    `   - Campos undefined: ${
      Object.values(dadosCompletos).filter((v) => v === undefined).length
    }\n`
  );

  try {
    console.log("🚀 Iniciando salvamento...");
    await salvarNoSheets(dadosCompletos);
    console.log("✅ SUCESSO! Dados salvos no Google Sheets!");
  } catch (error) {
    console.log("❌ ERRO IDENTIFICADO:");
    console.log(`   Tipo: ${error.name}`);
    console.log(`   Mensagem: ${error.message}`);

    if (error.stack) {
      console.log("\n📍 Stack trace:");
      console.log(error.stack);
    }

    // Verificar se é erro de autenticação
    if (
      error.message.includes("auth") ||
      error.message.includes("credential")
    ) {
      console.log("\n💡 Possível problema de autenticação Google Sheets");
    }

    // Verificar se é erro de rede
    if (
      error.message.includes("network") ||
      error.message.includes("timeout")
    ) {
      console.log("\n💡 Possível problema de rede");
    }

    // Verificar se é erro de dados
    if (error.message.includes("data") || error.message.includes("field")) {
      console.log("\n💡 Possível problema com formato dos dados");
    }
  }
}

// Teste com dados que têm undefined (como no erro original)
async function testarComUndefined() {
  console.log(
    "\n━━━ TESTE 2: Com campos undefined (simulando erro original) ━━━"
  );

  const dadosComUndefined = {
    nome: "João Teste",
    nascimento: undefined, // ← Pode causar problema
    cpf: undefined, // ← Pode causar problema
    telefone: "11999999999",
    email: "joao@teste.com",
    cep: undefined, // ← Pode causar problema
    // ... outros campos undefined
    acao_inglaterra: "sim",
    indigena_quilombola: "não",
  };

  console.log("📊 Testando com campos undefined:");
  console.log(
    `   - Campos undefined: ${
      Object.values(dadosComUndefined).filter((v) => v === undefined).length
    }`
  );

  try {
    await salvarNoSheets(dadosComUndefined);
    console.log("✅ Funcionou mesmo com undefined!");
  } catch (error) {
    console.log("❌ ERRO com undefined:");
    console.log(`   Mensagem: ${error.message}`);
  }
}

async function executarTestes() {
  await testarSalvamento();
  await testarComUndefined();

  console.log("\n🎯 RESULTADO DOS TESTES:");
  console.log("Se o primeiro teste passou e o segundo falhou,");
  console.log("o problema é com campos undefined.");
  console.log("Se ambos falharam, o problema é mais geral (auth, rede, etc.)");
}

executarTestes().catch(console.error);
