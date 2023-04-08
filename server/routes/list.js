const express = require("express");
const listRouter = express.Router();
// const pool = require("../db")

// Test database
const pool = require("../test/testDb")

// sample user_id
const userId = 1; /* replace with real user Id from session info */


/* Custom lists endpoint */

// GET /list (Incomplete: user_id not included yet)
listRouter.get("/", async (req, res, next)=>{
    const getQuery = `
    SELECT * 
    FROM custom_list
    WHERE users_id = $1`;

    try {
        const response = await pool.query(getQuery, [userId]);

        // failure
        if(response.rowCount < 1){
            res.status(204).send({
                status: "failure",
                message: "No list found"
            })
        };

        // success
        res.status(200).send({
            status: "success",
            message: "Custom lists successfully retrieved",
            data: response.rows
        });
    } catch(err){
        next(err);
    }
});


// POST /list (Incomplete: user_id not included yet)
listRouter.post("/", async (req, res, next)=>{
    const {title} = req.body;
    const postQuery = `
    INSERT INTO custom_list (title, users_id)
    VALUES ($1, $2) 
    RETURNING *`;

    // Return 400 bad request if title is missing or empty
    if (!title || !title.length){
        console.log("Title is empty ❕");
        return res.status(400).send({
            status: "failure",
            message: "Title is missing or empty"
        });
    };

    try {
        const response = await pool.query(postQuery, [title, userId]);

        // failure
        if(response.rowCount < 1){
            console.log("List creation was unsuccessfull 👎");
            return res.status(400).send({
                status: "failure",
                message: "List creation was unsuccessfull"
            })
        };

        // success
        res.status(201).send({
            status: "success",
            message: "List was created successfully",
            data: response.rows[0]
        });

        console.log("List creation was successfull 👍");
    } catch(err){
        next(err);
    }
});


// PUT /list/:listname
listRouter.put("/:listname", (req, res, next)=>{
});


// DELETE /list/:listname
listRouter.delete("/:listname", (req, res, next)=>{
});


// Error handler
listRouter.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).send("An error occurred, please try again later.");
  })


module.exports = listRouter