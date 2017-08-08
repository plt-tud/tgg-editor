var Node = joint.shapes.basic.Rect.define('tgg.node.BasicNode', {
  markup: '<g class="scalable node"><rect/></g><text/>',
  size: { width: 115, height: 30 },
  domain: null
});

var ProduceNode = Node.define('tgg.node.ProduceNode', {
  markup: '<g class="scalable node produceNode"><rect/></g><text/>',
  nodeType: 'produceNode'
});

var ContextNode = Node.define('tgg.node.ContextNode', {
    markup: '<g class="scalable node contextNode"><rect/></g><text/>',
    nodeType: 'contextNode'
});

var NacNode = Node.define('tgg.node.NacNode', {
    markup: '<g class="scalable node nacNode"><rect/></g><text/>',
    nodeType: 'nacNode'
});

var ConstraintNode = Node.define('tgg.node.ConstraintNode', {
    markup: '<g class="scalable node constraintNode"><rect/></g><text/>',
    nodeType: 'constraintNode'
});
