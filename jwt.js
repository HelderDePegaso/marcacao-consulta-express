const jwt = require('jsonwebtoken');
const secret = "aweof-secret-marcacao";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("authHeader: \n" + authHeader);
    const token = authHeader && authHeader.split(' ')[1]; // O formato esperado é "Bearer TOKEN"
    console.log("token: \n" + token);
    if (token == null) return res.sendStatus(401); // Se o token não estiver presente, retorna não autorizado

    jwt.verify(token, secret, (err, user) => {
        if (err) return res.sendStatus(403); // Se o token for inválido, retorna proibido

        req.user = user; // Armazena as informações do usuário na solicitação para uso posterior
        next(); // Passa para a próxima função middleware
    });
}

function verificarSessao(req, res, next) {
    if(!req.session.user) {
        return res.sendStatus(401);
    }

    next();
}

module.exports = {
    jwt: jwt,
    secret: secret,
    authenticateToken: authenticateToken,
    verificarSessao: verificarSessao
}

