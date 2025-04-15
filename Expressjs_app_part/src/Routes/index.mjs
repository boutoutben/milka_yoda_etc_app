import { Router } from "express";
import welcomeRouter from './welcome.mjs';
import adopteRouter from './adopt.mjs';
import filterRouter from "./filter.mjs";
import mediatorRouter from './mediator.mjs';
import articleRouter from "./articles.mjs";
import articleDetailRouter from './articleDetail.mjs';
import registerRouter from './register.mjs';
import loginRouter from "./login.mjs";
import { verifyToken } from "../utils/tokens.mjs";
import { authRole } from "../utils/handleRoles.mjs";

const router = Router();

router.use("/api/welcomeData", welcomeRouter);
router.use("/api/adopt", adopteRouter);
router.use("/api/filter", filterRouter);
router.use("/api/mediator", mediatorRouter);
router.use("/api/articles", articleRouter);
router.use("/api/articleDetail", articleDetailRouter);
router.use('/api/register', registerRouter);
router.use("/api", loginRouter);
router.use("/api/userSpace",verifyToken,authRole("USER_ROLE"));
router.use("/api/adminSpace", verifyToken, authRole("ADMIN_ROLE"))

export default router;