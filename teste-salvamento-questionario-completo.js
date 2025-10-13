const { salvarNoSheets } = require("./google/sheets");

// Simular o estado completo que foi testado
const estadoCompleto = {
  // Dados do cadastro
  nome: "Maria Silva",
  cpf: "12345678901",
  nascimento: "15/05/1980",
  telefone: "11987654321",
  email: "maria@teste.com",
  // Dados do endereço
  cep: "01234567",
  rua: "Rua das Flores",
  numero: "123",
  complemento: "Apto 45",
  bairro: "Centro",

  // Dados de saúde
  saudeProblemas: true,
  saudeTipos: ["Problemas de pele", "Dor de barriga"],
  saudeOutros: "Dores de cabeça",
  saudeContinua: true,
  saudeQuando: {
    mes: "03",
    ano: "2023",
    descricao: "Começou no início do ano",
  },
  saudeDiagnostico: true,
  saudeDiagnosticoQual: "Dermatite alérgica",
  saudeRenda: true,
  saudeRendaContinua: false,

  // Dados emocionais
  emocionalProblemas: true,
  emocionalTipos: ["Ansiedade", "Depressão"],
  emocionalOutros: "Insônia",
  emocionalQuando: { mes: "04", ano: "2023" },
  emocionalExiste: true,
  emocionalAtrapalhou: true,
  emocionalAtestado: false,
  emocionalGastos: 800,

  // Dados de bens
  bensPerda: true,
  bensTipos: ["Casa", "Carro"],
  bensValorAntes: 200000,
  bensValorDepois: 50000,
  bensQuando: { mes: "05", ano: "2023" },

  // Dados mudança
  mudancaCasa: true,
  mudancaMotivo: ["Destruição da casa", "Problemas de saúde"],
  mudancaOutros: "Contaminação do solo",
  mudancaQuando: { mes: "06", ano: "2023" },
  mudancaVoltou: false,
  mudancaMoradia: "Alugada",
  mudancaGastos: true,

  // Dados alimentação
  alimentacaoFonte: true,
  alimentacaoQuando: { mes: "07", ano: "2023" },
  alimentacaoSemFonte: true,
  alimentacaoGastos: ["Compra de água", "Compra de alimentos"],
  alimentacaoOutros: "Filtros especiais",
  alimentacaoValor: 500,

  // Dados custo de vida
  custoVidaAumento: true,
  custoVidaTipos: ["Medicamentos", "Transporte"],
  custoVidaQuando: { mes: "08", ano: "2023" },
  custoVidaValor: 300,

  // Dados renda
  rendaPrejuizo: true,
  rendaMotivos: ["Doença", "Mudança"],
  rendaQuando: { mes: "09", ano: "2023" },
  rendaValor: 2000,

  // Dados água
  aguaProblemas: true,
  aguaTipos: ["Cor alterada", "Gosto ruim"],
  aguaContinua: true,
  aguaTempo: "Há 2 anos",
  aguaGastos: ["Compra de água", "Filtros"],
  aguaOutros: "Análises laboratoriais",
  aguaValor: 200,

  // Dados rio/terra
  rioTerraRio: true,
  rioTerraTerra: true,
  rioTerraUsos: ["Pesca", "Agricultura"],
  rioTerraOutros: "Criação de animais",
  rioTerraQuando: { mes: "10", ano: "2023" },

  // Dados indenização
  indenizacaoProcesso: false,
  indenizacaoRecebidas: [],
  indenizacaoQuando: { mes: "", ano: "" },
  indenizacaoCadastrado: true,
  indenizacaoContato: true,

  // Documentos
  documentoFrente: true,
  documentoVerso: true,

  // Contrato
  contratoAceito: true,
  textoAutorizacao:
    "Eu Maria Silva, li, concordo e autorizo a utilização dos meus dados no processo e que o Dr. Igor assine em meu nome.",
  indicadoPor: "Dr. Igor",
};

