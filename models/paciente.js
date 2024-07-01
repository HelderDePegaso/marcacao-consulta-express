const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('paciente', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    data_nascimento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    sexo: {
      type: DataTypes.ENUM('Masculino','Feminino','Outro'),
      allowNull: false
    },
    mae: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    pai: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    estado: {
      type: DataTypes.ENUM('ACTIVO','BLOQUEIADO','DESCARTADO'),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'paciente',
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
    ]
  });
};
