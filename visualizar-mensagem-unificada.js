// Visualização da mensagem unificada
const mensagemUnificada =
  "👋 *Olá!*\n\n" +
  "Sou a assistente virtual do Dr. Igor, responsável por realizar seu cadastro no processo jurídico relacionado à Holanda.\n\n" +
  "Este procedimento leva entre 10 e 15 minutos e é fundamental para dar continuidade ao seu atendimento.\n\n" +
  "Caso você esteja respondendo por outra pessoa, por favor, responda com base nos dados e vivências dela.\n\n" +
  "💡 Dica: Digite *cancelar* a qualquer momento para encerrar.\n\n" +
  "Vamos começar?\n👉 *Sim* ou *Não*";

console.log("📱 PREVIEW DA MENSAGEM UNIFICADA:");
console.log("=".repeat(60));
console.log(mensagemUnificada);
console.log("=".repeat(60));

console.log("\n📊 ESTATÍSTICAS:");
console.log("🔸 Tamanho total:", mensagemUnificada.length, "caracteres");
console.log("🔸 Número de linhas:", mensagemUnificada.split("\n").length);

console.log("\n✅ COMPONENTES INCLUÍDOS:");
console.log("🔸 Saudação inicial:", mensagemUnificada.includes("👋 *Olá!*"));
console.log(
  "🔸 Identificação do bot:",
  mensagemUnificada.includes("assistente virtual do Dr. Igor")
);
console.log(
  "🔸 Contexto do processo:",
  mensagemUnificada.includes("processo jurídico relacionado à Holanda")
);
console.log(
  "🔸 Tempo estimado:",
  mensagemUnificada.includes("10 e 15 minutos")
);
console.log(
  "🔸 Instrução para terceiros:",
  mensagemUnificada.includes("respondendo por outra pessoa")
);
console.log("🔸 Comando cancelar:", mensagemUnificada.includes("cancelar"));
console.log(
  "🔸 Pergunta para iniciar:",
  mensagemUnificada.includes("Vamos começar?")
);
console.log(
  "🔸 Opções de resposta:",
  mensagemUnificada.includes("*Sim* ou *Não*")
);

console.log("\n🎉 Mensagem unificada criada com sucesso!");
