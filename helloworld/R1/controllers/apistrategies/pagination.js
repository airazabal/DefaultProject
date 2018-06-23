'use strict';

var Promise = require('bluebird');

module.exports.getPages = function (pageNumber, pageSize, data) {
  var returnObj = {
    pageSize: pageSize ? pageSize : null,
    pagedData: data,
    total: data.length,
    totalPages: Math.ceil(data.length / pageSize) ? Math.ceil(data.length / pageSize) : null
  };
  return new Promise(function (resolve, reject) {
    try {
      if (((pageNumber * pageSize) <= data.length) || ((pageNumber * pageSize) - data.length !== 0)) {
        if (!pageNumber || !pageSize) {
          resolve(returnObj);
        } else {
          var newArray = data.slice(((pageNumber * pageSize) - pageSize), (pageNumber * pageSize));
          returnObj.pagedData = newArray;
          resolve(returnObj);
        }
      } else {
        returnObj.pagedData = [];
        resolve(returnObj);
      }
    } catch (error) {
      reject(error);
    }
  });
};
