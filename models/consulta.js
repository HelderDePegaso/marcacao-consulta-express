const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('consulta', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    paciente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'paciente',
        key: 'id'
      }
    },
    medico_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'medico',
        key: 'id'
      }
    },
    data_disponivel_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'data_disponivel',
        key: 'id'
      }
    },
    razao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('Realizada','Cancelada','Pendente'),
      allowNull: false,
      defaultValue: "Pendente"
    },
    uuid: {
      type: DataTypes.STRING(40),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'consulta',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "paciente_id",
        using: "BTREE",
        fields: [
          { name: "paciente_id" },
        ]
      },
      {
        name: "medico_id",
        using: "BTREE",
        fields: [
          { name: "medico_id" },
        ]
      },
      {
        name: "fk_cons_dadispo",
        using: "BTREE",
        fields: [
          { name: "data_disponivel_id" },
        ]
      },
    ]
  });
};
