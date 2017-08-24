var Node = joint.shapes.basic.Rect.define('tgg.node.BasicNode', {
  markup: '<g class="scalable node"><rect/></g><text/>',
  size: {
    width: 115,
    height: 30
  },
  graphType: null
});

var ProduceNode = Node.define('tgg.node.ProduceNode', {
  markup: '<g class="scalable node produceNode"><rect/></g><text/>',
  nodeType: 'produceNode',
  nodeDomain: 'none',
  graphType: 'none'
});

var ContextNode = Node.define('tgg.node.ContextNode', {
  markup: '<g class="scalable node contextNode"><rect/></g><text/>',
  nodeType: 'contextNode',
  nodeDomain: 'none',
  graphType: 'none'
});

var NacNode = Node.define('tgg.node.NacNode', {
  markup: '<g class="scalable node nacNode"><rect/></g><text/>',
  nodeType: 'nacNode',
  nodeDomain: 'none',
  graphType: 'none'
});

var ConstraintNode = Node.define('tgg.node.ConstraintNode', {
  markup: '<g class="scalable node constraintNode"><rect/></g><text/>',
  nodeType: 'constraintNode'
});

var CorrespondenceNode = joint.shapes.basic.Path.define('tgg.node.CorrNode', {
  size: {
    width: 115,
    height: 50
  },
  attrs: {
    path: {
      d: 'M 0 50 L 0 50 50 100 250 100 300 50 250 0 50 0 z',
      fill: 'white',
      'stroke-width': '1.5',
      stroke: '#00b500',
      'fill-opacity': .5
    },
    text: {
      text: 'CorrNode',
      fill: 'black',
      transform: 'matrix(1,0,0,1,0,-40)'
    },
  },
  /* Weitere Attribute des Knotens*/
  nodeType: 'corrNode',
  graphType: 'none'
});

var Domain = joint.shapes.basic.Rect.define('tgg.domain', {
  markup: '<g class="scalable"><rect/></g><text/>',
  size: {
    width: 500,
    height: 500
  },
  attrs: {
    rect: {
      'fill-opacity': 0.2,
      style: {
        'pointer-events': 'none'
      }
    },
    text: {
      transform: 'matrix(1,0,0,1,0,-240)'
    }
  },
  graphType: null
});
