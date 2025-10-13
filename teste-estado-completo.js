const { salvarNoSheets } = require("./google/sheets");

async function testarEstadoCompleto() {
  console.log("🧪 Testando dados do questionário completo...");

  // Simular um estado como se o usuário tivesse completado o questionário
  const estadoSimulado = {
    // Dados básicos
    nome: "João Silva",
    cpf: "12345678901",
    telefone: "11987654321",
    email: "joao@teste.com",

    // Dados de saúde
    saudeProblemas: true,
    saudeTipos: ["Problemas de pele", "Dor de barriga"],
    saudeOutros: "Dor de cabeça constante",
    saudeContinua: true,
    saudeQuando: { mes: "05", ano: "2023", descricao: "Começou em maio" },
    saudeDiagnostico: true,
    saudeDiagnosticoQual: "Dermatite",
    saudeRenda: true,
    saudeRendaContinua: false,

    // Dados emocionais
    emocionalProblemas: true,
    emocionalTipos: ["Ansiedade", "Depressão"],
    emocionalOutros: "Insônia",
    emocionalQuando: { mes: "06", ano: "2023" },
    emocionalExiste: true,
    emocionalAtrapalhou: true,
    emocionalAtestado: false,
    emocionalGastos: 500,

    // Contrato
    contratoAceito: true,
    textoAutorizacao: "Eu João Silva, li, concordo...",
    indicadoPor: "Dr. Igor",
  };

  // Preparar dados igual ao código real
  const dadosParaSalvar = {
    timestamp: new Date().toISOString(),
    id: "teste-estado-completo",
    nome: estadoSimulado.nome || "",
    cpf: estadoSimulado.cpf || "",
    telefone: estadoSimulado.telefone || "",
    email: estadoSimulado.email || "",

    // Dados de saúde física
    saude_problemas: estadoSimulado.saudeProblemas || false,
    saude_tipos: estadoSimulado.saudeTipos
      ? estadoSimulado.saudeTipos.join("; ")
      : "",
    saude_outros: estadoSimulado.saudeOutros || "",
    saude_continua: estadoSimulado.saudeContinua || false,
    saude_quando_mes: estadoSimulado.saudeQuando?.mes || "",
    saude_quando_ano: estadoSimulado.saudeQuando?.ano || "",
    saude_quando_descricao: estadoSimulado.saudeQuando?.descricao || "",
    saude_diagnostico: estadoSimulado.saudeDiagnostico || false,
    saude_diagnostico_qual: estadoSimulado.saudeDiagnosticoQual || "",
    saude_renda_afetou: estadoSimulado.saudeRenda || false,
    saude_renda_continua: estadoSimulado.saudeRendaContinua || false,

    // Dados emocionais/psicológicos
    emocional_problemas: estadoSimulado.emocionalProblemas || false,
    emocional_tipos: estadoSimulado.emocionalTipos
      ? estadoSimulado.emocionalTipos.join("; ")
      : "",
    emocional_outros: estadoSimulado.emocionalOutros || "",
    emocional_quando_mes: estadoSimulado.emocionalQuando?.mes || "",
    emocional_quando_ano: estadoSimulado.emocionalQuando?.ano || "",
    emocional_existe: estadoSimulado.emocionalExiste || false,
    emocional_atrapalhou: estadoSimulado.emocionalAtrapalhou || false,
    emocional_atestado: estadoSimulado.emocionalAtestado || false,
    emocional_gastos: estadoSimulado.emocionalGastos || 0,

    // Contrato
    contrato_aceito: estadoSimulado.contratoAceito || false,
    texto_autorizacao: estadoSimulado.textoAutorizacao || "",
    indicado_por: estadoSimulado.indicadoPor || "",
  };

  console.log("📋 Dados que serão salvos:");
  console.log("saude_problemas:", dadosParaSalvar.saude_problemas);
  console.log("saude_tipos:", dadosParaSalvar.saude_tipos);
  console.log("emocional_problemas:", dadosParaSalvar.emocional_problemas);
  console.log("emocional_tipos:", dadosParaSalvar.emocional_tipos);
  console.log("contrato_aceito:", dadosParaSalvar.contrato_aceito);
  console.log("indicado_por:", dadosParaSalvar.indicado_por);

  try {
    await salvarNoSheets(dadosParaSalvar);
    console.log("✅ Teste de estado completo concluído!");
  } catch (error) {
    console.error("❌ Erro no teste:", error);
  }
}

testarEstadoCompleto();
