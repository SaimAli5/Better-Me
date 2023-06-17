// Initiating User_Auth

const express = require("express");
const listRouter = express.Router();
// const pool = require("../db")

// Test database
const pool = require("../test/test_db")

// sample user_id
const userId = 1;         /*     replace with real user Id from session info      */


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
            console.log("GET /list request successfull but no content 👎");
            return res.status(200).send({
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
        console.log("GET /list request successfull 👍");
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
        console.log("POST: List title is empty ❕");
        return res.status(400).send({
            status: "failure",
            message: "Title is missing or empty"
        });
    };

    try {
        const response = await pool.query(postQuery, [title, userId]);

        // failure
        if(response.rowCount < 1){
            console.log("POST /list request unsuccessfull 👎");
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
        console.log("POST /list request successfull 👍");
    } catch(err){
        next(err);
    }
});


// PATCH /list/:listname (title patch)
listRouter.patch("/:listname", async (req, res, next)=>{
    const listName = req.params.listname;
    const {title} = req.body;
    const putQuery = `
    UPDATE custom_list
    SET title = $1
    WHERE title = $2
    RETURNING *`;

    // Return 400 bad request if title is missing or empty
    if (!title || !title.length){
        console.log("PATCH: List title is empty ❕");
        return res.status(400).send({
            status: "failure",
            message: "Title is missing or empty"
        })
    };

    try {
        const response = await pool.query(putQuery, [title, listName]);

        // failure
        if(response.rowCount < 1){
            console.log("PATCH /list request unsuccessfull 👎");
            return res.status(400).send({
                status: "failure",
                message: "Title update was unsuccessfull",
            });
        }

        // success
        res.status(200).send({
            status: "success",
            message: "Title udated successfully",
            data: response.rows[0]
        });
        console.log("PATCH /list request successfull 👍");
    } catch(err){
        next(err);
    }
});


// DELETE /list/:listname
listRouter.delete("/:listname", async (req, res, next)=>{
    const listName = req.params.listname;
    const deleteQuery =  `
    DELETE FROM custom_list
    WHERE title = $1
    RETURNING *`;

    try {
        const response = await pool.query(deleteQuery, [listName]);

        // failure
        if(response.rowCount < 1){
            console.log("DELETE /list request unsuccessfull 👎");
            return res.status(400).send({
                status: "failure",
                message: "List removal was unsuccessfull",
            })
        };

        // success
        res.status(200).send({
            status: "success",
            message: "List removed successfully",
            data: response.rows[0]
        });
        console.log("DELETE /list request successfull 👍");
    } catch(err){
        next(err);
    }
});


// Error handler
listRouter.use((err, req, res, next)=>{
    console.log("/list: Error thrown from Error handler 🔴")
    console.error(err.stack); /* can comment this when testing */
    res.status(500).send("An error occurred, please try again later.");
  })


module.exports = listRouter