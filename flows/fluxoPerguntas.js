const { getEstado, setEstado, limparEstado } = require("../utils/estados");
const { salvarNoSheets } = require("../google/sheets");
const { protecao } = require("../utils/protecaoAntiBot");
const { protecaoSimples } = require("../utils/protecaoSimples");
const { enviarMensagemRobusta } = require("../utils/envioRobusto");
const path = require("path");
const fs = require("fs");

// Função para enviar mensagem com proteção anti-bot (versão simplificada)
async function enviarMensagemSegura(client, id, mensagem, tipo = "normal") {
  try {
    console.log(
      `📤 [DEBUG] Enviando mensagem para ${id}: ${mensagem.substring(0, 50)}...`
    );

    // Delay simples de 1-2 segundos
    const delay = Math.floor(Math.random() * 1000) + 1000; // 1-2 segundos
    await new Promise((resolve) => setTimeout(resolve, delay));

    // Enviar mensagem diretamente
    await client.sendText(id, mensagem);

    console.log(`✅ [DEBUG] Mensagem enviada com sucesso para ${id}`);
  } catch (error) {
    console.error(`❌ [DEBUG] Erro ao enviar mensagem para ${id}:`, error);
    throw error;
  }
}

// Função helper para envio mais simples
async function enviarComSeguranca(client, id, mensagem) {
  console.log(`📤 Enviando: ${mensagem.substring(0, 100)}...`);

  // Delay de 1.5 segundos fixo
  await new Promise((resolve) => setTimeout(resolve, 1500));

  try {
    await client.sendText(id, mensagem);
    console.log(`✅ Mensagem enviada com sucesso`);
  } catch (error) {
    console.error(`❌ Erro ao enviar mensagem:`, error);
    throw error;
  }
}

