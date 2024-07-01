var DataTypes = require("sequelize").DataTypes;
var _consulta = require("./consulta");
var _data_disponivel = require("./data_disponivel");
var _especialidade = require("./especialidade");
var _medico = require("./medico");
var _paciente = require("./paciente");

function initModels(sequelize) {
  var consulta = _consulta(sequelize, DataTypes);
  var data_disponivel = _data_disponivel(sequelize, DataTypes);
  var especialidade = _especialidade(sequelize, DataTypes);
  var medico = _medico(sequelize, DataTypes);
  var paciente = _paciente(sequelize, DataTypes);

  consulta.belongsTo(data_disponivel, { as: "data_disponivel", foreignKey: "data_disponivel_id"});
  data_disponivel.hasMany(consulta, { as: "consulta", foreignKey: "data_disponivel_id"});
  medico.belongsTo(especialidade, { as: "especialidade", foreignKey: "especialidade_id"});
  especialidade.hasMany(medico, { as: "medicos", foreignKey: "especialidade_id"});
  consulta.belongsTo(medico, { as: "medico", foreignKey: "medico_id"});
  medico.hasMany(consulta, { as: "consulta", foreignKey: "medico_id"});
  consulta.belongsTo(paciente, { as: "paciente", foreignKey: "paciente_id"});
  paciente.hasMany(consulta, { as: "consulta", foreignKey: "paciente_id"});

  return {
    consulta,
    data_disponivel,
    especialidade,
    medico,
    paciente,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
