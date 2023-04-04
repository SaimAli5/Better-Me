const { should } = require("chai");
const chaiHttp = require("chai-http");
const list = require("../server/routes/list");

// assertion style
chai.should();

chai.use(chaiHttp);

// BDD testing suite
describe("POST /list", ()=>{

    it("it works", ()=>{
        assert.equal(1,1);
    });
    
});