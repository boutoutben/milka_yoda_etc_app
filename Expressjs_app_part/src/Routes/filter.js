const  express  = require("express");
const { filtedAnimals } = require("../handles/filter.js");

const router = express.Router();

router.post("/", filtedAnimals);


module.exports = router;