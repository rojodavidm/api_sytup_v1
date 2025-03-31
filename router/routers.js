const express = require("express");
const router = express.Router();
const path = require("path");
const { buffer } = require("stream/consumers");
//import { getConnection, sql } from "./../router/funciones.js";
var https = require('follow-redirects').https;
const looger = require('./../utils/looger.js');

router.get("/deudas", async (req, res) => {
    try {

/*

{
  "resources": [
    {
      "id_intencion_pago": 4540232,
      "fecha_vencimiento": "2025-01-01",
      "id_autopista": "79823983324",
      "id_contrato": "12342345",
      "id_contrato_rnut": "12342345",
      "saldo": 34234532
    }
  ]
}


*/
      const postData = req.rawBody;

      // Desestructuración de los parámetros de la consulta
      const { rut, convenio, codigosesion} = req.query;
  
      // Validación de parámetros obligatorios
      if (!rut || !convenio || !codigosesion) {
        looger.error("Se reciben datos nulos o vacíos: ", { rut, convenio, codigosesion });
        return res.status(400).json({ error: "Faltan parámetros requeridos." });
      }
  
      looger.info(`Solicitud recibida por Rut: ${rut}, Convenio: ${convenio}, Sesión: ${codigosesion}`);
      looger.info(`Solicitud XML Recibido ${postData}`);
  
      // Configuración de la solicitud HTTPS
      const options = {
        method: 'GET',
        url: 'https://api.example.cl/api/v1/deudas',
        qs: {rut: '123456789', id_consulta_deuda: '123e4567-e89b-12d3-a456-426614174000'},
        headers: {Authorization: 'Bearer REPLACE_BEARER_TOKEN'}
      };

         
      looger.info(`Respuesta recibida: ${xmlResponse}`);
  
  
      res.json({
        servicio: "Unired",
        status: "OK",
        metodo: "POST",
        mensaje: tiP,
        xmlRequ: xmlResponse,
      });
    } catch (error) {
      looger.error("Error en la solicitud:", error);
      res.status(500).json({ error: "Error interno en el servidor." });
    }
  });

  router.get("/pagos", async (req, res) => {
    try {
/*
{
  "resources": [
    {
      "fecha_facturacion": "2025-01-01",
      "fecha_pago": "2025-01-01",
      "id_boleta": 566798,
      "id_contrato": "12342345",
      "monto": 34234532,
      "verificado": true
    }
  ],
  "meta": {
    "current_page": 1,
    "total_items": 100,
    "size": 10,
    "total_pages": 1000
  }
}




*/



      const postData = req.rawBody;
  
      // Expresiones regulares mejoradas (sin signos de interrogación incorrectos)
      const ticketRegex = /<IdTicket>(.*?)<\/IdTicket>/gmi;
      const idTicketRegex = /<IdTicketEncriptado>(.*?)<\/IdTicketEncriptado>/gmi;
  
      // Desestructuración de los parámetros de la consulta
      const { rut, convenio, codigosesion} = req.query;
  
      // Validación de parámetros obligatorios
      if (!rut || !convenio || !codigosesion) {
        looger.error("Se reciben datos nulos o vacíos: ", { rut, convenio, codigosesion });
        return res.status(400).json({ error: "Faltan parámetros requeridos." });
      }
  
      looger.info(`Solicitud recibida por Rut: ${rut}, Convenio: ${convenio}, Sesión: ${codigosesion}`);
      looger.info(`Solicitud XML Recibido ${postData}`);
  
      // Configuración de la solicitud HTTPS
      const options = {
        method: "POST",
        hostname: process.env.URL_API_,
        path: process.env.SERVICE_,
        headers: {
          "Content-Type": "application/json",
        },
        maxRedirects: 20,
      };
  
      // Llamada HTTPS envuelta en promesa
      const xmlResponse = await makeHttpsRequest(options, postData);
  
      // Extraer valores del XML usando regex
      const ticketMatch = ticketRegex.exec(xmlResponse);
      const idTicketMatch = idTicketRegex.exec(xmlResponse);
  
      if (!ticketMatch || !idTicketMatch) {
        throw new Error("No se pudo extraer el ticket o el ID del ticket.");
      }
  
      const tiP = ticketMatch[1];
      const IdtiP = idTicketMatch[1];
  
      looger.info(`Respuesta recibida: ${xmlResponse}`);
  
      console.log(`
  ------------------------------ Recibo un POST Delphi ------------------------------
      Método             => ${options.method}
      URL                => ${options.hostname}${options.path}
      Mensaje Respuesta  => OK
      Ticket             => ${tiP}
      Id Ticket Encrip   => ${IdtiP}
  -----------------------------------------------------------------------------------
      Respuesta          => ${xmlResponse}
  `);
  
      res.json({
        servicio: "Unired",
        status: "OK",
        metodo: "POST",
        mensaje: tiP,
        xmlRequ: xmlResponse,
      });
    } catch (error) {
      looger.error("Error en la solicitud:", error);
      res.status(500).json({ error: "Error interno en el servidor." });
    }
  });
  

// Función para manejar solicitudes HTTPS con Promesas
function makeHttpsRequest(options, postData) {
    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let chunks = [];
  
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks).toString()));
        res.on("error", (error) => reject(error));
      });
  
      req.on("error", (error) => reject(error));
      req.write(postData);
      req.end();
    });
  }


  router.get('/', (req, res) => {
    var options = {
      'method': 'GET',
      'hostname': process.env.URL_API_,
      'path': process.env.ENDPOINT_
    }
    console.log(`
      ------------------------------ Recibo un POST Delphi ------------------------------
        Método            => ${options.method}
        Url               => ${options.hostname}${options.path}
      -----------------------------------------------------------------------------------      
        `);
    
    res.json({ servicio: "Sytup ", status: "OK", methodo: "GET", Messagge: "200" });
  });

  router.get('*', (req, res) => {
    looger.info('Ruta no ecnontrada. GET');
    res.json({ status: "Nok", Messagge: '¡Error 404!' })
  });
  
  router.post('*', (req, res) => {
    looger.info('Ruta no ecnontrada. POST');
    res.json({ status: "Nok", Messagge: '¡Error 404!' })
  });
  

module.exports = router;