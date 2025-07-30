// Teste rápido da função processarMultiplaEscolha
const processarMultiplaEscolha = (userRaw, opcoesMapa, regexCaracteres) => {
  const textoLimpo = userRaw.toLowerCase().replace(regexCaracteres, "");

  // Se contém vírgula, faz split normal
  if (textoLimpo.includes(",")) {
    return textoLimpo
      .split(",")
      .map((opt) => opt.trim())
      .filter((opt) => opt !== "" && opt in opcoesMapa);
  }

  // Se não contém vírgula, trata cada caractere como uma opção
  return textoLimpo.split("").filter((opt) => opt !== "" && opt in opcoesMapa);
};

// Teste com entrada "sim"
const tiposMap = {
  a: "Problemas de pele",
  b: "Dor de barriga",
  c: "Urina alterada",
  1: "Problemas de pele",
  2: "Dor de barriga",
  3: "Urina alterada",
};

console.log(
  "Teste com 'sim':",
  processarMultiplaEscolha("sim", tiposMap, /[^a-g1-7,]/g)
);
console.log(
  "Teste com 'não':",
  processarMultiplaEscolha("não", tiposMap, /[^a-g1-7,]/g)
);
console.log(
  "Teste com 'a1':",
  processarMultiplaEscolha("a1", tiposMap, /[^a-g1-7,]/g)
);
console.log(
  "Teste com 'a,1':",
  processarMultiplaEscolha("a,1", tiposMap, /[^a-g1-7,]/g)
);
