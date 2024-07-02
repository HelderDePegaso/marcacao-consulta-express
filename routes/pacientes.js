const { Paciente } = require('../models/modelexportation');
const { v4: uuidv4 } = require('uuid');

const { ErrorROBJ } = require('../utils.js');
const { logger } = require('sequelize/lib/utils/logger');
const { Op } = require('sequelize');

async function pegarPacientes() {
    let resposta = null;

    
    try {
    console.log("pegarPacientes");

        await Paciente.findAll({
            raw: true
        }).then((pacientes) => {
            console.log("pacientes");
            console.log(pacientes);
    
            resposta = pacientes
        })
    
        return resposta || new Error('Nenhum paciente encontrado');
    } catch (error) {
        return new Error(error);
    }
    
}

async function criarNovoPaciente(body) {
    const camposObrigatorio = ['nome', 'data_nascimento', 'sexo', 'mae', 'pai', 'telefone'];
    let camposFalta = [];

    // Verificar campos obrigatórios
    camposObrigatorio.forEach(campo => {
        if (!body[campo]) {
            camposFalta.push(campo);
        }
    });

    if (camposFalta.length > 0) {
        // Retornar um erro com os campos obrigatórios ausentes
        throw new ErrorROBJ('Campos obrigatórios ausentes', { camposFalta: camposFalta });
    } else {
        // Adicionar apenas os campos disponíveis
        const novoPaciente = {
            nome: body.nome,
            data_nascimento: body.data_nascimento,
            sexo: body.sexo,
            mae: body.mae,
            pai: body.pai,
            telefone: body.telefone,
            email: body.email || null, // Adicionar email se disponível
            estado: 'ACTIVO',
            uuid: uuidv4()
        };

        // Adicionar o novo paciente
        await Paciente.create(novoPaciente).catch((error) => {
            throw new ErrorROBJ('Erro ao adicionar o novo paciente', { mensagemErro: 'Erro ao adicionar o novo paciente', novoPaciente: novoPaciente });
        });

        // Continue com o processamento do novo paciente
        console.log('Novo paciente:', novoPaciente);
        return { message: 'Paciente adicionado com sucesso', paciente: novoPaciente };
    }

}

async function pegarPaciente(dadosChecagem) {
    try {
        // Construindo o objeto where
        let where = {}
        
        let campos = Object.keys(dadosChecagem)

        campos.forEach((campo)=> {
            console.log(campo)
            if(campo == "nome") 
                where[campo] = { [Op.like]: `%${dadosChecagem[campo]}%` }
            else 
                where[campo] = dadosChecagem[campo];
        })


        console.log("Where")
        console.log(where)

        if(Object.keys(where).length == 0) {
            throw new ErrorROBJ('Nenhum dado para pesquisar')
        }

        return await Paciente.findAll({
            attributes: ['nome', 'bi', 'data_nascimento', 'sexo', 'mae', 'pai', 'telefone', 'email', 'estado', 'uuid', 'created_at'],
            where: where
        })
    } catch(error) {
        return error;
    }
}

async function removerPaciente(dadosChecagem) {
    try {
        return await Paciente.destroy({
            where: dadosChecagem
        })
    } catch (error) {
        throw new ErrorROBJ("Erro ao remover o paciente. Verifique a existência dele ou se o UUID foi informado corretamente. Caso sim, tente mais tarde.", error)
    }
}
module.exports = function init(router) {
    console.log("Pacientes iniciados");
    // Exemplo de rota para listar pacientes
    router.get('/pacientes', (req, res) => {
        res.send("Pacientes");
    });

    router.get("/pacientes/todos", (req, res) => {
        console.log("Pegando a todos os pacientes");
        pegarPacientes().then((data) => {

            if(data.length == 0){
                res.send("Nenhum paciente encontrado")
            } else {
                res.jsonp(data)
            }
        }).catch((error) => {
            console.log(error)

            res.send("Algum erro ocorreu ao carregar os pacientes. Por favor, tente mais tarde.")
        });
        
    })

    router.post("/pacientes/criar", (req, res) => {
        console.log("Recebi algo")
        console.log(req.body)

        criarNovoPaciente(req.body).then(resposta => {
            console.log(resposta)
            res.status(201).jsonp(resposta)
        }).catch(error => {
            console.log("Deu errado")
            console.log(error)

            res.status(400).jsonp({message: error.message, data: error.data})
        })
    })

    router.get("/pacientes/registro/:uuid", (req, res) => {
        console.log("Pegando o paciente pelo UUID")
        console.log(req.params.uuid)
    
        pegarPaciente({uuid: req.params.uuid}).then((paciente) => {
            res.jsonp({mensagem: 'Paciente encontrado', paciente: paciente})
        }).catch((error) => {
            res.send(error)
        })
    })

    router.get("/pacientes/registro", (req, res) => {
        console.log("Pegando o paciente por algum campo específico. Isso pode retornar mais de um resultado, mas só um deles será mostrado.")
        console.log(req.body)
        pegarPaciente(req.body).then((paciente) => {
            res.jsonp({mensagem: 'Paciente encontrado', paciente: paciente})
        }).catch((error) => {
            res.send(error)
        })
    })

    router.delete("/pacientes/romever/:uuid", (req, res) => {
        console.log("Removendo o paciente pelo UUID")
        console.log(req.params.uuid)
        
        removerPaciente({uuid: req.params.uuid}).then((paciente) => {
            res.jsonp({mensagem: 'Paciente removido com sucesso', paciente: paciente})
        }).catch((error) => {
            res.send(error.mensagem)
        })
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