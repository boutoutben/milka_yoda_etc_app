import { Router } from "express";
import parseUrl from 'body-parser';
import db from "../mysqlDatabase.mjs";
import { hashPassword } from "../utils/hashPassword.mjs";
import { registerBlock } from "../handles/register.mjs";

const router = Router();

let encodeUrl = parseUrl.urlencoded({ extended: false });

router.post('/', encodeUrl, registerBlock);

export default router;