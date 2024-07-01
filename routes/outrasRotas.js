const doutoresRotas = require('./doutores');
const pacientesRotas = require('./pacientes');
const marcacaoRotas = require('./marcacoes');

module.exports = function (router) {
    console.log("Rotas iniciadas");
    doutoresRotas(router);
    pacientesRotas(router);
    marcacaoRotas(router);
}