const express = require('express');
const app = express();
const config = require('config');
const NaoEncontrado = require('./erros/NaoEncontrado');
const CampoInvalido = require('./erros/CampoInvalido');
const DadosNaoFornecidos = require('./erros/DadosNaoFornecidos');
const formatosAceitos = require('./Serializador').formatosAceitos;
const ValorNaoSuportado = require('./erros/ValorNaoSuportado');
const SerializadorError = require('./Serializador').SerializadorErro;

app.use(express.json());

app.use((req, res, proximo) => {
    let formatoRequisitado = req.header('Accept');

    if (formatoRequisitado === '*/*') {
        formatoRequisitado = 'application/json';
    }

    if (formatosAceitos.indexOf(formatoRequisitado) === -1) {
        res.status(406).end();
        return;
    }

    res.setHeader('Content-Type', formatoRequisitado);
    proximo();
});

const roteador = require('./rotas/fornecedores');
app.use('/api/fornecedores', roteador);

app.use((erro, req, res, proximo) => {
    let status = errorHandler(erro);

    const serializador = new SerializadorError(res.getHeader('Content-Type'));
    res.status(status).send(
        serializador.serializar({
            mensagem: erro.message,
            id: erro.idErro,
        })
    );
});

const errorHandler = (erro) => {
    switch (erro.constructor) {
        case NaoEncontrado:
            return 404;
        case CampoInvalido:
        case DadosNaoFornecidos:
            return 400;
        case ValorNaoSuportado:
            return 406;
        default:
            return 500;
    }
};

app.listen(config.get('api.porta'), () =>
    console.log('A API está funcionando')
);
