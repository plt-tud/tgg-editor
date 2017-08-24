#!/bin/bash
  

DS_URI=http://localhost:3030/transformation
GRAPH_TGG=http://tgg.plt.tu-dresden.de


cd ./tools/apache-jena-fuseki/ 
# Delete old stuff
rm -R ./run

## Start Server
./fuseki-server --update --mem /transformation
