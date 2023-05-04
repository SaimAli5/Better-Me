const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");

// db_testing
const sinon = require("sinon");
const pool = require("./test_db");

// assertion style
chai.should();

chai.use(chaiHttp);

/*   BDD testing suite    */

// /list
describe("/list", () => {

    const postQuery = `
    INSERT INTO custom_list (title, users_id)
    VALUES ('test_list', 1) 
    RETURNING *`;

    // list objects for testing different cases
    const listObject = { title: "test post title" };
    const emptyListObject = { title: "" };

    // Using transactions as hooks to isolate each test 
    beforeEach( async() =>{
        await pool.query("BEGIN");  
    })
    afterEach( async() =>{
        await pool.query("ROLLBACK");  
    })


    // GET /list
    describe("GET /list", () => {

        /* Cases:
            // Route Success
            - 200 status code when list reterival is successfull
            - In Success case route responds with an array of list object

            // Route Failure:
            - 204 status code when there is no list found related to logged in user

            // Server Failure
            - 500 status code when the try/catch block catches any error
        */

        it("Should GET an array of lists", async () => {

            await pool.query(postQuery);

            const res = await chai.request(app).get("/list");

            res.should.have.status(200);
            res.body.should.have.a('object');
            res.body.should.have.property("status").eq("success");
            res.body.should.have.property("message");
            res.body.should.have.property("data");
            res.body.data.should.have.a("array");
        });


        it("Should NOT GET any list", async () =>{

            const res = await chai.request(app).get("/list");

            res.should.have.status(200);
            res.body.should.have.property("status").eq("failure") 
            res.body.should.have.property("message")
        });


        it("Should return with 500 status code", async() =>{ 

            // Creating and throwing error for handler to catch
            const queryError = new Error('Test error');
            sinon.stub(pool, 'query').throws(queryError);

            const res = await chai.request(app).get("/list");

            res.should.have.status(500);
            res.text.should.equal('An error occurred, please try again later.');
            sinon.restore();
        });
    });


    // POST /list
    describe("POST /list", () => {

        /* Cases:
            // Route Success
            - 201 status code when a list is successfully created
            - In Success case route responds with list object
        
            // Route Failure:
            - 400 status code when the list creation is unsuccessful
            - 400 status code when the title is empty
        
            // Server Failure
            - 500 status code when the try/catch block catches any error
        */

        
        it("Should POST a new list", async() => {

            const res = await chai.request(app).post("/list").send(listObject);

            res.should.have.status(201);
            res.body.should.have.a('object');
            res.body.data.should.have.property('title').eq("test post title");
        });

    
        it("Should NOT POST a new list", async() => {

            const res = await chai.request(app).post("/list").send(emptyListObject);

            res.should.have.status(400);
            res.body.should.have.property("status").eq("failure");
            res.body.should.have.property("message");
        });

    
        it("Should return with 500 status code", async() => { 

            // Creating and throwing error for handler to catch
            const queryError = new Error('Test error');
            sinon.stub(pool, 'query').throws(queryError);

            const res = await chai.request(app).post("/list").send(listObject);

            res.should.have.status(500);
            res.text.should.equal('An error occurred, please try again later.');
            sinon.restore();
        });
    
    });


    // PATCH /list
    describe("PATCH /list", () => {

        /* Cases:+
            // Route Success
            - 200 status code when a list's title is successfully updated
            - In Success case route responds with list title
        
            // Route Failure:
            - 400 status code when the list creation is unsuccessful
            - 400 status code when the title in request body is empty
            - 400 status code when the the :listname param is empty
        
            // Server Failure
            - 500 status code when the try/catch block catches any error
        */


        it("Should PATCH the title of list", async() =>{

            await pool.query(postQuery);

            const res = await chai.request(app).patch("/list/test_list").send(listObject);
            
            res.should.have.status(200);
            res.body.should.have.a('object');
            res.body.should.have.property("status").eq("success");
            res.body.should.have.property("message");
            res.body.should.have.property("data");
            res.body.data.should.have.property('title').eq("test post title");
        });


        // if requested title doesnt match in database
        it("Should NOT PATCH the title of list", async() =>{

            const res = await chai.request(app).patch("/list/test_list").send(listObject);
            
            res.should.have.status(400);
            res.body.should.have.a('object');
            res.body.should.have.property("status").eq("failure");
            res.body.should.have.property("message").eq("Title update was unsuccessfull");
        });

        
        // if title is missing in req body
        it("Should NOT PATCH when title is missing", async() =>{

            await pool.query(postQuery);

            const res = await chai.request(app).patch("/list/test_list").send(emptyListObject);
            
            res.should.have.status(400);
            res.body.should.have.a('object');
            res.body.should.have.property("status").eq("failure");
            res.body.should.have.property("message").eq("Title is missing or empty");
        });


        it("Should return with 500 status code", async() => { 

            // Creating and throwing error for handler to catch
            const queryError = new Error('Test error');
            sinon.stub(pool, 'query').throws(queryError);

            const res = await chai.request(app).patch("/list/test_list").send(listObject);

            res.should.have.status(500);
            res.text.should.equal('An error occurred, please try again later.');
            sinon.restore();
        });
    
    });


    // DELETE /list
    describe("DELETE /list", () => {

        /* Cases:
            // Route Success
            - 200 status code when a list is successfully created
            - In Success case route responds with list object that has been deleted 
        
            // Route Failure:
            - 400 status code when the list creation is unsuccessful
            - 400 status code when the the :listname param is empty
        
            // Server Failure
            - 500 status code when the try/catch block catches any error
        */
    
    });

});