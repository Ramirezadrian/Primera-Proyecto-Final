const fs = require('fs');

class Carrito{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    }

    

   async save(object){
       let data
       
        try{
            data  = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8') //leo archivo
            data = JSON.parse(data)
        } catch (err) {
            data = []
        }

        const lastCart = data[data.length - 1] //conozco la posicion del ultimo elemento

        let id = 1

        if (lastCart) { // si hay productos le sumo uno al id
             id = lastCart.id + 1
        }
        object.id = id

        data.push(object) //agrego producto

        return fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data, null, 2)) //save del producto nuevo

  }
/*     async update(object){

        //time, prod

        let objects = await this.getAll()
        let index = object.id -1
        objects.splice(index ,1,object)
        
        await this.deleteAll()
        for(let i = 0; i < objects.length; i++ ){
            let obj = {
                "timestamp":objects[i].timestamp,
                "products":objects[i].produtcs
            }
            await this.save(obj)
        }
       
     
    } */

    async update(object){

        let objects = await this.getAll()
        let index = object.id -1
        let original = objects.find(p => p.id === object.id)
        
        let obj = {
            "id"   : original.id,
            "timestamp": original.timestamp,
            "productos": object.productos //aca carga todo el carrito tiene que cargar sololos prodcutos
        }
        objects.splice(index ,1,obj)
           await this.deleteAll()

          for(let i =0 ; i< objects.length; i++){
            await this.save(objects[i])
           } 
   
    }

    async getById(id){
        let data
        try{
            data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            data = JSON.parse(data)            
        }
        catch(err){ data = []}
        
        return data.find(cart=> cart.id === id)
    }
 
    async getAll(){
        let data
        try{
            data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            data = JSON.parse(data)
         } catch(err){data = []}

         return data
    }

    async deleteById(id){
        let data
        try{
            data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            data = JSON.parse(data)
                
            }catch(err){data = []}
        const newList = data.filter(prod => prod.id !== id)
        return fs.promises.writeFile(`./${this.nombreArchivo}`,JSON.stringify(newList, null, 2))
    }

    async deleteProductById(id){
        let data
        try{
            data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
            data = JSON.parse(data)
                
            }catch(err){data = []}


        const newList = data.filter(prod => prod.id !== id)
        return fs.promises.writeFile(`./${this.nombreArchivo}`,JSON.stringify(newList, null, 2))
    }

    async deleteAll(){
        return fs.promises.writeFile(`./${this.nombreArchivo}`,'')
    }

    async getRandom(){
        let data= this.getAll()
        let id = Math.floor(Math.random()*data.length)
        return this.getById(id)
    }
}

module.exports = Carrito

