'use strict';

  
    var paginationService = require('../apistrategies/pagination.js');
       var NameImplementation = require('../../../implementation/NameService.js');
    
var NameData;

        


    module.exports.getName = function getName (req, res, next) {
    var args = req.swagger.params;
    NameImplementation.getName(args, (error, data) => {
        NameData = data;
        if (Object.keys(NameData).length > 0) {
                        res.setHeader('Content-Type', 'application/json');
                                                                                console.log('Start Pagination......');
            paginationService.getPages(args.pageNumber.value, args.pageSize.value, NameData).then(function(result) {
                res.writeHead(200, {
                    "Total": result.total,
                    "Per-Page": result.pageSize,
                    "Total-Pages": result.totalPages
                });
                res.end(JSON.stringify(result.pagedData));
            }).catch(function(error) {
                res.end(JSON.stringify(error));
            });
                                                    } else {
            res.end();
        }
    });
};
    
                
        
    
