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

    // LOGIN
app.get('/login', (req, res) => {
    res.render('login/login');
});
//post registrar
app.post('/registrar', async (req, res) => {
    const nombre = req.body.nombre;
    const apellido = req.body.apellido;
    const rol = req.body.rol;
    const user = req.body.username;
    const pass = req.body.pass;
    let passwordHassh = await bcryptjs.hash(pass, 8);
    conection.query("INSERT INTO usuarios SET ?", {nombre:nombre, apellido:apellido, usuario:user, pass:passwordHassh, rol:rol}, async(error, result) => {
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

//post login
app.post('/auth', async (req, res) => {
    const user = req.body.username;
    const pass = req.body.pass;
    let passwordHassh = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        conection.query('SELECT * FROM usuarios WHERE usuario = ?', [user], async (error, results) => {
            if (results.lenght == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render('login/login', {
                    alert: true,
                    alertTitle: "error",
                    alertMessage: "Usuario y/o Contraseña incorrecta",
                    alertIcon: "error",
                    showConfirmButton: true,
                    timer: 2000,
                    ruta: 'login'
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].nombre;
                res.render('login/login', {
                    alert: true,
                    alertTitle: "Bienvenido",
                    alertMessage: "Login Correcto",
                    alertIcon: "success",
                    showConfirmButton: true,
                    timer: 2000,
                    ruta: '/'
                })
            }
        });
    } else {
        res.render('login/login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese un Usuario y/o Constraseña",
            alertIcon: "warning",
            showConfirmButton: true,
            timer: 2000,
            ruta: 'login'
        });
    }
});

// control de Session
app.get('/', (req, res) => {
    if(req.session.loggedin){
        res.render('index', {
            login: true,
            name: req.session.name
        });
    }else{
        res.render('index', {
            login: false,
            name: 'iniciar session'
        });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

app.listen(5000, (req, res) => {
    console.log("Servidor corriendo en https://localhost:5000");
});