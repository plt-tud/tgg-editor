var SparqlClient = require('sparql-client-2');
var fs = require('fs');


var SparqlHandler = module.exports = function SparqlHandler(endpoint) {
  this.endpoint = endpoint;
  // "/update/" Fuseki spezific
  this.client = new SparqlClient(this.endpoint, {updateEndpoint: this.endpoint + '/update'});

  this.client.register({
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    sp: 'http://spinrdf.org/sp#',
    list: 'http://jena.hpl.hp.com/ARQ/list#',
    owl: 'http://www.w3.org/2002/07/owl#',
    cm: 'http://comvantage.eu/graph-trans/cae/meta#',
    hm: 'http://comvantage.eu/graph-trans/hmi/meta#',
    tm: 'http://comvantage.eu/graph-trans/table/m#',
    c: 'http://comvantage.eu/graph-trans/correspondence#',
    tgg: 'http://eatld.et.tu-dresden.de/tgg#'
  })
  SparqlHandler.prototype.executeQuery = function (sQuery) {

    console.log("Query: " + sQuery);
    that = this;   // Fix to call class methode setResult
    return that.client.query(sQuery)
      //.execute({format: {resource: 'name'}})
        .execute()
        .then(response => Promise.resolve(response.results))
        .catch(function (error) {
          console.log(error);
          // logs '400'
          console.log(err.httpStatus);
          // logs 'HTTP Error: 400 Bad Request'
        });
  };

  SparqlHandler.prototype.setResult = function (queryResult) {
    this.result = queryResult;
  };

  SparqlHandler.prototype.getResult = function () {
    return this.result;
  };

};


//module.exports.executeQuery = executeQuery;
