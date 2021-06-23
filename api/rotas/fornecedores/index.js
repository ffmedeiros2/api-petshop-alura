const rodetador = require('express').Router();
const TabelaFornecedor = require('./TabelaFornecedor');
const Fornecedor = require('./Fornecedor');
const SerializadorFornecedor =
    require('../../Serializador').SerializadorFornecedor;

rodetador.get('/', async (req, res) => {
    const resultados = await TabelaFornecedor.listar();
    const serializador = new SerializadorFornecedor(
        res.getHeader('Content-Type')
    );
    res.status(200).send(serializador.serializar(resultados));
});

rodetador.post('/', async (req, res, proximo) => {
    try {
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor(dadosRecebidos);
        await fornecedor.criar();
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type')
        );
        res.status(201).send(serializador.serializar(fornecedor));
    } catch (erro) {
        proximo(erro);
    }
});

rodetador.get('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        const serializador = new SerializadorFornecedor(
            res.getHeader('Content-Type'),
            ['email', 'dataCriacao', 'dataAtualizacao', 'versao']
        );
        res.status(200).send(serializador.serializar(fornecedor));
    } catch (erro) {
        proximo(erro);
    }
});

rodetador.put('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id;
        const dadosRecebidos = req.body;
        const fornecedor = new Fornecedor({ ...dadosRecebidos, id });
        await fornecedor.atualizar();
        res.status(204).end();
    } catch (erro) {
        proximo(erro);
    }
});

rodetador.delete('/:id', async (req, res, proximo) => {
    try {
        const id = req.params.id;
        const fornecedor = new Fornecedor({ id: id });
        await fornecedor.carregar();
        fornecedor.remover();
        res.status(204).end();
    } catch (erro) {
        proximo(erro);
    }
});

module.exports = rodetador;
