// Teste da função processarMultiplaEscolha

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

// Teste com mapa de exemplo
const tiposMap = {
  1: "Opção 1",
  2: "Opção 2",
  3: "Opção 3",
  4: "Opção 4",
  5: "Opção 5",
};

console.log("Testando função processarMultiplaEscolha:");
console.log(
  "Entrada: '1,3,5' ->",
  processarMultiplaEscolha("1,3,5", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '135' ->",
  processarMultiplaEscolha("135", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '2,4' ->",
  processarMultiplaEscolha("2,4", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '24' ->",
  processarMultiplaEscolha("24", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '1' ->",
  processarMultiplaEscolha("1", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '7,8' (inválidas) ->",
  processarMultiplaEscolha("7,8", tiposMap, /[^1-5,]/g)
);
console.log(
  "Entrada: '78' (inválidas) ->",
  processarMultiplaEscolha("78", tiposMap, /[^1-5,]/g)
);
