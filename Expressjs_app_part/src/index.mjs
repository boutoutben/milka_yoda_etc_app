import express from "express";
import appRouter from './Routes/index.mjs';
import cors from 'cors';


const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());


app.listen(PORT);

app.use(appRouter);