// Estrutura de mensagens limpa - pronta para nova configuração
const mensagens = {
  inicio:
    "📝 *Terceira Etapa - Questionário Final*\n\n" +
    "Agora vamos fazer algumas perguntas para finalizar seu cadastro.\n\n" +
    "💡 Digite *cancelar* a qualquer momento para sair.",

  // SEÇÃO 2: PROBLEMAS DE SAÚDE FÍSICA
  saudeProblemas:
    "🏥 *2. Problemas de Saúde Física*\n\n" +
    "Estamos perguntando se você teve algum problema de saúde no corpo depois do desastre. Isso ajuda a mostrar os danos à sua saúde.\n\n" +
    "❓ *Você teve problemas físicos depois da barragem?*\n\n" +
    "👉 *Sim* ou *Não*",

  saudeTipos:
    "🩺 *2.1 Se sim, marque os que teve:*\n\n" +
    "Digite o *número* ou *letra* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*a)* Problemas de pele\n" +
    "*b)* Dor de barriga\n" +
    "*c)* Urina alterada\n" +
    "*d)* Fraturas ou machucados\n" +
    "*e)* Dores nas juntas\n" +
    "*f)* Doença no sangue, nervos ou hormônios\n" +
    "*g)* Outros\n\n" +
    "_Exemplo: a,c,e ou 1,3,5_",

  saudeOutros:
    "📝 *2.2 Você marcou 'Outros' - descreva quais problemas:*\n\n" +
    "Digite uma descrição dos outros problemas de saúde que teve:",

  saudeContinua:
    "⏰ *2.3 Esses sintomas ainda continuam?*\n\n" + "👉 *Sim* ou *Não*",

  saudeQuando:
    "📅 *2.4 Quando começou a perceber que era por causa da barragem?*\n\n" +
    "Digite o mês e ano (exemplo: 11/2015) seguido da descrição:\n\n" +
    "_Formato: MM/AAAA - descrição_\n" +
    "_Exemplo: 11/2015 - por causa de exames_",

  saudeDiagnostico:
    "🔬 *2.5 Recebeu algum diagnóstico médico?*\n\n" +
    "👉 *Sim* ou *Não*\n\n" +
    "_Se sim, você poderá descrever qual diagnóstico na próxima pergunta_",

  saudeDiagnosticoQual:
    "📋 *Qual diagnóstico médico você recebeu?*\n\n" +
    "Descreva o(s) diagnóstico(s) que recebeu:",

  saudeRenda:
    "💰 *2.6 Esses problemas afetaram sua renda ou trabalho?*\n\n" +
    "👉 *Sim* ou *Não*",

  saudeRendaContinua:
    "⏳ *2.7 Ainda continua afetando sua renda/trabalho?*\n\n" +
    "👉 *Sim* ou *Não*",

  // SEÇÃO 3: PROBLEMAS EMOCIONAIS OU PSICOLÓGICOS
  emocionalProblemas:
    "🧠 *3. Problemas Emocionais ou Psicológicos*\n\n" +
    "Algumas pessoas tiveram ansiedade, depressão ou tristeza profunda depois do rompimento. Queremos saber se isso aconteceu com você.\n\n" +
    "❓ *Você teve algum sofrimento emocional ou psicológico?*\n\n" +
    "👉 *Sim* ou *Não*",

  emocionalTipos:
    "🧠 *3.1 Se sim, marque o que teve:*\n\n" +
    "Digite o *número* ou *letra* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*a)* Depressão\n" +
    "*b)* Ansiedade\n" +
    "*c)* Estresse pós-traumático\n" +
    "*d)* Abuso de álcool ou drogas\n" +
    "*e)* Não foi diagnosticado por médico\n" +
    "*f)* Outro\n\n" +
    "_Exemplo: a,b,c ou 1,2,3_",

  emocionalOutros:
    "📝 *3.2 Você marcou 'Outro' - descreva qual problema emocional:*\n\n" +
    "Digite uma descrição do problema emocional que teve:",

  emocionalQuando:
    "📅 *3.3 Quando começou?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  emocionalExiste:
    "🕐 *3.4 Os sintomas ainda existem?*\n\n" + "👉 *Sim* ou *Não*",

  emocionalAtrapalhou:
    "💼 *3.5 Te atrapalhou de viver ou trabalhar normalmente?*\n\n" +
    "👉 *Sim* ou *Não*",

  emocionalAtestado:
    "📋 *3.6 Você teve atestado médico sobre isso?*\n\n" + "👉 *Sim* ou *Não*",

  emocionalGastos:
    "💸 *3.7 Gastos com tratamento por mês:*\n\n" +
    "Digite o valor em reais que gasta por mês com tratamento (apenas números):\n\n" +
    "_Exemplo: 150 (para R$ 150,00)_\n" +
    "_Digite 0 se não tem gastos_",

  // SEÇÃO 4: PERDA DE BENS
  bensPerda:
    "🏚️ *4. Perda de Bens*\n\n" +
    "Queremos saber se você perdeu algum bem, como casa, terra, plantações ou animais.\n\n" +
    "❓ *Você perdeu, teve destruído ou danificado algum bem?*\n\n" +
    "👉 *Sim* ou *Não*",

  bensTipos:
    "📦 *4.1 O que você tinha:*\n\n" +
    "Digite o *número* correspondente aos bens que você tinha (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Casa\n" +
    "*2)* Terra\n" +
    "*3)* Plantações\n" +
    "*4)* Animais\n" +
    "*5)* Veículos\n" +
    "*6)* Barcos\n" +
    "*7)* Equipamentos\n" +
    "*8)* Bens pessoais ou sentimentais\n" +
    "*9)* Construções\n\n" +
    "_Exemplo: 1,3,5 ou 2,4,8_",

  bensValorAntes:
    "💰 *4.2 Valor dos bens antes do desastre:*\n\n" +
    "Digite o valor total em reais que seus bens valiam antes do desastre (apenas números):\n\n" +
    "_Exemplo: 150000 (para R$ 150.000,00)_\n" +
    "_Digite 0 se não sabe o valor_",

  bensValorDepois:
    "💰 *4.3 Valor depois do desastre:*\n\n" +
    "Digite o valor total em reais que seus bens valem agora após o desastre (apenas números):\n\n" +
    "_Exemplo: 50000 (para R$ 50.000,00)_\n" +
    "_Digite 0 se perdeu tudo_",

  bensQuando:
    "📅 *4.4 Quando percebeu a perda?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  // SEÇÃO 5: MUDANÇA DE CASA
  mudancaCasa:
    "🏠 *5. Mudança de Casa*\n\n" +
    "Algumas pessoas precisaram sair de casa depois do desastre. Vamos entender se isso aconteceu com você.\n\n" +
    "❓ *Você teve que se mudar?*\n\n" +
    "👉 *Sim* ou *Não*",

  mudancaMotivo:
    "🏚️ *5.1 Por qual motivo?*\n\n" +
    "Digite o *número* correspondente ao motivo (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Casa destruída\n" +
    "*2)* Risco à saúde ou segurança\n" +
    "*3)* Sem estrutura no bairro\n" +
    "*4)* Reassentamento\n" +
    "*5)* Outros\n\n" +
    "_Exemplo: 1,2 ou 3,4_",

  mudancaOutros:
    "📝 *Você marcou 'Outros' - descreva qual motivo:*\n\n" +
    "Digite uma descrição do motivo da mudança:",

  mudancaQuando:
    "📅 *5.2 Quando se mudou?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  mudancaVoltou:
    "🔄 *5.3 Conseguiu voltar para o local antigo?*\n\n" + "👉 *Sim* ou *Não*",

  mudancaMoradia:
    "🏡 *5.4 Nova moradia foi:*\n\n" +
    "Digite o *número* correspondente:\n\n" +
    "*1)* Paga por você\n" +
    "*2)* Fornecida por ONG (exceto Renova)\n" +
    "*3)* Dada pela Renova ou Samarco\n\n" +
    "_Escolha apenas uma opção_",

  mudancaGastos:
    "💰 *5.5 Você teve gastos com a mudança?*\n\n" + "👉 *Sim* ou *Não*",

  // SEÇÃO 6: ALIMENTAÇÃO
  alimentacaoFonte:
    "🍽️ *6. Alimentação*\n\n" +
    "Queremos saber se você perdeu sua fonte de alimentação e teve que gastar mais com comida.\n\n" +
    "❓ *Você perdeu sua fonte de comida (pesca, plantio, criação)?*\n\n" +
    "👉 *Sim* ou *Não*",

  alimentacaoQuando:
    "📅 *6.1 Quando isso aconteceu?*\n\n" +
    "Digite o mês e ano:\n\n" +
    "_Formato: MM/AAAA_\n" +
    "_Exemplo: 11/2015_",

  alimentacaoSemFonte:
    "🚫 *6.2 Ainda está sem essa fonte?*\n\n" + "👉 *Sim* ou *Não*",

  alimentacaoGastos:
    "💸 *6.3 Teve gastos com:*\n\n" +
    "Digite o *número* correspondente (pode escolher mais de uma opção, separadas por vírgula):\n\n" +
    "*1)* Compra de alimentos\n" +
    "*2)* Produção alternativa\n" +
    "*3)* Viagens para buscar comida\n" +
    "*4)* Outros\n\n" +
    "_Exemplo: 1,2 ou 3,4_",

  alimentacaoOutros:
    "📝 *Você marcou 'Outros' - descreva quais gastos:*\n\n" +
    "Digite uma descrição dos outros gastos com alimentação:",

  alimentacaoValor:
    "💰 *6.4 Gasto mensal:*\n\n" +
    "Digite o valor em reais que gasta por mês com alimentação (apenas números):\n\n" +
    "_Exemplo: 300 (para R$ 300,00)_\n" +
    "_Digite 0 se não tem gastos extras_",

  // Mensagens finais
  final:
    "✅ *Cadastro Finalizado!*\n\nSuas informações foram registradas com sucesso.\n\nEntraremos em contato em breve!",
};

