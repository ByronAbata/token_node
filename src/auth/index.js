const jwt = require('jsonwebtoken');
const config = require('../config');
const error = require('../middleware/errors')
const secret = config.jwt.secret;

function asignarToken(data){
    return jwt.sign(data, secret);
} 

function verificarToken(token){
    console.log(token)
    return jwt.verify(token, secret);
} 

const chequearToken ={
    confirmarToken: function(req, id){
        const decoficado = decodificarCabecera(req);

        if(decoficado.id !== id){
            throw error("No tienes privilegios para esto.",401)
        }

    }
}

function obtenerToken(autorizacion){
    if(!autorizacion){
        throw error('No viene token', 401)
    }
    if(autorizacion.indexOf('Bearer')=== -1){
        throw error ('Formato invalido', 401)
    } 
    let token = autorizacion.replace('Bearer ','')
    return token;
}

function decodificarCabecera(req){
    const autorizacion =req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decoficado = verificarToken(token);

    req.user = decoficado;

    return decoficado;
}

module.exports = {
    asignarToken, 
    chequearToken
}