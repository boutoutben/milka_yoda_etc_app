import express from "express";
import appRouter from './Routes/index.mjs';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 5000;
mongoose.connect(process.env.MONGO_URL)
    .then(()=> console.log('Connect to mongo'))
    .catch((err)=>console.log(err))
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true 
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));


app.listen(PORT);

app.use(appRouter);

