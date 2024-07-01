const { Paciente } = require('../models/modelexportation');

async function pegarPacientes() {
    let resposta = null;
    
    try {
        await Paciente.findAll({
            raw: true
        }).then((pacientes) => {
            console.log(pacientes);
    
            resposta = pacientes
        })
    
        return resposta || new Error('Nenhum paciente encontrado');
    } catch (error) {
        return new Error(error);
    }
    
}
module.exports = function init(router) {
    console.log("Pacientes iniciados");
    // Exemplo de rota para listar pacientes
    router.get('/pacientes', (req, res) => {
        res.send("Pacientes");
    });

    router.get("/pacientes/todos", (req, res) => {
        console.log("chegou alguém");
        let data = pegarPacientes();

        console.log("Na saída")
        console.log(data)
        res.json({data: 2, data2: {sf: 32, bj: 98}});
    })



    // Exemplo de rota para adicionar um paciente (formulário)
    router.get('/pacientes/novo', (req, res) => {
        res.render('pacientes/novo');
    });

    // Exemplo de rota para adicionar um paciente (processamento)
    router.post('/pacientes', (req, res) => {

    });
}

//.init = init