import { Router } from "express";
import db from "../mysqlDatabase.mjs";

export function authRole(role) {
    
    return async (req, res, next) => {
         const [rows] = await db
      .promise()
      .query("SELECT firstname, lastname, email, phone, roles.name as role FROM users INNER JOIN roles ON users.role = roles.id WHERE users.id = ?", [req.user.userId]);
        const user = rows[0];
        console.log(role);
        if(user.role === role){
            req.user = user;
            next();
        }
        else {
            const message = "Vous n'êtes pas autorisé";
            return res.status(403).json({ error: message });
        }
        
    }

}

