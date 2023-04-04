const express = require("express");
const listRouter = express.Router();
const pool = require("../db")


// custom lists endpoint

listRouter.get("/", (req, res, next)=>{
});

// POST /list (Incomplete: user_id not included yet)
listRouter.post("/", async (req, res, next)=>{
    const {title} = req.body;
    const postQuery = `INSERT INTO custom_list (title)
    VALUES ($1) RETURNING *`;

    try{
        const response = await pool.query(postQuery, [title]);
        if(response.rowCount < 1){
            console.log("List creation was unsuccessfull 🙁");
            return res.status(400).send({
                status: "failure",
                message: "List creation was unsuccessfull"
            })
        }
        res.status(201).send({
            status: "success",
            message: "List was created successfully",
            data: response.rows[0]
        })
        console.log("List creation was successfull 😄");
    } catch(err){
        next(err)
    }
});

listRouter.put("/:listname", (req, res, next)=>{
});

listRouter.delete("/:listname", (req, res, next)=>{
});


// Error handler
listRouter.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send("An error occurred, please try again later.");
  })


module.exports = listRouter