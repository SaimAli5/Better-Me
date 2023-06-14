// auth setup here
const express = require("express");
const authRouter = express.Router();
const pool = require("./db")

// Test database
// const pool = require("./test/test_db");

// session
const session = require("express-session");
const store = new session.MemoryStore();
// passport
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
// bcrypt
const bcrypt = require("bcrypt");
const { password } = require("pg/lib/defaults");

// session config
authRouter.use(
    session({
        secret: "fhawef93894rysiofw89r",
        cookie: {maxAge: 1000000},
        saveUninitialized: false,
        resave: false,
        store
    })
);

// passport config
authRouter.use(passport.initialize());
authRouter.use(passport.session());

// serielize user
// desrielize user

// passport auth 
passport.use( new localStrategy(
    async (username, password, done) =>{

        // password check
        const passAuthQuery = `SELECT password FROM users WHERE username = $1`;
        const passAuthResponse = await pool.query(passAuthQuery, [username]);

        // username check
        const userAuthQuery =  `SELECT * FROM users WHERE username = $1`;
        await pool.query(userAuthQuery, [username], (err, user) =>{

            if(err){
                return done(err);
            }
            if(user.length < 1){
                console.log("No user");
                return done(null, false);
            }
            if(password != passAuthResponse){
                console.log("Wrong password");
                return done(null, false);
            }
            console.log("Successfull Authentication")
            return done(null, user);
        });
    }
));

// register users
authRouter.post("/", async (req, res, next) =>{
    const {username, password} = req.body;
    const registerQuery = `INSERT INTO users (username, password) 
    VALUES ($1, $2) RETURNING *`;

    try {
        const newUser = await pool.query(registerQuery, [username, password]);
        if(newUser.rowCount > 0){
            console.log("New user registered 👍");
            res.send("Successfull registration");
        } else{
            console.log("registration failed");
            res.status(404).send({
                message: "Registration failed, please try again later"
                })
        }
    } catch(err){
        next(err);
    }
});

// login users
authRouter.use("/", (req, res, next) =>{
});

// Error handler
authRouter.use((err, req, res, next)=>{
    console.error(err);
    res.status(500).send("An error occurred, please try again later.");
})

module.exports = authRouter;