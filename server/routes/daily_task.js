const express = require("express");
const daily_taskRouter = express.Router();



daily_taskRouter.get("/", (req, res, next)=>{
});

daily_taskRouter.post("/", (req, res, next)=>{
});

daily_taskRouter.put("/:dailyTaskId", (req, res, next)=>{
});

daily_taskRouter.delete("/:dailyTaskId", (req, res, next)=>{
});



module.exports = daily_taskRouter