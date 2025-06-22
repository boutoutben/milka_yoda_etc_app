const db = require("../mysqlDatabase.js");

function authRole(role) {   
    return async (req, res, next) => {
        try {
            const [rows] = await db
                .promise()
                .query("SELECT firstname, lastname, email, phone, roles.name as role FROM users INNER JOIN roles ON users.role = roles.id WHERE users.id = ?", [req.user.userId]);
                    const user = rows[0];
            if(user.role === role){
                next();
            }
            else {
                const message = "Vous n'êtes pas autorisé";
                res.status(403).json({ error: message });
            }    
        } catch (err) {
            res.status(500).json({error: `Server error: ${err.message}`})
        }   
    }
}

module.exports = {
    authRole
}