// Função principal do fluxo de perguntas - estrutura limpa
async function fluxoPerguntas(client, msg) {
  const id = msg.from;
  const userRaw = msg.body.trim();
  const userMessage = userRaw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const estado = getEstado(id);

  console.log(
    `🎯 FluxoPerguntas - ID: ${id}, Mensagem: "${userMessage}", Etapa atual: ${estado?.etapa3}`
  );

  if (!estado?.etapa3) {
    console.error("[fluxoPerguntas] estado ou etapa3 indefinido!");
    return;
  }

  const etapa3 = estado.etapa3.trim().toLowerCase();

  // Função helper para avançar entre etapas
  const avancar = async (proximaEtapa, mensagem) => {
    console.log(`🔄 Avançando de "${etapa3}" para "${proximaEtapa}"`);
    estado.etapa3 = proximaEtapa;
    setEstado(id, estado);
    console.log(`📤 Enviando mensagem: "${mensagem.substring(0, 50)}..."`);
    await enviarComSeguranca(client, id, mensagem);
    console.log(`✅ Função avancar concluída para etapa "${proximaEtapa}"`);
  };

  switch (etapa3) {
    case "inicio":
      // Iniciar com pergunta sobre problemas de saúde
      await avancar("saude_problemas", mensagens.saudeProblemas);
      break;

    case "saude_problemas":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.saudeProblemas = true;
        await avancar("saude_tipos", mensagens.saudeTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não tive"].includes(userMessage)
      ) {
        estado.saudeProblemas = false;
        // Pular para próxima seção (seção 3)
        await avancar(
          "proxima_secao",
          "✅ *Informações registradas!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve problemas físicos\n• *NÃO* se não teve problemas"
        );
      }
      break;

    case "saude_tipos":
      // Processar seleção de tipos de problemas
      const tiposMap = {
        a: "Problemas de pele",
        b: "Dor de barriga",
        c: "Urina alterada",
        d: "Fraturas ou machucados",
        e: "Dores nas juntas",
        f: "Doença no sangue, nervos ou hormônios",
        g: "Outros",
        1: "Problemas de pele",
        2: "Dor de barriga",
        3: "Urina alterada",
        4: "Fraturas ou machucados",
        5: "Dores nas juntas",
        6: "Doença no sangue, nervos ou hormônios",
        7: "Outros",
      };

      const opcoesSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^a-g1-7,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposMap);

      if (opcoesSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite *a,b,c* ou *1,2,3* (as opções que teve)\n\n" +
            "_Exemplo: a,c,e ou 1,3,5_"
        );
        return;
      }

      const tiposSelecionados = opcoesSelecionadas.map((opt) => tiposMap[opt]);
      estado.saudeTipos = tiposSelecionados;

      console.log(`✅ Tipos selecionados: ${tiposSelecionados.join(", ")}`);

      // Se selecionou "Outros", perguntar qual
      if (
        opcoesSelecionadas.includes("g") ||
        opcoesSelecionadas.includes("7")
      ) {
        await avancar("saude_outros", mensagens.saudeOutros);
      } else {
        await avancar("saude_continua", mensagens.saudeContinua);
      }
      break;

    case "saude_outros":
      estado.saudeOutros = userRaw.trim();
      await avancar("saude_continua", mensagens.saudeContinua);
      break;

    case "saude_continua":
      if (["sim", "s", "ok", "continua", "ainda"].includes(userMessage)) {
        estado.saudeContinua = true;
      } else if (
        ["não", "nao", "n", "parou", "não continua"].includes(userMessage)
      ) {
        estado.saudeContinua = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se os sintomas ainda continuam\n• *NÃO* se os sintomas pararam"
        );
        return;
      }
      await avancar("saude_quando", mensagens.saudeQuando);
      break;

    case "saude_quando":
      // Validar formato MM/AAAA - descrição
      const regexData = /^(\d{1,2})\/(\d{4})\s*-?\s*(.+)$/;
      const matchData = userRaw.match(regexData);

      if (!matchData) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA - descrição*\n\n_Exemplo: 11/2015 - por causa de exames_"
        );
        return;
      }

      const [, mes, ano, descricao] = matchData;
      estado.saudeQuando = {
        mes: mes.padStart(2, "0"),
        ano: ano,
        descricao: descricao.trim(),
      };

      await avancar("saude_diagnostico", mensagens.saudeDiagnostico);
      break;

    case "saude_diagnostico":
      if (["sim", "s", "ok", "recebi", "sim recebi"].includes(userMessage)) {
        estado.saudeDiagnostico = true;
        await avancar("saude_diagnostico_qual", mensagens.saudeDiagnosticoQual);
      } else if (
        ["não", "nao", "n", "nenhum", "não recebi"].includes(userMessage)
      ) {
        estado.saudeDiagnostico = false;
        await avancar("saude_renda", mensagens.saudeRenda);
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se recebeu diagnóstico médico\n• *NÃO* se não recebeu"
        );
      }
      break;

    case "saude_diagnostico_qual":
      estado.saudeDiagnosticoQual = userRaw.trim();
      await avancar("saude_renda", mensagens.saudeRenda);
      break;

    case "saude_renda":
      if (["sim", "s", "ok", "afetou", "sim afetou"].includes(userMessage)) {
        estado.saudeRenda = true;
        await avancar("saude_renda_continua", mensagens.saudeRendaContinua);
      } else if (["não", "nao", "n", "não afetou"].includes(userMessage)) {
        estado.saudeRenda = false;
        // Finalizar seção 2, ir para próxima
        await avancar(
          "proxima_secao",
          "✅ *Seção de Saúde Física concluída!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se afetou renda/trabalho\n• *NÃO* se não afetou"
        );
      }
      break;

    case "saude_renda_continua":
      if (["sim", "s", "ok", "continua", "ainda"].includes(userMessage)) {
        estado.saudeRendaContinua = true;
      } else if (
        ["não", "nao", "n", "parou", "não continua"].includes(userMessage)
      ) {
        estado.saudeRendaContinua = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se ainda afeta\n• *NÃO* se não afeta mais"
        );
        return;
      }

      // Finalizar seção 2
      await avancar(
        "proxima_secao",
        "✅ *Seção de Saúde Física concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "proxima_secao":
      // Iniciar seção 3 - Problemas Emocionais
      await avancar("emocional_problemas", mensagens.emocionalProblemas);
      break;

    case "emocional_problemas":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.emocionalProblemas = true;
        await avancar("emocional_tipos", mensagens.emocionalTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não tive"].includes(userMessage)
      ) {
        estado.emocionalProblemas = false;
        // Pular para próxima seção (seção 4)
        await avancar(
          "secao4",
          "✅ *Seção Emocional registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve problemas emocionais\n• *NÃO* se não teve problemas"
        );
      }
      break;

    case "emocional_tipos":
      // Processar seleção de tipos de problemas emocionais
      const tiposEmocionalMap = {
        a: "Depressão",
        b: "Ansiedade",
        c: "Estresse pós-traumático",
        d: "Abuso de álcool ou drogas",
        e: "Não foi diagnosticado por médico",
        f: "Outro",
        1: "Depressão",
        2: "Ansiedade",
        3: "Estresse pós-traumático",
        4: "Abuso de álcool ou drogas",
        5: "Não foi diagnosticado por médico",
        6: "Outro",
      };

      const opcoesEmocionalSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^a-f1-6,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposEmocionalMap);

      if (opcoesEmocionalSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite *a,b,c* ou *1,2,3* (as opções que teve)\n\n" +
            "_Exemplo: a,c,e ou 1,3,5_"
        );
        return;
      }

      const tiposEmocionalSelecionados = opcoesEmocionalSelecionadas.map(
        (opt) => tiposEmocionalMap[opt]
      );
      estado.emocionalTipos = tiposEmocionalSelecionados;

      console.log(
        `✅ Tipos emocionais selecionados: ${tiposEmocionalSelecionados.join(
          ", "
        )}`
      );

      // Se selecionou "Outro", perguntar qual
      if (
        opcoesEmocionalSelecionadas.includes("f") ||
        opcoesEmocionalSelecionadas.includes("6")
      ) {
        await avancar("emocional_outros", mensagens.emocionalOutros);
      } else {
        await avancar("emocional_quando", mensagens.emocionalQuando);
      }
      break;

    case "emocional_outros":
      estado.emocionalOutros = userRaw.trim();
      await avancar("emocional_quando", mensagens.emocionalQuando);
      break;

    case "emocional_quando":
      // Validar formato MM/AAAA
      const regexDataEmocional = /^(\d{1,2})\/(\d{4})$/;
      const matchDataEmocional = userRaw.match(regexDataEmocional);

      if (!matchDataEmocional) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesEmocional, anoEmocional] = matchDataEmocional;
      estado.emocionalQuando = {
        mes: mesEmocional.padStart(2, "0"),
        ano: anoEmocional,
      };

      await avancar("emocional_existe", mensagens.emocionalExiste);
      break;

    case "emocional_existe":
      if (["sim", "s", "ok", "existem", "ainda"].includes(userMessage)) {
        estado.emocionalExiste = true;
      } else if (
        ["não", "nao", "n", "não existem", "pararam"].includes(userMessage)
      ) {
        estado.emocionalExiste = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se os sintomas ainda existem\n• *NÃO* se os sintomas pararam"
        );
        return;
      }
      await avancar("emocional_atrapalhou", mensagens.emocionalAtrapalhou);
      break;

    case "emocional_atrapalhou":
      if (
        ["sim", "s", "ok", "atrapalhou", "sim atrapalhou"].includes(userMessage)
      ) {
        estado.emocionalAtrapalhou = true;
      } else if (["não", "nao", "n", "não atrapalhou"].includes(userMessage)) {
        estado.emocionalAtrapalhou = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se atrapalhou viver/trabalhar\n• *NÃO* se não atrapalhou"
        );
        return;
      }
      await avancar("emocional_atestado", mensagens.emocionalAtestado);
      break;

    case "emocional_atestado":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.emocionalAtestado = true;
      } else if (["não", "nao", "n", "não tive"].includes(userMessage)) {
        estado.emocionalAtestado = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve atestado médico\n• *NÃO* se não teve atestado"
        );
        return;
      }
      await avancar("emocional_gastos", mensagens.emocionalGastos);
      break;

    case "emocional_gastos":
      // Validar valor numérico
      const gastoLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(gastoLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 150 (para R$ 150,00)_\n_Digite 0 se não tem gastos_"
        );
        return;
      }

      estado.emocionalGastos = parseInt(gastoLimpo);

      // Finalizar seção 3
      await avancar(
        "secao4",
        "✅ *Seção Emocional concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao4":
      // Iniciar seção 4 - Perda de Bens
      await avancar("bens_perda", mensagens.bensPerda);
      break;

    case "bens_perda":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.bensPerda = true;
        await avancar("bens_tipos", mensagens.bensTipos);
      } else if (
        ["não", "nao", "n", "nenhum", "não perdi"].includes(userMessage)
      ) {
        estado.bensPerda = false;
        // Pular para próxima seção (seção 5)
        await avancar(
          "secao5",
          "✅ *Seção Bens registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu/danificou bens\n• *NÃO* se não perdeu bens"
        );
      }
      break;

    case "bens_tipos":
      // Processar seleção de tipos de bens
      const tiposBensMap = {
        1: "Casa",
        2: "Terra",
        3: "Plantações",
        4: "Animais",
        5: "Veículos",
        6: "Barcos",
        7: "Equipamentos",
        8: "Bens pessoais ou sentimentais",
        9: "Construções",
      };

      const opcoesBensSelecionadas = userRaw
        .toLowerCase()
        .replace(/[^1-9,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in tiposBensMap);

      if (opcoesBensSelecionadas.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos bens que você tinha\n\n" +
            "_Exemplo: 1,3,5 ou 2,4,8_"
        );
        return;
      }

      const tiposBensSelecionados = opcoesBensSelecionadas.map(
        (opt) => tiposBensMap[opt]
      );
      estado.bensTipos = tiposBensSelecionados;

      console.log(
        `✅ Tipos de bens selecionados: ${tiposBensSelecionados.join(", ")}`
      );

      await avancar("bens_valor_antes", mensagens.bensValorAntes);
      break;

    case "bens_valor_antes":
      // Validar valor numérico
      const valorAntesLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorAntesLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 150000 (para R$ 150.000,00)_\n_Digite 0 se não sabe o valor_"
        );
        return;
      }

      estado.bensValorAntes = parseInt(valorAntesLimpo);
      await avancar("bens_valor_depois", mensagens.bensValorDepois);
      break;

    case "bens_valor_depois":
      // Validar valor numérico
      const valorDepoisLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorDepoisLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 50000 (para R$ 50.000,00)_\n_Digite 0 se perdeu tudo_"
        );
        return;
      }

      estado.bensValorDepois = parseInt(valorDepoisLimpo);
      await avancar("bens_quando", mensagens.bensQuando);
      break;

    case "bens_quando":
      // Validar formato MM/AAAA
      const regexDataBens = /^(\d{1,2})\/(\d{4})$/;
      const matchDataBens = userRaw.match(regexDataBens);

      if (!matchDataBens) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesBens, anoBens] = matchDataBens;
      estado.bensQuando = {
        mes: mesBens.padStart(2, "0"),
        ano: anoBens,
      };

      // Finalizar seção 4
      await avancar(
        "secao5",
        "✅ *Seção Perda de Bens concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao5":
      // Iniciar seção 5 - Mudança de Casa
      await avancar("mudanca_casa", mensagens.mudancaCasa);
      break;

    case "mudanca_casa":
      if (["sim", "s", "ok", "mudei", "sim mudei"].includes(userMessage)) {
        estado.mudancaCasa = true;
        await avancar("mudanca_motivo", mensagens.mudancaMotivo);
      } else if (["não", "nao", "n", "não mudei"].includes(userMessage)) {
        estado.mudancaCasa = false;
        // Pular para próxima seção (seção 6)
        await avancar(
          "secao6",
          "✅ *Seção Mudança registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve que se mudar\n• *NÃO* se não se mudou"
        );
      }
      break;

    case "mudanca_motivo":
      // Processar seleção de motivos
      const motivosMudancaMap = {
        1: "Casa destruída",
        2: "Risco à saúde ou segurança",
        3: "Sem estrutura no bairro",
        4: "Reassentamento",
        5: "Outros",
      };

      const motivosSelecionados = userRaw
        .toLowerCase()
        .replace(/[^1-5,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in motivosMudancaMap);

      if (motivosSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos motivos\n\n" +
            "_Exemplo: 1,2 ou 3,4_"
        );
        return;
      }

      const motivosTexto = motivosSelecionados.map(
        (opt) => motivosMudancaMap[opt]
      );
      estado.mudancaMotivo = motivosTexto;

      console.log(
        `✅ Motivos de mudança selecionados: ${motivosTexto.join(", ")}`
      );

      // Se selecionou "Outros", perguntar qual
      if (motivosSelecionados.includes("5")) {
        await avancar("mudanca_outros", mensagens.mudancaOutros);
      } else {
        await avancar("mudanca_quando", mensagens.mudancaQuando);
      }
      break;

    case "mudanca_outros":
      estado.mudancaOutros = userRaw.trim();
      await avancar("mudanca_quando", mensagens.mudancaQuando);
      break;

    case "mudanca_quando":
      // Validar formato MM/AAAA
      const regexDataMudanca = /^(\d{1,2})\/(\d{4})$/;
      const matchDataMudanca = userRaw.match(regexDataMudanca);

      if (!matchDataMudanca) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesMudanca, anoMudanca] = matchDataMudanca;
      estado.mudancaQuando = {
        mes: mesMudanca.padStart(2, "0"),
        ano: anoMudanca,
      };

      await avancar("mudanca_voltou", mensagens.mudancaVoltou);
      break;

    case "mudanca_voltou":
      if (["sim", "s", "ok", "voltei", "consegui"].includes(userMessage)) {
        estado.mudancaVoltou = true;
      } else if (
        ["não", "nao", "n", "não voltei", "não consegui"].includes(userMessage)
      ) {
        estado.mudancaVoltou = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se conseguiu voltar\n• *NÃO* se não conseguiu voltar"
        );
        return;
      }
      await avancar("mudanca_moradia", mensagens.mudancaMoradia);
      break;

    case "mudanca_moradia":
      // Processar tipo de nova moradia
      const moradiaMap = {
        1: "Paga por você",
        2: "Fornecida por ONG (exceto Renova)",
        3: "Dada pela Renova ou Samarco",
      };

      const opcaoMoradia = userRaw.replace(/[^1-3]/g, "").trim();

      if (!opcaoMoradia || !(opcaoMoradia in moradiaMap)) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma opção válida:\n\n" +
            "Digite *1*, *2* ou *3*\n\n" +
            "1) Paga por você\n2) Fornecida por ONG\n3) Dada pela Renova/Samarco"
        );
        return;
      }

      estado.mudancaMoradia = moradiaMap[opcaoMoradia];
      console.log(`✅ Tipo de moradia: ${estado.mudancaMoradia}`);

      await avancar("mudanca_gastos", mensagens.mudancaGastos);
      break;

    case "mudanca_gastos":
      if (["sim", "s", "ok", "tive", "sim tive"].includes(userMessage)) {
        estado.mudancaGastos = true;
      } else if (["não", "nao", "n", "não tive"].includes(userMessage)) {
        estado.mudancaGastos = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se teve gastos com a mudança\n• *NÃO* se não teve gastos"
        );
        return;
      }

      // Finalizar seção 5
      await avancar(
        "secao6",
        "✅ *Seção Mudança de Casa concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao6":
      // Iniciar seção 6 - Alimentação
      await avancar("alimentacao_fonte", mensagens.alimentacaoFonte);
      break;

    case "alimentacao_fonte":
      if (["sim", "s", "ok", "perdi", "sim perdi"].includes(userMessage)) {
        estado.alimentacaoFonte = true;
        await avancar("alimentacao_quando", mensagens.alimentacaoQuando);
      } else if (["não", "nao", "n", "não perdi"].includes(userMessage)) {
        estado.alimentacaoFonte = false;
        // Pular para próxima seção (seção 7)
        await avancar(
          "secao7",
          "✅ *Seção Alimentação registrada!*\n\nVamos para a próxima seção..."
        );
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se perdeu fonte de comida\n• *NÃO* se não perdeu"
        );
      }
      break;

    case "alimentacao_quando":
      // Validar formato MM/AAAA
      const regexDataAlimentacao = /^(\d{1,2})\/(\d{4})$/;
      const matchDataAlimentacao = userRaw.match(regexDataAlimentacao);

      if (!matchDataAlimentacao) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Formato inválido. Use:\n\n*MM/AAAA*\n\n_Exemplo: 11/2015_"
        );
        return;
      }

      const [, mesAlimentacao, anoAlimentacao] = matchDataAlimentacao;
      estado.alimentacaoQuando = {
        mes: mesAlimentacao.padStart(2, "0"),
        ano: anoAlimentacao,
      };

      await avancar("alimentacao_sem_fonte", mensagens.alimentacaoSemFonte);
      break;

    case "alimentacao_sem_fonte":
      if (["sim", "s", "ok", "ainda", "sem fonte"].includes(userMessage)) {
        estado.alimentacaoSemFonte = true;
      } else if (
        ["não", "nao", "n", "recuperei", "tenho fonte"].includes(userMessage)
      ) {
        estado.alimentacaoSemFonte = false;
      } else {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, responda:\n\n• *SIM* se ainda está sem a fonte\n• *NÃO* se recuperou a fonte"
        );
        return;
      }
      await avancar("alimentacao_gastos", mensagens.alimentacaoGastos);
      break;

    case "alimentacao_gastos":
      // Processar seleção de tipos de gastos
      const gastosAlimentacaoMap = {
        1: "Compra de alimentos",
        2: "Produção alternativa",
        3: "Viagens para buscar comida",
        4: "Outros",
      };

      const gastosAlimentacaoSelecionados = userRaw
        .toLowerCase()
        .replace(/[^1-4,]/g, "")
        .split(",")
        .map((opt) => opt.trim())
        .filter((opt) => opt in gastosAlimentacaoMap);

      if (gastosAlimentacaoSelecionados.length === 0) {
        await enviarComSeguranca(
          client,
          id,
          "❓ Por favor, escolha uma ou mais opções válidas:\n\n" +
            "Digite os números dos gastos que teve\n\n" +
            "_Exemplo: 1,2 ou 3,4_"
        );
        return;
      }

      const gastosTexto = gastosAlimentacaoSelecionados.map(
        (opt) => gastosAlimentacaoMap[opt]
      );
      estado.alimentacaoGastos = gastosTexto;

      console.log(
        `✅ Gastos com alimentação selecionados: ${gastosTexto.join(", ")}`
      );

      // Se selecionou "Outros", perguntar qual
      if (gastosAlimentacaoSelecionados.includes("4")) {
        await avancar("alimentacao_outros", mensagens.alimentacaoOutros);
      } else {
        await avancar("alimentacao_valor", mensagens.alimentacaoValor);
      }
      break;

    case "alimentacao_outros":
      estado.alimentacaoOutros = userRaw.trim();
      await avancar("alimentacao_valor", mensagens.alimentacaoValor);
      break;

    case "alimentacao_valor":
      // Validar valor numérico
      const valorAlimentacaoLimpo = userRaw.replace(/[^\d]/g, "");

      if (!/^\d+$/.test(valorAlimentacaoLimpo)) {
        await enviarComSeguranca(
          client,
          id,
          "❌ Digite apenas números:\n\n_Exemplo: 300 (para R$ 300,00)_\n_Digite 0 se não tem gastos extras_"
        );
        return;
      }

      estado.alimentacaoValor = parseInt(valorAlimentacaoLimpo);

      // Finalizar seção 6
      await avancar(
        "secao7",
        "✅ *Seção Alimentação concluída!*\n\nVamos para a próxima seção..."
      );
      break;

    case "secao7":
      // Aqui você pode adicionar a próxima seção (seção 7)
      await client.sendText(
        id,
        "⚠️ *Questionário em desenvolvimento*\n\n" +
          "Próximas seções serão adicionadas em breve.\n" +
          "Seus dados de todas as seções foram salvos!\n\n" +
          "Obrigado pela paciência! 🙏"
      );

      // Salvar dados e finalizar por enquanto
      await salvarDadosCompletos(client, id, estado);
      limparEstado(id);
      break;

    default:
      console.log(`⚠️ Etapa não reconhecida: ${etapa3}`);
      await client.sendText(
        id,
        "❓ Não entendi sua resposta. Digite *cancelar* para sair ou aguarde instruções."
      );
      break;
  }
}

