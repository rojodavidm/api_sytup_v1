const express = require("express");
const path = require("path");
const app = express();
const rutas = require('./router/routers.js');
require('dotenv').config();
const looger = require('./utils/looger.js');

const PORT = process.env.PORT ||5000;
const URL_BASE = process.env.URL_BASE;

app.use(URL_BASE, rutas);

app.listen(PORT, () => {
    looger.info("Server Iniciado : "+PORT);
})      

