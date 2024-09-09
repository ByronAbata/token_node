const TABLA = 'auth';
const bcrypt = require('bcrypt');
const auth = require('../../auth')

module.exports = function(dbInyectada){

    let db = dbInyectada;
    if(!db){
        db= require('../../DB/mysql');
    }

    async function login(usuario, password) {
        const data = await db.query(TABLA, { usuario: usuario });
        if (!data) {
          throw new Error('Usuario no encontrado');
        }
      
        const passwordMatch = await bcrypt.compare(password, data.password);
        if (passwordMatch) {
          // Generate a token
          return auth.asignarToken({ ...data });
        } else {
          throw new Error('Información Invalida');
        }
    }
    
    async function agregar(data){
        console.log('data', data)
        
        const authData ={
            id: data.id,
        }
        if(data.usuario){
            authData.usuario = data.usuario
        }
        if(data.password){
            authData.password = await bcrypt.hash(data.password.toString(),5); 
        }

        return db.agregar(TABLA, authData);
    }
    
 
    return{
       
        agregar,
        login
        
    }
    
};