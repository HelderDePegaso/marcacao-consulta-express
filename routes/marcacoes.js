module.exports = function init(router) {

    router.get('/marcacoes', (req, res) => {
        res.send("Marcacoes");
    });
    
}

