/* const {Router, Router} = require('express');
let router = new Router(); */

const fs = require('fs');

class Contenedor {
    constructor(nombreArchivo) {
        this.nombreArchivo = nombreArchivo;
    }

    async writeFile(datos) {
        await this.getAll()
        try {
            await fs.promises.writeFile(
                this.nombreArchivo,
                JSON.stringify(datos, null, 2)
            )
        } catch (error) {
            console.log(error)
        }

    }

    async getAll() {
        try {
            let stock = await fs.promises.readFile(this.nombreArchivo, "utf-8")
            return JSON.parse(stock)
        } catch (error) {
            console.log(error, "No hay datos en el archivo")
            return []
        }
    }

    async save(obj) {
        let stock = await this.getAll()
        if (stock.length == 0) {
            obj.id = 1
            
        } else {
            obj.id = stock[stock.length - 1].id + 1
            
        }
        try {
            stock.push(obj)
            await this.writeFile(stock)
            /* await this.writeFile(stock) */
            console.log(`Se ha añadido correctamente ${JSON.stringify(obj)}`)
            
        } catch (error) {
            console.log(error, "No se ha guardado correctamente")
        }
    }

    async getById(id) {
        let stock = await this.getAll();
        try {
            let producto = stock.find(prod => prod.id == id)
            return producto
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id) {
        try {
            let stock = await this.getAll()
            stock = stock.filter(prod => prod.id != id)
            await this.writeFile(stock)
            console.log(`Se ha eliminado el producto`)
        } catch (error) {
            console.log(error)
        }
    }

    async deleteAll() {
        await this.writeFile([])
        console.log(`Se han eliminado todos los productos del archivo: ${this.nombreArchivo}`)
    }

    async updateById(obj) {
        try {
            let stock = await this.getAll();
            stock.map(prod => {
                if (prod.id == obj.id) {
                    prod.nombre = obj.nombre,
                        prod.precio = prod.precio,
                        prod.marca = prod.marca
                }
            })
            await this.writeFile(stock)
            return stock
        } catch (error) {
            console.log(error)
        }
    } 
}


module.exports = Contenedor;