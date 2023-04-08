// Main server file
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

// Import & Mount apiRouter
const apiRouter = require("./server/api");
app.use("/", apiRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is listening on ${PORT}`);
});

module.exports = app;