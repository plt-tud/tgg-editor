/* Example Graph */
var rect2 = new ContextNode({
  position: {x: 100, y: 50},
  attrs: { text: {text: "?device"} },
  domain: "source"
}).addTo(graph);
var rect3 = new ContextNode({
  position: {x: 300, y: 50},
  attrs: { text: {text: "mso:Pump"} },
  domain: "source"
}).addTo(graph);
var rect4 = new ProduceNode({
  position: {x: 100, y: 150},
  attrs: { text: {text: "?fitting"} },
  domain: "source"
}).addTo(graph);
var rect5 = new ProduceNode({
  position: {x: 300, y: 150},
  attrs: { text: {text: "mso:Fitting"} },
  domain: "source"
}).addTo(graph);

var link = new joint.dia.Link({
    source: { id: rect4.id },
    target: { id: rect2.id },
    attrs: { '.test': 2,
    '.connection': {
          'stroke-width': 1.5, stroke: '#00b500'}
      },
      class: "test"
}).addTo(graph);
link.label(0, {
  position: .5,
  attrs: {
      rect: { fill: 'white' },
      text: { fill: 'blue', text: 'my label' }
  }
});
var link2 = new joint.dia.Link({
    source: { id: rect2.id },
    target: { id: rect3.id },
    attrs: { '.connection': {
          'stroke-width': 1.5, stroke: '#00b500'}
      },
}).addTo(graph);
