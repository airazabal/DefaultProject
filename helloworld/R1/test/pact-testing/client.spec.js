'use strict';

const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const { Pact } = require('@pact-foundation/pact');
const expect = chai.expect;
var fs = require("fs");
chai.use(chaiAsPromised);

const config = require('../../configuration/config');
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';
const MOCK_SERVER_PORT = config.MOCK_SERVER_PORT;

const BASE_PATH = '/api/names/v1';
var samplePath = '/../../sampleData/v1/name.json';

describe('Pact', () => {
  const provider = new Pact({
    consumer: 'Client Service',
    provider: 'API Service',
    port: MOCK_SERVER_PORT,
    log: path.resolve(process.cwd(), 'logs', 'mockserver-integration.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: LOG_LEVEL,
    spec: 2
  })

  // Define the list of expected records (Read from the sample data file)
  const expectedRecords = JSON.parse(fs.readFileSync(__dirname + samplePath));


  // Setup a Mock Server before unit tests run.
  // This server acts as a Test Double for the real Provider API.
  // We then call addInteraction() for each test to configure the Mock Service
  // to act like the Provider
  // It also sets up expectations for what requests are to come, and will fail
  // if the calls are not seen.
  before(() => provider.setup())

  // After each individual test (one or more interactions)
  // we validate that the correct request came through.
  // This ensures what we _expect_ from the provider, is actually
  // what we've asked for (and is what gets captured in the contract)
  afterEach(() => provider.verify())

  // Configure and import client API
  // Note that we update the API endpoint to point at the Mock Service
  process.env.API_HOST = `http://localhost:${MOCK_SERVER_PORT}`
  const client = require('./dummyClient')

  // Verify service client works as expected.
  //
  // Note that we don't call the client API endpoints directly, but
  // use unit-style tests that test the collaborating function behaviour -
  // we want to test the function that is calling the external service.

              describe('when a call to list all records from the API Service is made', () => {
    describe('and there are records in the sample data', () => {
      before(() =>
        provider.addInteraction({
          state: 'Has some records',
          uponReceiving: 'a request for all records',
          withRequest: {
            method: 'GET',
            path: BASE_PATH
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            },
            body: expectedRecords
          }
        }))

      it('returns a list of records', done => {
        client.getname((error,response)=>{
          var parsedData = JSON.parse(response.body);
          expect(parsedData.length == expectedRecords.length);
          done();
        });
      })
    })
  })
    
  
      

      // Write pact files
  after(() => {
    return provider.finalize()
  });
});