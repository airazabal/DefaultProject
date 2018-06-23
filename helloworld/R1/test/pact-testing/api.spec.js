'use strict';

const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const { VerifierOptions } = require('@pact-foundation/pact-node');
chai.use(chaiAsPromised);
const { app } = require('../../index.js');

const config = require('../../configuration/config');

const SERVER_PORT = config.serverPort;
const BASE_PATH = `http://localhost:${SERVER_PORT}`;


app.post('/setup', (req, res) => {
  res.end()
});

// Verify that the api meets all client expectations
describe('Pact Verification', () => {
  it('should validate the expectations of Client Service', function () { // lexical binding required here
    this.timeout(10000)

    let opts = {
      provider: 'API Service',
      providerBaseUrl: BASE_PATH,
      providerStatesSetupUrl: BASE_PATH + '/setup',
      // Fetch pacts from broker
      // Local pacts
      pactUrls: [path.resolve(process.cwd(), './pacts/client_service-api_service.json')],
      publishVerificationResult: false,
      providerVersion: "1.0.0"
    }

    return new Verifier().verifyProvider(opts)
      .then(output => {
        console.log('Pact Verification Complete!')
        console.log(output)
      })
  })
})