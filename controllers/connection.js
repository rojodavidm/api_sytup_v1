const sqlServer = require('mssql');

var config = {
    user: process.env.USER_,
    password: process.env.PASS_,
    server: process.env.SERVER_,
    database: process.env.BD_,
    options: {
        trustServerCertificate: true,
        encrypt: true
    }
};

try {
    sqlServer.connect(config, err => {
        if (err) {
            looger.error("No se pudo conectar a la BBDD :", err, process.env.SERVER_,);
        }
        looger.info("¡Conexión exitosa!");
    });

} catch (error) {
    looger.error('ERROR', error);
}
