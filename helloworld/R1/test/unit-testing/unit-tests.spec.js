'use strict';

const chai = require('chai');
const expect = require('chai').expect;
chai.use(require('chai-http'));
const { app } = require('../../index.js'); // Our app
var fs = require("fs");

const BASE_PATH = '/api/names/v1';
const samplePath = '/../../sampleData/v1/name.json';
var nameData;

describe('Testing mochatestings API endpoints', function () {

  beforeEach(function() {
    var nameFD = fs.readFileSync(__dirname + samplePath);
    nameData = [];
    if(nameFD) {
      nameData = JSON.parse(nameFD);
    }
  });


                        
  // GET - List all records
  it('GET List of names', function () {
    return chai.request(app)
      .get(BASE_PATH)
      .then(function (res) {
        var data = res.body;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(data.length).to.be.eql(nameData.length);
      });
  });
                    

      
});