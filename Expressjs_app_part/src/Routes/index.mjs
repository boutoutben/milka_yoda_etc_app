import { Router } from "express";
import welcomeRouter from './welcome.mjs';

const router = Router();

router.use("/api/welcomeData", welcomeRouter);

export default router;