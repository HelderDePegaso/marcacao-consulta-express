const { Medico: Doutor } = require('../models/modelexportation');
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
        let especialidade_id = null;
        await verificarEspecialidade(body.especialidade).then(especialidade => {
            especialidade_id = especialidade.id;
        });
        const novoDoutor = {
            nome: body.nome,
            especialidade: especialidade_id,
            telefone: body.telefone,
            email: body.email || null,
            uuid: uuidv4()
        };

        await Doutor.create(novoDoutor);
        return { message: 'Doutor adicionado com sucesso', doutor: novoDoutor };
    }
}

async function pegarDoutor(dadosChecagem) {
    try {
        let where = {};
        Object.keys(dadosChecagem).forEach(campo => {
            where[campo] = campo == "nome" ? { [Op.like]: `%${dadosChecagem[campo]}%` } : dadosChecagem[campo];
        });

        if (Object.keys(where).length == 0) {
            throw new ErrorROBJ('Nenhum dado para pesquisar');
        }

        return await Doutor.findAll({
            attributes: ['nome', 'especialidade', 'telefone', 'email', 'estado', 'uuid', 'createdAt'],
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
    return await Especialidade.findAll({
        attributes: ['id'],
        where: { nome: especialidade,
            [Op.or]: { abre: especialidade } 
        }, 
        raw: true
    });
}

module.exports = function init(router) {
    router.get('/doutores/todos', verificarSessao, (req, res) => {
        pegarDoutores().then(data => {
            res.json(data.length ? data : "Nenhum doutor encontrado");
        }).catch(error => {
            res.send("Algum erro ocorreu ao carregar os doutores. Por favor, tente mais tarde.");
        });
    });

    router.post('/doutores/criar', verificarSessao, (req, res) => {
        console.log("Criando novo doutor");
        criarNovoDoutor(req.body).then(resposta => {
            res.status(201).jsonp(resposta);
        }).catch(error => {
            res.status(400).jsonp({ message: error.message, data: error.data });
        });
    });

    router.get('/doutores/registro/:uuid', verificarSessao, (req, res) => {
        pegarDoutor({ uuid: req.params.uuid }).then(doutor => {
            res.jsonp({ mensagem: 'Doutor encontrado', doutor });
        }).catch(error => {
            res.send(error);
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


