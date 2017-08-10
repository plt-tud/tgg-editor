/* Example Graph */

var domain_source = new Domain({
    position: { x: 0, y: 0 },
    attrs: { rect: { fill: '#E74C3C' }, text: { text: 'Source'} },
    domain: "source"
  }).addTo(graph);
var domain_correspondence = new Domain({
    position: { x: 500, y: 0 },
    size: { width: 400 },
    attrs: { rect: { fill: '#F1C40F'}, text: { text: 'Correspondence'} },
    domain: "correspondence"
  }).addTo(graph);
var domain_target = new Domain({
    position: { x: 900, y: 0 },
    attrs: { rect: { fill: '#41C43F'}, text: { text: 'Target' } },
    domain: "target"
  }).addTo(graph);



var rect2 = new ContextNode({
  position: {x: 50, y: 50},
  attrs: { text: {text: "?device"} },
  domain: "source"
}).addTo(graph);
var rect3 = new ContextNode({
  position: {x: 300, y: 50},
  attrs: { text: {text: "mso:Pump"} },
  domain: "source"
}).addTo(graph);
var rect4 = new ProduceNode({
  position: {x: 50, y: 150},
  attrs: { text: {text: "?fitting"} },
  domain: "source"
}).addTo(graph);
var rect5 = new ProduceNode({
  position: {x: 300, y: 150},
  attrs: { text: {text: "mso:Fitting"} },
  domain: "source"
}).addTo(graph);



var link = new Connection({
    source: { id: rect2.id },
    target: { id: rect4.id },
    attrs: {
    '.connection': {
        class: 'connection produceNode'}
      }
})
.label2('mso:hasFitting').addTo(graph);

var link2 = new Connection({
    source: { id: rect2.id },
    target: { id: rect3.id },
    attrs: {
      '.connection': {
          class: 'connection contextNode'
      }
    }
}).label2('rdf:type').addTo(graph);

var link3 = new Connection({
    source: { id: rect4.id },
    target: { id: rect5.id },
    attrs: {
      '.connection': {
          class: 'connection produceNode'
      }
    }
}).label2('rdf:type').addTo(graph);

domain_source.embed(rect2).embed(rect3).embed(rect4).embed(rect5);
