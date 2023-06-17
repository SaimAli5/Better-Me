const express = require("express");
const apiRouter = express.Router();

// list router
const listRouter = require("./routes/list");
apiRouter.use("/list", listRouter);

// daily_task router
const daily_taskRouter = require("./routes/daily_task");
apiRouter.use("/daily_task", daily_taskRouter);

// custom_task router
const custom_taskRouter = require("./routes/custom_task");
apiRouter.use("/custom_task", custom_taskRouter);

// auth router
const authRouter = require("./auth");
apiRouter.use("/auth", authRouter);

module.exports = apiRouter;