// Função para salvar dados completos
async function salvarDadosCompletos(client, id, estado) {
  console.log("🚀 Salvando dados completos diretamente");
  console.log(
    "📦 Estado completo antes do salvamento:",
    JSON.stringify(estado, null, 2)
  );

  try {
    // Preparar dados para salvamento
    const dadosParaSalvar = {
      timestamp: new Date().toISOString(),
      id: id,
      nome: estado.nome || "",
      cpf: estado.cpf || "",
      nascimento: estado.nascimento || "",
      telefone: estado.telefone || "",
      email: estado.email || "",
      cep: estado.cep || "",
      rua: estado.rua || "",
      numero: estado.numero || "",
      complemento: estado.complemento || "",
      bairro: estado.bairro || "",

      // Dados de saúde física
      saude_problemas: estado.saudeProblemas || false,
      saude_tipos: estado.saudeTipos ? estado.saudeTipos.join("; ") : "",
      saude_outros: estado.saudeOutros || "",
      saude_continua: estado.saudeContinua || false,
      saude_quando_mes: estado.saudeQuando?.mes || "",
      saude_quando_ano: estado.saudeQuando?.ano || "",
      saude_quando_descricao: estado.saudeQuando?.descricao || "",
      saude_diagnostico: estado.saudeDiagnostico || false,
      saude_diagnostico_qual: estado.saudeDiagnosticoQual || "",
      saude_renda_afetou: estado.saudeRenda || false,
      saude_renda_continua: estado.saudeRendaContinua || false,

      // Dados emocionais/psicológicos
      emocional_problemas: estado.emocionalProblemas || false,
      emocional_tipos: estado.emocionalTipos
        ? estado.emocionalTipos.join("; ")
        : "",
      emocional_outros: estado.emocionalOutros || "",
      emocional_quando_mes: estado.emocionalQuando?.mes || "",
      emocional_quando_ano: estado.emocionalQuando?.ano || "",
      emocional_existe: estado.emocionalExiste || false,
      emocional_atrapalhou: estado.emocionalAtrapalhou || false,
      emocional_atestado: estado.emocionalAtestado || false,
      emocional_gastos: estado.emocionalGastos || 0,

      // Dados de perda de bens
      bens_perda: estado.bensPerda || false,
      bens_tipos: estado.bensTipos ? estado.bensTipos.join("; ") : "",
      bens_valor_antes: estado.bensValorAntes || 0,
      bens_valor_depois: estado.bensValorDepois || 0,
      bens_quando_mes: estado.bensQuando?.mes || "",
      bens_quando_ano: estado.bensQuando?.ano || "",
      bens_perda_valor:
        estado.bensValorAntes && estado.bensValorDepois
          ? estado.bensValorAntes - estado.bensValorDepois
          : 0,

      // Dados de mudança de casa
      mudanca_casa: estado.mudancaCasa || false,
      mudanca_motivo: estado.mudancaMotivo
        ? estado.mudancaMotivo.join("; ")
        : "",
      mudanca_outros: estado.mudancaOutros || "",
      mudanca_quando_mes: estado.mudancaQuando?.mes || "",
      mudanca_quando_ano: estado.mudancaQuando?.ano || "",
      mudanca_voltou: estado.mudancaVoltou || false,
      mudanca_moradia_tipo: estado.mudancaMoradia || "",
      mudanca_gastos: estado.mudancaGastos || false,

      // Dados de alimentação
      alimentacao_fonte_perda: estado.alimentacaoFonte || false,
      alimentacao_quando_mes: estado.alimentacaoQuando?.mes || "",
      alimentacao_quando_ano: estado.alimentacaoQuando?.ano || "",
      alimentacao_sem_fonte: estado.alimentacaoSemFonte || false,
      alimentacao_gastos_tipos: estado.alimentacaoGastos
        ? estado.alimentacaoGastos.join("; ")
        : "",
      alimentacao_outros: estado.alimentacaoOutros || "",
      alimentacao_valor_mensal: estado.alimentacaoValor || 0,

      status: "secoes_completas_ate_alimentacao",
      observacoes:
        "Seções de saúde física, emocional, perda de bens, mudança de casa e alimentação concluídas",
    };

    console.log("📊 Dados preparados:", dadosParaSalvar);

    // Salvar no Google Sheets
    await salvarNoSheets(dadosParaSalvar);
    console.log("✅ Dados salvos com sucesso no Google Sheets!");

    return true;
  } catch (error) {
    console.error("❌ Erro ao salvar dados:", error);
    throw error;
  }
}

module.exports = {
  fluxoPerguntas,
  mensagens,
  enviarComSeguranca,
};
