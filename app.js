const express = require('express');
const app = express();
const conection = require('./database/db');


app.listen(5000, (req, res) => {
    console.log("Servidor corriendo en https://localhost:5000");
});