import express from "express";
import appRouter from './Routes/index.mjs';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log('Connect to mongo'))
    .catch((err)=>console.log(err))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.listen(PORT);

app.use(appRouter);