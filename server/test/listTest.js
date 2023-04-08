const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");

// For server error testing:
const sinon = require("sinon");
const pool = require("./testDb");

// assertion style
chai.should();

chai.use(chaiHttp);

/* BDD testing suite */

// POST /list
describe("POST /list", () =>{

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

    it("Should POST a new list", (done) =>{
        const listObject = { title: "201 test" };

        chai.request(app) /* research about why is this "app" here */
            .post("/list")
            .send(listObject)
            .end((err, res) =>{
                res.should.have.status(201);
                res.body.should.have.a('object');
                res.body.data.should.have.property('title').eq("201 test");
            done();
            });
    });

    it("Should NOT POST a new list", (done) =>{
        const listObject = { title: "" };

        chai.request(app) 
            .post("/list")
            .send(listObject)
            .end((err, res) =>{
                res.should.have.status(400);
            done();
            });
    });

    it("Should return with 500 status code", (done) =>{ /* research */
        const listObject = { title: '500 test' };

        const queryError = new Error('Database error');
        sinon.stub(pool, 'query').throws(queryError);
  
        chai.request(app)
            .post('/list')
            .send(listObject)
            .end((err, res) => {
                res.should.have.status(500);
                res.text.should.equal('An error occurred, please try again later.');
            sinon.restore();
            done();
            });
    });

});