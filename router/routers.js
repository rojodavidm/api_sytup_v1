const express = require("express");
const router = express.Router();
const path = require("path");
const { buffer } = require("stream/consumers");
//import { getConnection, sql } from "./../router/funciones.js";
var https = require('follow-redirects').https;
const looger = require('./../utils/looger.js');


module.exports = router;