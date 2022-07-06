const mysql = require('mysql');
const conection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud_session'
});

conection.connect((error) => {
    if (error) {
        console.log("error en la conexión a la Base de Datos: " + error)
        return;
    } 
    console.log("Conectado exitosamente a la Base de Datos");
});
module.exports = conection;