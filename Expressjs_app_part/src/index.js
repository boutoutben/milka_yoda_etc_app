const express = require("express");
const appRouter = require('./Routes/index.js');
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = parseInt(process.env.PORT, 10) || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const listEndpoints = require('express-list-endpoints');
//console.log(listEndpoints(app));

