const express = require('express');
const http = require('http');
const app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/', function (req, res) {
  console.log('Eine Datei wird ausgeliefert!');
  res.sendFile(__dirname + '/views/index.html');

});


app.get('/api/test', function (req, res) {
  console.log('/api/test');
  res.send({test: "succesful"});
});


app.post('/sparql', function (req, res) {

  var data = req.body.data;
  console.log("/sparql", data);
  var SparqlHandler = require('./modules/sparql');
  rdfModule = new SparqlHandler(data.endpoint);
  // "/data/" Fuseki spezific

  var query = "Select ?a ?b FROM <" + data.namedGraph + "> WHERE {?a ?b " + data.nodeDomain + "} LIMIT 10";
  rdfModule.executeQuery(query).then(bindings => getResult(bindings));

  function getResult(result) {
    res.send(result['bindings']);
    console.dir(result['bindings'])
  };
  //res.send("Ausgeführt. Ich habe...");

});


app.post('/getMetaModelEntries', function (req, res) {

  var data = req.body.data;
  console.log(data);
  var SparqlHandler = require('./modules/sparql');
  rdfModule = new SparqlHandler(data.endpoint);
  // "/data/" Fuseki spezific

  var query = "Select ?endpoint ?namedGraph FROM <" + data.namedGraph + "> WHERE { ?b tgg:hasDomain ?a. \
                      ?a tgg:name '" + data.metaModel + "'. \
                      ?a tgg:hasDatasource ?c. \
                      ?c tgg:endpoint ?endpoint. \
                      ?c tgg:namedGraph ?namedGraph \
                    }";
  rdfModule.executeQuery(query).then(bindings => getDomainInfos(bindings));

  function getDomainInfos(result) {

    var SparqlHandler1 = require('./modules/sparql');
    domainSPARQL = new SparqlHandler1(result['bindings'][0]['endpoint']['value']);
    var query = "Select ?a ?b FROM <" + result['bindings'][0]['namedGraph']['value'] + "> WHERE {?a ?b " + data.nodeDomain + "} LIMIT 10";
    domainSPARQL.executeQuery(query).then(bindings => getResult(bindings));

  };

  function getResult(result) {
    res.send(result['bindings']);
    console.dir(result['bindings'])
  };

});

/*
 * Get all information about the RuleStore
 */
app.post('/getRuleStore', function (req, res) {

  var data = req.body.data;
  var SparqlHandler = require('./modules/sparql');
  rdfModule = new SparqlHandler(data.endpoint);
  var query = "Select ?domainName FROM <" + data.namedGraph + "> WHERE {?RuleStore tgg:hasDomain ?Domain. ?Domain tgg:name ?domainName}";
  rdfModule.executeQuery(query).then(bindings => getResult(bindings));

  function getResult(result) {
    res.send(result['bindings']);
    console.dir(result['bindings'])
  };
});


app.get('/*', function (req, res) {
  res.status(404).send("Error - Can't find File.");
});

app.listen(8080);
console.log("Application listening on http://localhost:8080");
