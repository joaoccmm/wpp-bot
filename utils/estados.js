const estados = {};

function getEstado(id) {
  return estados[id];
}

function setEstado(id, dados) {
  estados[id] = dados;
}

function limparEstado(id) {
  delete estados[id];
}

function temEstado(id) {
  return !!estados[id];
}

module.exports = { getEstado, setEstado, limparEstado, temEstado };
