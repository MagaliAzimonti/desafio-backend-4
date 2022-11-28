const express = require('express');
const app = express();
const PORT = 8080;
const {Router} = express;

const fs = require('fs');
const Contenedor = require('./components/products/index');
let archivo = new Contenedor('productos.json');

app.use(express.static('public'));

let router = new Router();
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.get('/', async (req, res, next) => {
    let stock = await archivo.getAll()
    stock.length > 0 ? res.json(stock) : res.send({error: "product not found"})
});

app.use('/api/products', router)

router.get('/:id', async (req, res, next) => {
    try {
        let product = await archivo.getById(req.params.id)
        if (product) {
            res.json({ product })
        } else {
            res.send({ error: "product not found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res, next) => {
    try {
        let { nombre, precio, marca } = req.body
        if (nombre && precio && marca) {
            let newProd = { nombre, precio, marca };
            await archivo.save(newProd)
            res.json({ newProd })
        } else {
            res.send({ error: "product not found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        let id = req.params.id
        let { nombre, precio, marca } = req.body
        if (nombre && precio && marca) {
            let updProd = { id, nombre, precio, marca };
            await archivo.updateById(updProd)
            res.json({ updProd })
        } else {
            res.send({ error: "product not found" })
        }
    } catch (error) {
        console.log(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        let product = req.params.id
        let prod_id = await archivo.getById(product)
        if (prod_id) {
            await archivo.deleteById(product)
            res.json({eliminado: prod_id })
        } else {
            res.send({ error: "product not found" })
        }
    } catch (error) {
        console.log(error)
    }
}) 

let connected_server = app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
connected_server.on('error', error => console.log(error));
