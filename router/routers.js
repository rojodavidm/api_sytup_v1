const express = require("express");
const router = express.Router();
const path = require("path");
const { buffer } = require("stream/consumers");
//import { getConnection, sql } from "./../router/funciones.js";
var https = require('follow-redirects').https;
const looger = require('./../utils/looger.js');
const jwt = require('jsonwebtoken');

router.post("/generateToken", (req, res) => {
  let data = {
      time: Date(),
      tokenId : 1
  }
  const token = jwt.sign(data, 'secret-key');
  res.json({'secret-key' : token})
});


router.get("/validateToken", (req, res) => {
  try {
      const token = req.header("token");
      const verified = jwt.verify(token,  process.env.TOKEN_CLIENT);
      if(verified){
        res.json ({
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
        })
  //        return res.json({'result' : 'Token verified successfully'})
      }else{
          return res.json({'result' : 'Token verification failed'})
      
      }
  } catch (error) {
      console.log(error)
      return res.json({'result' : 'Something went wrong'})
  }
});

router.get("/deudas", async (req, res) => {
    try {

      const SecretToken = process.env.TOKEN_CLIENT;
      const authHeader = req.headers['authorization']
   
      // Desestructuración de los parámetros de la consulta
      const { rut, id_consulta_deuda} = req.query;
  
      
     // const token = jwt.sign( {authHeader}, process.env.TOKEN_CLIENT, { expiresIn: 60});
      const token = jwt.sign({authHeader}, process.env.TOKEN_CLIENT, { expiresIn: '2m' });
     // res.status(200).send({msg:`El nombre es ${authHeader}`, token:`${token}`})
      looger.info(`Token : ${token}`);
    
      // Validación de parámetros obligatorios
      if (!rut || !id_consulta_deuda ) {
        looger.error("Se reciben datos nulos o vacíos: ", { rut, id_consulta_deuda });
        return res.status(400).json({"message": "Solicitud inválida"});
      }
  

      if (!token ) {
        looger.error("Token recibido no es valido ");
        return res.status(401).json({"message": "Solicitud no autorizada"});
      }



      looger.info(`Solicitud recibida por Rut: ${rut}, Convenio: ${id_consulta_deuda}`);
      looger.info(`Headres: ${token}`);        
  
      res.json({
        servicio: "Sytup",
        status: "OK",
        metodo: "GET"
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