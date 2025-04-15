import db from "../mysqlDatabase.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginBlock = async (req, res) => {
  
  try {
    const { email, password, remember_me } = req.body;
    const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0 ) return res.status(400).send("L'email ou le mot de passe est incorect");

    const user = rows[0];
     if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
      return res.status(403).json({
        message: "Trop de tentatives. Réessayez dans 15 min",
        lockoutUntil: user.lockout_until,
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
   if (!passwordMatch) {
      // Increase failed_attempts
      const failedAttempts = user.failed_attempts + 1;
      const updates = ["failed_attempts = ?"];
      const values = [failedAttempts];

      if (failedAttempts >= 7) {
        const lockoutTime = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        updates.push("lockout_until = ?");
        values.push(lockoutTime);
      }

      values.push(email);
      await db.promise().query(`UPDATE users SET ${updates.join(", ")} WHERE email = ?`, values);

      return res.status(400).send("L'email ou le mot de passe est incorect");
    }

    await db.promise().query("UPDATE users SET failed_attempts = 0, lockout_until = NULL WHERE email = ?", [email]);
    // If "Remember Me" is checked, extend session duration

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: remember_me ? "30d" : "1h" } // 15 minutes pour une session classique
    );
    const expiresIn = remember_me ? "30d" : "1h";
      // Send response with JWT if you want to use it (optional)
      res.status(200).json({ token, user, expiresIn });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
}