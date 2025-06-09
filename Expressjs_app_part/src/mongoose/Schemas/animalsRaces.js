const mongoose = require("mongoose");

const AnimalsRacesSchema = new mongoose.Schema({
    name: {
        type:mongoose.Schema.Types.String,
        required:true,
        unique: true,
    },
    espece: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
});
 const AnimalsRaces = mongoose.model("AnimalsRaces", AnimalsRacesSchema, "animalsRaces"); 

 module.exports = AnimalsRaces;