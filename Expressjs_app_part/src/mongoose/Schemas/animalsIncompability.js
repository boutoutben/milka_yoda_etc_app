const mongoose = require("mongoose");

const AnimalsIncompatibilitySchema = new mongoose.Schema({
    name: {
        type:mongoose.Schema.Types.String,
        required:true,
        unique: true,
    },
    imgName: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
});

const AnimalsIncompatibility = mongoose.model("AnimalIncompatibility", AnimalsIncompatibilitySchema, "animalsIncompatibility"); 

module.exports = AnimalsIncompatibility;