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
  
    beforeEach(() => {
        const testData = [{ id: 1, title: 'Test List 1' }];
        sinon.stub(pool, 'query').resolves(testData);
    });

    afterEach(() => {
        pool.query.restore();
    });

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


        it("Should GET an array of lists", (done) => {
            chai.request(app) /* research about why is this "app" here */
                .get("/list")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.a('object');
                    res.body.should.have.property("status").eq("success")
                    res.body.should.have.property("message")
                    res.body.should.have.property("data")
                    res.body.data.should.have.a("array")
                    done()
                });
        });

        // it("Should NOT GET any list", (done) =>{

        //     chai.request(app) 
        //         .get("/list")
        //         .end((err, res) =>{
        //             res.should.have.status(204);
        //             res.body.should.have.property("status").eq("failure") 
        //             res.body.should.have.property("message")
        //         done();
        //         });
        // });

        // it("Should return with 500 status code", (done) =>{ /* research */
        //     const listObject = { title: '500 test' };

        //     const queryError = new Error('Database error');
        //     sinon.stub(pool, 'query').throws(queryError);

        //     chai.request(app)
        //         .post('/list')
        //         .send(listObject)
        //         .end((err, res) => {
        //             res.should.have.status(500);
        //             res.text.should.equal('An error occurred, please try again later.');
        //         sinon.restore();
        //         done();
        //         });
        // });
    });

});


// POST /list
// describe("POST /list", () => {

//     /* Cases:
//         // Route Success
//         - 201 status code when a list is successfully created
//         - In Success case route responds with list object
    
//         // Route Failure:
//         - 400 status code when the list creation is unsuccessful
//         - 400 status code when the title is empty
    
//         // Server Failure
//         - 500 status code when the try/catch block catches any error
//     */

//     it("Should POST a new list", (done) => {
//         const listObject = { title: "201 test" };

//         chai.request(app) /* research about why is this "app" here */
//             .post("/list")
//             .send(listObject)
//             .end((err, res) => {
//                 res.should.have.status(201);
//                 res.body.should.have.a('object');
//                 res.body.data.should.have.property('title').eq("201 test");
//                 done();
//             });
//     });

//     it("Should NOT POST a new list", (done) => {
//         const listObject = { title: "" };

//         chai.request(app)
//             .post("/list")
//             .send(listObject)
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 done();
//             });
//     });

//     it("Should return with 500 status code", (done) => { /* research */
//         const listObject = { title: '500 test' };

//         const queryError = new Error('Database error');
//         sinon.stub(pool, 'query').throws(queryError);

//         chai.request(app)
//             .post('/list')
//             .send(listObject)
//             .end((err, res) => {
//                 res.should.have.status(500);
//                 res.text.should.equal('An error occurred, please try again later.');
//                 sinon.restore();
//                 done();
//             });
//     });

// });

// PATCH /list
// describe("PATCH /list", () => {

//     /* Cases:
//         // Route Success
//         - 200 status code when a list is successfully created
//         - In Success case route responds with list title
    
//         // Route Failure:
//         - 400 status code when the list creation is unsuccessful
//         - 400 status code when the title in request body is empty
//         - 400 status code when the the :listname param is empty
    
//         // Server Failure
//         - 500 status code when the try/catch block catches any error
//     */

// });

// DELETE /list
// describe("DELETE /list", () => {

//     /* Cases:
//         // Route Success
//         - 200 status code when a list is successfully created
//         - In Success case route responds with list object that has been deleted 
    
//         // Route Failure:
//         - 400 status code when the list creation is unsuccessful
//         - 400 status code when the the :listname param is empty
    
//         // Server Failure
//         - 500 status code when the try/catch block catches any error
//     */

// });