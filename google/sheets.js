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

    const fs = require("fs");
    const path = require("path");

    const backupDir = path.join(__dirname, "..", "backup_dados");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const backupFile = path.join(backupDir, `dados_${Date.now()}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(dados, null, 2));
    console.log(`💾 Backup local salvo em: ${backupFile}`);

    if (!doc.auth) {
      console.log("🔧 Inicializando autenticação...");
      doc.auth = criarAuth();

      console.log("⏱️ Tentando carregar planilha (com timeout de 5s)...");

      try {
        await Promise.race([
          doc.loadInfo(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout na conexão")), 5000)
          ),
        ]);
        console.log("✅ Planilha carregada com sucesso!");
      } catch (timeoutError) {
        console.error(
          "⚠️ Timeout na conexão com Google Sheets:",
          timeoutError.message
        );
        console.log("📋 Dados já salvos localmente, continuando...");
        return;
      }
    }

    const sheet = doc.sheetsByIndex[0];
    console.log("📊 Planilha encontrada:", sheet.title);

    const dadosParaSalvar = {
      timestamp: dados.timestamp || "",
      id: dados.id || "",
      nome: dados.nome || "",
      cpf: dados.cpf || "",
      nascimento: dados.nascimento || "",
      telefone: dados.telefone || "",
      email: dados.email || "",
      cep: dados.cep || "",
      rua: dados.rua || "",
      numero: dados.numero || "",
      complemento: dados.complemento || "",
      bairro: dados.bairro || "",
      saude_problemas: dados.saude_problemas || "",
      saude_tipos: dados.saude_tipos || "",
      saude_outros: dados.saude_outros || "",
      saude_continua: dados.saude_continua || "",
      saude_quando_mes: dados.saude_quando_mes || "",
      saude_quando_ano: dados.saude_quando_ano || "",
      saude_quando_descricao: dados.saude_quando_descricao || "",
      saude_diagnostico: dados.saude_diagnostico || "",
      saude_diagnostico_qual: dados.saude_diagnostico_qual || "",
      saude_renda_afetou: dados.saude_renda_afetou || "",
      saude_renda_continua: dados.saude_renda_continua || "",
      emocional_problemas: dados.emocional_problemas || "",
      emocional_tipos: dados.emocional_tipos || "",
      emocional_outros: dados.emocional_outros || "",
      emocional_quando_mes: dados.emocional_quando_mes || "",
      emocional_quando_ano: dados.emocional_quando_ano || "",
      emocional_existe: dados.emocional_existe || "",
      emocional_atrapalhou: dados.emocional_atrapalhou || "",
      emocional_atestado: dados.emocional_atestado || "",
      emocional_gastos: dados.emocional_gastos || "",
      bens_perda: dados.bens_perda || "",
      bens_tipos: dados.bens_tipos || "",
      bens_valor_antes: dados.bens_valor_antes || "",
      bens_valor_depois: dados.bens_valor_depois || "",
      bens_quando_mes: dados.bens_quando_mes || "",
      bens_quando_ano: dados.bens_quando_ano || "",
      bens_perda_valor: dados.bens_perda_valor || "",
      mudanca_casa: dados.mudanca_casa || "",
      mudanca_motivo: dados.mudanca_motivo || "",
      mudanca_outros: dados.mudanca_outros || "",
      mudanca_quando_mes: dados.mudanca_quando_mes || "",
      mudanca_quando_ano: dados.mudanca_quando_ano || "",
      mudanca_voltou: dados.mudanca_voltou || "",
      mudanca_moradia_tipo: dados.mudanca_moradia_tipo || "",
      mudanca_gastos: dados.mudanca_gastos || "",
      alimentacao_fonte_perda: dados.alimentacao_fonte_perda || "",
      alimentacao_quando_mes: dados.alimentacao_quando_mes || "",
      alimentacao_quando_ano: dados.alimentacao_quando_ano || "",
      alimentacao_sem_fonte: dados.alimentacao_sem_fonte || "",
      alimentacao_gastos_tipos: dados.alimentacao_gastos_tipos || "",
      alimentacao_outros: dados.alimentacao_outros || "",
      alimentacao_valor_mensal: dados.alimentacao_valor_mensal || "",
      custo_vida_aumento: dados.custo_vida_aumento || "",
      custo_vida_tipos: dados.custo_vida_tipos || "",
      custo_vida_quando_mes: dados.custo_vida_quando_mes || "",
      custo_vida_quando_ano: dados.custo_vida_quando_ano || "",
      custo_vida_valor_mensal: dados.custo_vida_valor_mensal || "",
      renda_prejudicada: dados.renda_prejudicada || "",
      renda_motivos: dados.renda_motivos || "",
      renda_quando_mes: dados.renda_quando_mes || "",
      renda_quando_ano: dados.renda_quando_ano || "",
      renda_valor_perdido: dados.renda_valor_perdido || "",
      agua_problemas: dados.agua_problemas || "",
      agua_tipos: dados.agua_tipos || "",
      agua_continua: dados.agua_continua || "",
      agua_tempo_descricao: dados.agua_tempo_descricao || "",
      agua_gastos_tipos: dados.agua_gastos_tipos || "",
      agua_outros: dados.agua_outros || "",
      agua_valor_mensal: dados.agua_valor_mensal || "",
      rio_terra_perdeu_rio: dados.rio_terra_perdeu_rio || "",
      rio_terra_perdeu_terra: dados.rio_terra_perdeu_terra || "",
      rio_terra_usos: dados.rio_terra_usos || "",
      rio_terra_outros: dados.rio_terra_outros || "",
      rio_terra_quando_mes: dados.rio_terra_quando_mes || "",
      rio_terra_quando_ano: dados.rio_terra_quando_ano || "",
      indenizacao_processou: dados.indenizacao_processou || "",
      indenizacao_tipos_recebidas: dados.indenizacao_tipos_recebidas || "",
      indenizacao_quando_mes: dados.indenizacao_quando_mes || "",
      indenizacao_quando_ano: dados.indenizacao_quando_ano || "",
      indenizacao_cadastrado: dados.indenizacao_cadastrado || "",
      indenizacao_foi_contatado: dados.indenizacao_foi_contatado || "",
      documento_frente_enviado: dados.documento_frente_enviado || "",
      documento_verso_enviado: dados.documento_verso_enviado || "",
      contrato_aceito: dados.contrato_aceito || "",
      texto_autorizacao: dados.texto_autorizacao || "",
      indicado_por: dados.indicado_por || "",
      status: dados.status || "",
      observacoes: dados.observacoes || "",
    };

    console.log("💾 Dados formatados para salvamento:", dadosParaSalvar);

    const addRowPromise = sheet.addRow(dadosParaSalvar);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error("Timeout ao salvar na planilha")),
        10000
      );
    });

    try {
      await Promise.race([addRowPromise, timeoutPromise]);
      console.log("✅ Dados salvos com sucesso na planilha!");
    } catch (saveError) {
      console.error("⚠️ Erro ao salvar na planilha:", saveError.message);
      console.log("📋 Dados já estão salvos localmente como backup");
    }
  } catch (error) {
    console.error("❌ Erro detalhado ao salvar na planilha:", error);
    console.error("Stack trace:", error.stack);

    try {
      const fs = require("fs");
      const path = require("path");

      const backupDir = path.join(__dirname, "..", "backup_dados");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupFile = path.join(backupDir, `dados_erro_${Date.now()}.json`);
      fs.writeFileSync(backupFile, JSON.stringify(dados, null, 2));
      console.log(`💾 Backup de emergência salvo em: ${backupFile}`);
    } catch (backupError) {
      console.error("❌ Erro também no backup local:", backupError);
    }

    console.log("⚠️ Continuando fluxo apesar do erro no Google Sheets");
  }
}

module.exports = { inicializarPlanilha, salvarNoSheets };
