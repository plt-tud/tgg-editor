/* Example Graph */

var domain_source = new Domain({
    position: { x: 0, y: 0 },
    attrs: { rect: { fill: '#E74C3C' }, text: { text: 'Source'} },
    domain: "source",
  }).addTo(graph);
var domain_correspondence = new Domain({
    position: { x: 500, y: 0 },
    size: { width: 400 },
    attrs: { rect: { fill: '#F1C40F'}, text: { text: 'Correspondence'} },
    domain: "correspondence",
  }).addTo(graph);
var domain_target = new Domain({
    position: { x: 900, y: 0 },
    attrs: { rect: { fill: '#41C43F'}, text: { text: 'Target' } },
    domain: "target"
  }).addTo(graph);



var rect2 = new ContextNode({
  position: {x: 100, y: 50},
  attrs: { text: {text: "cm:Subplant"} },
  domain: "source",
  nodeDomain: "cm:Subplant"
}).addTo(graph);
var rect3 = new ContextNode({
  position: {x: 300, y: 50},
  attrs: { text: {text: "cm:Device"} },
  domain: "source",
  nodeDomain: "cm:Device"
}).addTo(graph);
var rect4 = new ProduceNode({
  position: {x: 100, y: 150},
  attrs: { text: {text: "?fitting"} },
  domain: "source",
  nodeDomain: "?fitting"
}).addTo(graph);
var rect5 = new ProduceNode({
  position: {x: 300, y: 150},
  attrs: { text: {text: "cm:Pump"} },
  domain: "source",
  nodeDomain: "cm:Pump"
}).addTo(graph);



var link = new joint.dia.Link({
    source: { id: rect3.id },
    target: { id: rect2.id },
    attrs: { '.test': 2,
    '.connection': {
          'stroke-width': 1.5, stroke: '#000000'}
      },
      class: "test"
}).addTo(graph);
link.label(0, {
  position: .5,
  attrs: {
      rect: { fill: "grey", opacity: 0.5 },
      text: { fill: 'blue', text: 'Label' }
  }
});
var link2 = new joint.dia.Link({
    source: { id: rect5.id },
    target: { id: rect3.id },
    attrs: { '.connection': {
          'stroke-width': 1.5, stroke: '#00b500'}
      },
}).addTo(graph);

var link3 = new joint.dia.Link({
    source: { id: rect4.id },
    target: { id: rect3.id },
    attrs: { '.connection': {
          'stroke-width': 1.5, stroke: '#00b500'}
      },
}).addTo(graph);


domain_source.embed(rect2).embed(rect3).embed(rect4).embed(rect5);
