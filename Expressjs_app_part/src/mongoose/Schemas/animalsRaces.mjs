import mongoose from "mongoose";

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

export const AnimalsRaces = mongoose.model("AnimalsRaces", AnimalsRacesSchema, "animalsRaces"); 