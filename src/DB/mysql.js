const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};

let conexion;

function conMysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conMysql, 200);
        } else {
            console.log('DB Conectada!!!');
        }
    });

    conexion.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conMysql();
        } else {
            throw err;
        }
    });
}

// Inicia la conexión al importar el módulo
conMysql();

function todos(tabla) {
    return new Promise((resolve, reject) => {
        console.log(`Ejecutando consulta: SELECT * FROM ${tabla}`); // Log de depuración
        conexion.query(`SELECT * FROM ${tabla}`, (error, result) => {
            if (error) {
                console.error('Error en la consulta todos:', error); // Log de depuración
                return reject(error);
            }
            console.log('Resultado de todos:', result); // Log de depuración
            resolve(result);
        });
    });
}

function uno(tabla, id) {
    return new Promise((resolve, reject) => {
        console.log(`Ejecutando consulta: SELECT * FROM ${tabla} WHERE id=${id}`); // Log de depuración
        conexion.query(`SELECT * FROM ${tabla} WHERE id=${id}`, (error, result) => {
            if (error) {
                console.error('Error en la consulta uno:', error); // Log de depuración
                return reject(error);
            }
            console.log('Resultado de uno:', result); // Log de depuración
            resolve(result);
        });
    });
}

function agregar(tabla, data) {
    return new Promise ((resolve, reject)=>{
        conexion.query(`INSERT INTO ${tabla} SET ? ON DUPLICATE KEY UPDATE ?`,
             [data,data], (error, result)=>{
            return error ? reject(error): resolve(result);
        })
    });
} 



function eliminar(tabla, data) {
    return new Promise ((resolve, reject)=>{
        conexion.query(`DELETE FROM ${tabla} WHERE id=?`, data.id, (error, result)=>{
            return error ? reject(error): resolve(result);
        })
    });
}

function query(tabla, consulta) {
    return new Promise ((resolve, reject)=>{
        conexion.query(`SELECT * FROM ${tabla} WHERE ?`, consulta, (error, result)=>{
            return error ? reject(error): resolve(result[0]);
        })
    });
}

module.exports = {
    todos,
    uno,
    agregar,
    eliminar,
    query

};
