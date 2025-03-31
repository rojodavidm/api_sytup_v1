const mongoose = require('mongoose'); // Debo cambiarlo solo pruebas esto es SqlServer
const userSchema = new mongoose.Schema({
    rut: { type: String, required: true },
    id_consulta_deuda: { type: String, required: true },
});
module.exports = mongoose.model('User', userSchema);