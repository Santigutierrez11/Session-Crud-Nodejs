const express = require('express');
const app = express();
const res = require('express/lib/response');
const bcryptjs = require('bcryptjs');
const session = require('express-session');
const conection = require('./database/db');
const { resetWatchers } = require('nodemon/lib/monitor/watch');

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use('/resources', express.static('public'));
app.use('/responces', express.static(__dirname + '/public'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

// RUTAS
app.get('/login', (req, res) => {
    res.render('login/login');
});

app.post('/registrar', async (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const rol = req.body.rol;
    const user = req.body.username;
    const pass = req.body.pass;
    let passwordHassh = await bcryptjs.hash(pass, 8);
    conection.query("INSERT INTO usuarios SET ?", {nombre:nombre, apellido:apellido, usuario:user, pass:passwordHassh}, async(error, result) => {
        if (error){
            console.log(error);
        } else {
            res.render('login/login', {
                alert: true,
                alertTitle: "Registro",
                alertMessage: "Registro Correcto",
                alertIcon: "success",
                showConfirmButton: true,
                timer: 2000,
                ruta: 'login'
            });
        }
    });
});

app.listen(5000, (req, res) => {
    console.log("Servidor corriendo en https://localhost:5000");
});