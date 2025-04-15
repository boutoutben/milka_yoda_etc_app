import mongoose from "mongoose";

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

export const AnimalsIncompatibility = mongoose.model("AnimalIncompatibility", AnimalsIncompatibilitySchema, "animalsIncompatibility"); 