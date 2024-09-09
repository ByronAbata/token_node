const app = require('./app');

app.listen(app.get('port'),()=>{
    console.log("Servidor eschucando en el puerto", app.get("port"));
});