module.exports = function init(router) {
    console.log("Pacientes iniciados");
    // Exemplo de rota para listar pacientes
    router.get('/pacientes', (req, res) => {
        res.send("Pacientes");
    });

    // Exemplo de rota para adicionar um paciente (formulário)
    router.get('/pacientes/novo', (req, res) => {
        res.render('../pacientes/novo');
    });

    // Exemplo de rota para adicionar um paciente (processamento)
    router.post('/pacientes', (req, res) => {

    });
}

//.init = init
