const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2');
const outrasRotas = require('./routes');

const { jwt, secret } = require('./jwt');



const getUsuario = require('./usuarioAutenticado/getUsuario');

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
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomear o arquivo para evitar conflitos
    }
});

const upload = multer({ storage: storage });


console.clear()
// Rotas principais
app.get('/', (req, res) => {
    res.render('home');
});


// Outras rotas da aplicação
outrasRotas(app);

// Middleware de logging para depuração
app.use((req, res, next) => {
    console.log('Body:', req.body);
    console.log('URL: ', req.url)
    console.log('Method: ', req.method)
    console.log('Params: ', req.params)
    next();
});

app.post('/login', (req, res) => {
    
    const user = getUsuario(req.body.usuario, req.body.password);

    
    // Gera um token JWT
    const token = jwt.sign(user, secret, { expiresIn: '1h' });

    // Envia o token ao cliente
    res.json({ token });
});


// Configuração do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
