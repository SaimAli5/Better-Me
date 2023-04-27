const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const pool = require('./pool'); // The module that exports the database connection pool
const app = require('./app'); // The Express app to be tested

chai.use(chaiHttp);
const expect = chai.expect;

describe('/list routes', () => {
  beforeEach(() => {
    sinon.stub(pool, 'query');
  });

  afterEach(() => {
    pool.query.restore();
  });

  describe('GET /list', () => {
    it('should return an array of lists', async () => {
      // Stub the database query to return some test data
      const testData = [{ id: 1, title: 'Test List 1' }, { id: 2, title: 'Test List 2' }];
      pool.query.resolves(testData);

      // Make the HTTP request to the Express app
      const res = await chai.request(app).get('/list');

      // Assert that the response has the expected status code and data
      expect(res).to.have.status(200);
      expect(res.body).to.deep.equal({
        status: 'success',
        message: 'Lists retrieved successfully',
        data: testData,
      });
    });

    it('should return a 204 status code when no lists are found', async () => {
      // Stub the database query to return an empty array
      pool.query.resolves([]);

      // Make the HTTP request to the Express app
      const res = await chai.request(app).get('/list');

      // Assert that the response has the expected status code and data
      expect(res).to.have.status(204);
      res.body.should.deep.equal({
        status: 'failure',
        message: 'No lists found for this user',
      });
    });

    it('should return a 500 status code when there is a database error', async () => {
      // Stub the database query to throw an error
      const queryError = new Error('Database error');
      pool.query.throws(queryError);

      // Make the HTTP request to the Express app
      const res = await chai.request(app).get('/list');

      // Assert that the response has the expected status code and data
      expect(res).to.have.status(500);
      expect(res.text).to.equal('An error occurred, please try again later.');
    });
  });
});
