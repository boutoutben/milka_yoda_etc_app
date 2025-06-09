const express = require("express");
const welcomeRouter = require('./welcome.js');
const adopteRouter = require('./adopt.js');
const filterRouter = require("./filter.js");
const mediatorRouter = require('./mediator.js');
const articleRouter = require("./articles.js");
const registerRouter = require('./register.js');
const loginRouter = require("./login.js");
const { verifyToken } = require("../utils/tokens.js");
const { authRole } = require("../utils/handleRoles.js");
const adopterSumaryRouter = require('./AdopterSumary.js');
const userSpaceRouter = require('./userSpace.js');
const adminSpaceRouter = require('./adminSpace.js');
const actionsRouter = require('./actions.js');
const {encryptRouter} = require('./encryptData.js');

const router = express.Router();

router.use("/api/welcomeData", welcomeRouter);
router.use("/api/adopt", adopteRouter);
router.use("/api/filter", filterRouter);
router.use("/api/mediator", mediatorRouter);
router.use("/api/articles", articleRouter);
router.use('/api/register', registerRouter);
router.use("/api", loginRouter);
router.use("/api/userSpace",verifyToken,authRole("USER_ROLE"), userSpaceRouter);
router.use("/api/adminSpace", verifyToken, authRole("ADMIN_ROLE"), adminSpaceRouter);
router.use("/api/adopterSumary", adopterSumaryRouter);
router.use("/api/action", actionsRouter);
router.use("/api/encrypt", encryptRouter)

module.exports = router;