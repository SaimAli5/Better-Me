const express = require("express");
const custom_taskRouter = express.Router();



custom_taskRouter.get("/:listId", (req, res, next)=>{
});

custom_taskRouter.post("/", (req, res, next)=>{
});

custom_taskRouter.put("/:customTaskId", (req, res, next)=>{
});

custom_taskRouter.delete("/:customTaskId", (req, res, next)=>{
});



module.exports = custom_taskRouter;