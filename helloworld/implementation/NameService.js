'use strict';
var fs = require("fs");
/*
* This file will not be changed by the generator
*/
var samplePath = '/sampleData/v1/Name.json';
var bodyParam = 'names/v1'; 
     


exports.getName = function(args, cb) {
    /**
    * To Do: Change to your custom implementation
    *
    **/
    var revision = args.revision ? args.revision.value: 'R1';
    var NameFD = fs.readFileSync(__dirname +'/../'+revision+samplePath);
    var NameData = [];
    if(NameFD) {
        NameData = JSON.parse(NameFD);
    }
    cb(null, NameData);
}


