const sequelize = require('../db-config/db');
const models = require('./init-models').initModels(sequelize);

module.exports = {
    Consulta: models.consulta,
    DataDisponivel: models.data_disponivel,
    Especialidade: models.especialidade,
    Medico: models.medico,
    Paciente: models.paciente
}


