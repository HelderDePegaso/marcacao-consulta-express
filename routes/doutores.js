const { Medico: Doutor , Especialidade } = require('../models/modelexportation');
const { v4: uuidv4 } = require('uuid');
const { ErrorROBJ } = require('../utils.js');
const { authenticateToken, verificarSessao } = require('../jwt');
const { Op } = require('sequelize');

async function pegarDoutores() {
    try {
        const doutores = await Doutor.findAll({ raw: true });
        return doutores.length ? doutores : new Error('Nenhum doutor encontrado');
    } catch (error) {
        return new Error(error);
    }
}

async function criarNovoDoutor(body) {
    const camposObrigatorio = ['nome', 'especialidade', 'telefone'];
    let camposFalta = [];

    camposObrigatorio.forEach(campo => {
        if (!body[campo]) {
            camposFalta.push(campo);
        }
    });

    if (camposFalta.length > 0) {
        throw new ErrorROBJ('Campos obrigatórios ausentes', { camposFalta });
    } else {

        const doutor = await verificarEspecialidade(body.especialidade).then(especialidade => {
            console.log("Que especialidade recebi?")
            console.log("Foi esta especialidade")
            console.log(especialidade[0].id)
            if(especialidade.length === 0) return new ErrorROBJ('Especialidade inexistente', { especialidade: body.especialidade });
            const novoDoutor = {
                nome: body.nome,
                especialidade: body.especialidade,
                especialidade_id: especialidade[0].id,
                telefone: body.telefone,
                email: body.email || null,
                uuid: uuidv4()
            }

            return Doutor.create(novoDoutor);
        }).catch(error => {
            return new ErrorROBJ("Erro ao criar novo doutor", error);
        });

        //console.log(doutor)

        return doutor;
        
    }
}

async function pegarDoutor(dadosChecagem) {
    try {
        let where = {};
        Object.keys(dadosChecagem).forEach(campo => {
            where[campo] = campo == "nome" ? { [Op.like]: `%${dadosChecagem[campo]}%` } : dadosChecagem[campo];
        });

        if (Object.keys(where).length == 0) {
            throw new ErrorROBJ('Nenhum dado para pesquisar', {});
        }

        return await Doutor.findAll({
            attributes: ['nome', 'especialidade_id', 'telefone', 'email', 'uuid'],
            where: where
        });
    } catch (error) {
        return error;
    }
}

async function removerDoutor(dadosChecagem) {
    try {
        return await Doutor.destroy({ where: dadosChecagem });
    } catch (error) {
        throw new ErrorROBJ("Erro ao remover o doutor. Verifique a existência dele ou se o UUID foi informado corretamente. Caso sim, tente mais tarde.", error);
    }
}

async function atualizarDoutor(uuid, dadosParaAtualizar) {
    try {
        const doutor = await Doutor.findOne({ where: { uuid } });

        if (!doutor) {
            return { mensagem: 'Doutor não encontrado' };
        }

        return await doutor.update(dadosParaAtualizar);
    } catch (error) {
        return { mensagem: 'Erro ao atualizar doutor', erro: error.message };
    }
}


async function verificarEspecialidade(especialidade) {
    console.log("Verificando Especialidades")
    console.log(especialidade)
    return await Especialidade.findAll({
        attributes: ['id'],
        where: { 
            [Op.or]: { abre: especialidade, nome: especialidade } 
        }
    }, {
        raw: true, logger: true
    });
}

module.exports = function init(router) {
    router.get('/doutores/todos', verificarSessao, (req, res) => {
        pegarDoutores().then(data => {
            res.json(data.length ? data : "Nenhum doutor encontrado");
        }).catch(error => {
            res.status(400).send("Algum erro ocorreu ao carregar os doutores. Por favor, tente mais tarde.");
        });
    });

    router.post('/doutores/criar', verificarSessao, (req, res) => {
        console.log("Criando novo doutor");
        console.log(req.body)
        criarNovoDoutor(req.body).then(resposta => {
            if(resposta instanceof ErrorROBJ) return res.status(400).jsonp({ message: resposta.message, data: {} });
            res.status(201).jsonp({ mensagem: 'Doutor criado com sucesso', doutor: resposta });
        }).catch(error => {
            res.status(400).jsonp({ message: error.message, data: error.data });
        });
    });

    router.get('/doutores/registro/:uuid', verificarSessao, (req, res) => {
        pegarDoutor({ uuid: req.params.uuid }).then(doutor => {
            res.status(200).jsonp({ mensagem: 'Doutor encontrado', doutor });
        }).catch(error => {
            res.status(400).send(error);
        });
    });

    router.delete('/doutores/remover/:uuid', verificarSessao, (req, res) => {
        removerDoutor({ uuid: req.params.uuid }).then(doutor => {
            res.status(200).jsonp({ mensagem: 'Doutor removido com sucesso', doutor });
        }).catch(error => {
            res.status(400).send(error.mensagem);
        });
    });

    router.put('/doutores/atualizar/:uuid', verificarSessao, (req, res) => {
        atualizarDoutor(req.params.uuid, req.body).then(doutor => {
            res.status(200).json({ mensagem: 'Doutor atualizado com sucesso', doutor });
        }).catch(error => {
            res.status(500).json(error);
        });
    });
};


