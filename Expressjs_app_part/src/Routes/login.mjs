import { Router } from "express";
import { loginBlock } from "../handles/login.mjs";


const router = Router();



router.post("/login", loginBlock);



export default router;