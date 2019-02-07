var mongoose = require("mongoose");
//Poner la categoria del objeto
var instrumentSchema = new mongoose.Schema({
	name: {type: String, required: true, default: "N/A"},
	instrumentImage: {type: String, required: true, default: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Imagen_no_disponible.svg/1024px-Imagen_no_disponible.svg.png"},
	cantidad: {type: Number, required: true, default: 0},
	categories: {type: String, enum: ["Diodos", "Capacitores", "Transistores", "Herramientas"], default: "Herramientas"},
	created_at: {type: Date, default: Date.now()},
	location: {type: String, default: "N/A"}
});

module.exports = mongoose.model("Instrument", instrumentSchema);