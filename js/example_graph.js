/* Example Graph */

var r1 = new joint.shapes.basic.Rect({
    position: { x: 20, y: 20 },
    size: { width: 400, height: 400 },
    attrs: { rect: { fill: '#E74C3C' }, text: { text: 'Source' } },
    domain: "source"
  }).addTo(graph);
var r2 = new joint.shapes.basic.Rect({
    position: { x: 420, y: 20 },
    size: { width: 400, height: 400 },
    attrs: { rect: { fill: '#F1C40F' }, text: { text: 'Correspondence' } },
    domain: "correspondence"
  }).addTo(graph);
var r3 = new joint.shapes.basic.Rect({
    position: { x: 820, y: 20 },
    size: { width: 400, height: 400 },
    attrs: { rect: { fill: '#41C43F' }, text: { text: 'Target' } },
    domain: "target"
  }).addTo(graph);



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
      rect: { fill: "grey", opacity: 0.5 },
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


r1.embed(rect2).embed(rect3).embed(rect4).embed(rect5);
