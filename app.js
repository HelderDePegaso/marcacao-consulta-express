const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const outrasRotas = require('./routes/outrasRotas');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração do Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware para arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do Multer para upload de arquivos (se necessário)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomear o arquivo para evitar conflitos
    }
});

const upload = multer({ storage: storage });



// Rotas principais
app.get('/', (req, res) => {
    res.render('home');
});


// Outras rotas da aplicação
outrasRotas(app);

// Configuração do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
