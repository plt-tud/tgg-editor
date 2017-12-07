#!/bin/bash

DS_URI=http://localhost:3030/transformation
GRAPH_TGG=http://eatld.et.tu-dresden.de/tgg

export FUSEKI_HOME=./tools/apache-jena-fuseki/

#######################################
## FUSEKI Functions                  ##
#######################################

function fput {
    $FUSEKI_HOME/bin/s-put $1 $2 $3
}
function fget {
    $FUSEKI_HOME/bin/s-get $1 $2
}
function fupdate {
    DS_URI=$1
    QUERY=$2
    $FUSEKI_HOME/bin/s-update --service=$DS_URI/update "$QUERY"
}
function fgupdate {
    DS_URI=$1
    GRAPH=$2
    QUERY=$3
    fupdate $DS_URI "`cat ./tools/prefixes.rq` WITH <$GRAPH> $QUERY"
}


function main {
    GRAPH=$1

    #fput $DS_URI $GRAPH $SPARQL_QUERY.ttl
    fupdate $DS_URI "CREATE SILENT GRAPH <$GRAPH>"
		query="`cat ./tools/prefixes.rq` INSERT DATA { GRAPH <$GRAPH> {
                        <$GRAPH/RuleStore> a tgg:RuleStore;
                        	tgg:prefix  \"tgg:http://eatld.et.tu-dresden.de/tgg\";
													tgg:hasRuleset <$GRAPH/Ruleset1>.
												<$GRAPH/Ruleset1> a tgg:RuleSet;
													tgg:author \"Wir\";
													tgg:created_at \"12:12 12.12.2012\";
													tgg:description \"Das ist ein Beispieldatenset\";
													tgg:name \"RuleSet1\";
													tgg:version \"12\";
													tgg:hasRule <$GRAPH/Rule1>.
												<$GRAPH/Rule1> a tgg:Rule;
													tgg:author \"Du\";
													tgg:name \"CAEPumpToHMIPump\".
												<$GRAPH/Ruleset1> tgg:hasRule <$GRAPH/Rule2>.
												<$GRAPH/Rule2> a tgg:Rule;
													tgg:author \"Er\";
													tgg:name \"CAETankToHMITank\".

												<$GRAPH/Ruleset1> tgg:hasTargetDomain <$GRAPH/DomainCAE>.
												<$GRAPH/DomainCAE> a tgg:Domain;
													tgg:name \"CAEX\";
													tgg:prefix \"CAEGraph\".

												<$GRAPH/Ruleset1> tgg:hasSourceDomain <$GRAPH/DomainHMI>.
												<$GRAPH/DomainHMI> a tgg:Domain;
													tgg:name \"HMI\";
													tgg:prefix \"HMIGraph\".

												<$GRAPH/DomainHMI> tgg:hasDatasource <$GRAPH/DomainHMI_DataSource>.
												<$GRAPH/DomainHMI_DataSource> a tgg:DataSource;
													tgg:endpoint <http://localhost:3030/transformation>;
													tgg:name \"HMI\";
													tgg:namedGraph <http://eatld.et.tu-dresden.de/hmiGraph>.

												<$GRAPH/DomainCAE> tgg:hasDatasource <$GRAPH/DomainCAE_DataSource>.
												<$GRAPH/DomainCAE_DataSource> a tgg:DataSource;
													tgg:endpoint <http://localhost:3030/transformation>;
													tgg:name \"CAE\";
													tgg:namedGraph <http://eatld.et.tu-dresden.de/caeGraph>.

												<$GRAPH/RuleStore> tgg:hasDomain <$GRAPH/DomainCAE>.
												<$GRAPH/RuleStore> tgg:hasDomain <$GRAPH/DomainHMI>.

                    }}"
		#echo $query
    fupdate $DS_URI "$query"
}

function target {
    GRAPH=$1

    #fput $DS_URI $GRAPH $SPARQL_QUERY.ttl
    fupdate $DS_URI "CREATE GRAPH <$GRAPH>"
    fupdate $DS_URI "`cat ./tools/prefixes.rq` INSERT DATA { GRAPH <$GRAPH> {
		cm:Plant a rdfs:Class;
    rdfs:label \"class\".

cm:Subplant a rdfs:Class;
    rdfs:label \"subclass\".

cm:Device a rdfs:Class;
    rdfs:label \"device\".

cm:Pump a rdfs:Class;
    rdfs:subClassOf cm:Device;
    rdfs:label \"pump\".

cm:Vessel a rdfs:Class;
    rdfs:subClassOf cm:Device;
    rdfs:label \"vessel\".

cm:Valve a rdfs:Class;
    rdfs:subClassOf cm:Device;
    rdfs:label \"valve\".

cm:Sensor a rdfs:Class;
    rdfs:label \"sensor\".

cm:isConnectedTo a owl:ObjectProperty;
    rdfs:label \"is connected to\";
    rdfs:domain cm:Device;
    rdfs:range cm:Device.

cm:hasSubPlant a owl:ObjectProperty;
    rdfs:label \"has subplant\";
    rdfs:domain cm:Plant;
    rdfs:range cm:Subplant.

cm:hasDevice a owl:ObjectProperty;
    rdfs:label \"has device\";
    rdfs:domain cm:Subplant;
    rdfs:range cm:Device.

cm:hasSensor a owl:ObjectProperty;
    rdfs:label \"has sensor\";
    rdfs:domain cm:Subplant;
    rdfs:range cm:Sensor.

                    }}"

}

function source {
 GRAPH=$1

    #fput $DS_URI $GRAPH $SPARQL_QUERY.ttl
    fupdate $DS_URI "CREATE GRAPH <$GRAPH>"
    fupdate $DS_URI "`cat ./tools/prefixes.rq` INSERT DATA { GRAPH <$GRAPH> {
			hm:Sketch a rdfs:Class;
		  rdfs:label \"sketch\".

			hm:Faceplate a rdfs:Class;
		  rdfs:label \"face plate\".


			hm:hasFaceplate a owl:ObjectProperty;
		  rdfs:label \"has faceplate\";
		  rdfs:domain hm:Sketch;
		  rdfs:range  hm:Faceplate.

		}}"

}

target "caeGraph"
source "hmiGraph"
main "tggGraph"


#######################################
## Debugging Functions        			 ##
#######################################

function saveGraphIntoPNG {
	FILENAME=$1
	GRAPH=$2
	fget $DS_URI $GRAPH > ./tools/Debug/$FILENAME.ttl
	#./tools/rdf-uml-diagram/rdfUmlDiagram.py --show-classes --hide-instances ./tools/Debug/$FILENAME.ttl
	./tools/rdf-uml-diagram/rdfUmlDiagram.py ./tools/Debug/$FILENAME.ttl --show-classes -o ./tools/Debug/$FILENAME.png #--hide-instances
}

#DEBUG
#saveGraphIntoPNG "tggGraph" "http://eatld.et.tu-dresden.de/tggGraph"
#saveGraphIntoPNG "caeGraph" "http://eatld.et.tu-dresden.de/caeGraph"
#saveGraphIntoPNG "hmiGraph" "http://eatld.et.tu-dresden.de/hmiGraph"


# Get file path
#echo ${0}
#ScriptPath=$(dirname $(readlink -f ${0}))
#echo $ScriptPath
#cd $ScriptPath
#forever --watch ./app.js 

#npm start