async function testarSalvamentoCompleto() {
  console.log("🧪 Testando salvamento com questionário completo...");

  // Preparar dados igual ao código real da função salvarDadosCompletos
  const dadosParaSalvar = {
    timestamp: new Date().toISOString(),
    id: "teste-questionario-completo",
    nome: estadoCompleto.nome || "",
    cpf: estadoCompleto.cpf || "",
    nascimento: estadoCompleto.nascimento || "",
    telefone: estadoCompleto.telefone || "",
    email: estadoCompleto.email || "",
    cep: estadoCompleto.cep || "",
    rua: estadoCompleto.rua || "",
    numero: estadoCompleto.numero || "",
    complemento: estadoCompleto.complemento || "",
    bairro: estadoCompleto.bairro || "",

    // Dados de saúde física
    saude_problemas: estadoCompleto.saudeProblemas || false,
    saude_tipos: estadoCompleto.saudeTipos
      ? estadoCompleto.saudeTipos.join("; ")
      : "",
    saude_outros: estadoCompleto.saudeOutros || "",
    saude_continua: estadoCompleto.saudeContinua || false,
    saude_quando_mes: estadoCompleto.saudeQuando?.mes || "",
    saude_quando_ano: estadoCompleto.saudeQuando?.ano || "",
    saude_quando_descricao: estadoCompleto.saudeQuando?.descricao || "",
    saude_diagnostico: estadoCompleto.saudeDiagnostico || false,
    saude_diagnostico_qual: estadoCompleto.saudeDiagnosticoQual || "",
    saude_renda_afetou: estadoCompleto.saudeRenda || false,
    saude_renda_continua: estadoCompleto.saudeRendaContinua || false,

    // Dados emocionais/psicológicos
    emocional_problemas: estadoCompleto.emocionalProblemas || false,
    emocional_tipos: estadoCompleto.emocionalTipos
      ? estadoCompleto.emocionalTipos.join("; ")
      : "",
    emocional_outros: estadoCompleto.emocionalOutros || "",
    emocional_quando_mes: estadoCompleto.emocionalQuando?.mes || "",
    emocional_quando_ano: estadoCompleto.emocionalQuando?.ano || "",
    emocional_existe: estadoCompleto.emocionalExiste || false,
    emocional_atrapalhou: estadoCompleto.emocionalAtrapalhou || false,
    emocional_atestado: estadoCompleto.emocionalAtestado || false,
    emocional_gastos: estadoCompleto.emocionalGastos || 0,

    // Dados de perda de bens
    bens_perda: estadoCompleto.bensPerda || false,
    bens_tipos: estadoCompleto.bensTipos
      ? estadoCompleto.bensTipos.join("; ")
      : "",
    bens_valor_antes: estadoCompleto.bensValorAntes || 0,
    bens_valor_depois: estadoCompleto.bensValorDepois || 0,
    bens_quando_mes: estadoCompleto.bensQuando?.mes || "",
    bens_quando_ano: estadoCompleto.bensQuando?.ano || "",
    bens_perda_valor:
      estadoCompleto.bensValorAntes && estadoCompleto.bensValorDepois
        ? estadoCompleto.bensValorAntes - estadoCompleto.bensValorDepois
        : 0,

    // Dados de mudança de casa
    mudanca_casa: estadoCompleto.mudancaCasa || false,
    mudanca_motivo: estadoCompleto.mudancaMotivo
      ? estadoCompleto.mudancaMotivo.join("; ")
      : "",
    mudanca_outros: estadoCompleto.mudancaOutros || "",
    mudanca_quando_mes: estadoCompleto.mudancaQuando?.mes || "",
    mudanca_quando_ano: estadoCompleto.mudancaQuando?.ano || "",
    mudanca_voltou: estadoCompleto.mudancaVoltou || false,
    mudanca_moradia_tipo: estadoCompleto.mudancaMoradia || "",
    mudanca_gastos: estadoCompleto.mudancaGastos || false,

    // Dados de alimentação
    alimentacao_fonte_perda: estadoCompleto.alimentacaoFonte || false,
    alimentacao_quando_mes: estadoCompleto.alimentacaoQuando?.mes || "",
    alimentacao_quando_ano: estadoCompleto.alimentacaoQuando?.ano || "",
    alimentacao_sem_fonte: estadoCompleto.alimentacaoSemFonte || false,
    alimentacao_gastos_tipos: estadoCompleto.alimentacaoGastos
      ? estadoCompleto.alimentacaoGastos.join("; ")
      : "",
    alimentacao_outros: estadoCompleto.alimentacaoOutros || "",
    alimentacao_valor_mensal: estadoCompleto.alimentacaoValor || 0,

    // Dados de custo de vida
    custo_vida_aumento: estadoCompleto.custoVidaAumento || false,
    custo_vida_tipos: estadoCompleto.custoVidaTipos
      ? estadoCompleto.custoVidaTipos.join("; ")
      : "",
    custo_vida_quando_mes: estadoCompleto.custoVidaQuando?.mes || "",
    custo_vida_quando_ano: estadoCompleto.custoVidaQuando?.ano || "",
    custo_vida_valor_mensal: estadoCompleto.custoVidaValor || 0,

    // Dados de prejuízo na renda
    renda_prejudicada: estadoCompleto.rendaPrejuizo || false,
    renda_motivos: estadoCompleto.rendaMotivos
      ? estadoCompleto.rendaMotivos.join("; ")
      : "",
    renda_quando_mes: estadoCompleto.rendaQuando?.mes || "",
    renda_quando_ano: estadoCompleto.rendaQuando?.ano || "",
    renda_valor_perdido: estadoCompleto.rendaValor || 0,

    // Dados de problemas com água
    agua_problemas: estadoCompleto.aguaProblemas || false,
    agua_tipos: estadoCompleto.aguaTipos
      ? estadoCompleto.aguaTipos.join("; ")
      : "",
    agua_continua: estadoCompleto.aguaContinua || false,
    agua_tempo_descricao: estadoCompleto.aguaTempo || "",
    agua_gastos_tipos: estadoCompleto.aguaGastos
      ? estadoCompleto.aguaGastos.join("; ")
      : "",
    agua_outros: estadoCompleto.aguaOutros || "",
    agua_valor_mensal: estadoCompleto.aguaValor || 0,

    // Dados de uso do rio e terra
    rio_terra_perdeu_rio: estadoCompleto.rioTerraRio || false,
    rio_terra_perdeu_terra: estadoCompleto.rioTerraTerra || false,
    rio_terra_usos: estadoCompleto.rioTerraUsos
      ? estadoCompleto.rioTerraUsos.join("; ")
      : "",
    rio_terra_outros: estadoCompleto.rioTerraOutros || "",
    rio_terra_quando_mes: estadoCompleto.rioTerraQuando?.mes || "",
    rio_terra_quando_ano: estadoCompleto.rioTerraQuando?.ano || "",

    // Dados de indenizações ou ações
    indenizacao_processou: estadoCompleto.indenizacaoProcesso || false,
    indenizacao_tipos_recebidas: estadoCompleto.indenizacaoRecebidas
      ? estadoCompleto.indenizacaoRecebidas.join("; ")
      : "",
    indenizacao_quando_mes: estadoCompleto.indenizacaoQuando?.mes || "",
    indenizacao_quando_ano: estadoCompleto.indenizacaoQuando?.ano || "",
    indenizacao_cadastrado: estadoCompleto.indenizacaoCadastrado || false,
    indenizacao_foi_contatado: estadoCompleto.indenizacaoContato || false,

    // Dados de documentos
    documento_frente_enviado: estadoCompleto.documentoFrente || false,
    documento_verso_enviado: estadoCompleto.documentoVerso || false,

    // Dados do contrato
    contrato_aceito: estadoCompleto.contratoAceito || false,
    texto_autorizacao: estadoCompleto.textoAutorizacao || "",
    indicado_por: estadoCompleto.indicadoPor || "",

    status: "questionario_completo",
    observacoes:
      "Questionário completo: todas as seções de impactos, indenizações, documentos e contrato foram preenchidas",
  };

  console.log("📋 Resumo dos dados a serem salvos:");
  console.log("✅ saude_problemas:", dadosParaSalvar.saude_problemas);
  console.log("✅ saude_tipos:", dadosParaSalvar.saude_tipos);
  console.log("✅ emocional_problemas:", dadosParaSalvar.emocional_problemas);
  console.log("✅ emocional_tipos:", dadosParaSalvar.emocional_tipos);
  console.log("✅ bens_perda:", dadosParaSalvar.bens_perda);
  console.log("✅ bens_tipos:", dadosParaSalvar.bens_tipos);
  console.log("✅ agua_problemas:", dadosParaSalvar.agua_problemas);
  console.log("✅ agua_tipos:", dadosParaSalvar.agua_tipos);
  console.log("✅ rio_terra_perdeu_rio:", dadosParaSalvar.rio_terra_perdeu_rio);
  console.log("✅ rio_terra_usos:", dadosParaSalvar.rio_terra_usos);
  console.log(
    "✅ indenizacao_processou:",
    dadosParaSalvar.indenizacao_processou
  );
  console.log("✅ contrato_aceito:", dadosParaSalvar.contrato_aceito);
  console.log("✅ indicado_por:", dadosParaSalvar.indicado_por);

  try {
    await salvarNoSheets(dadosParaSalvar);
    console.log("🎉 Teste de salvamento completo finalizado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

testarSalvamentoCompleto();
