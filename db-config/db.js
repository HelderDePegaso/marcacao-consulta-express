const { Sequelize } = require('sequelize');
//require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

console.log(process.env.DB_HOST);
const sequelize = new Sequelize(
  'sistemaagendamentohospital',
  'root',
  '',
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Defina como true se quiser ver os logs de SQL no console
  }
);

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados foi estabelecida com sucesso.');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
  }
};

testConnection();

module.exports = sequelize;
