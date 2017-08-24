import {Component, OnInit} from "@angular/core";
import {Connection, ConstraintNode, ContextNode, CorrespondenceNode, Domain, NacNode, ProduceNode} from "../shapes";
import * as $ from "../../../node_modules/jquery/dist/jquery";
const _ = require("../../../node_modules/lodash");
const joint = require('../../../node_modules/jointjs/dist/joint');

@Component({
  selector: 'app-rule-area',
  templateUrl: './rule-area.component.html',
  styleUrls: ['./rule-area.component.scss']
})
export class RuleAreaComponent implements OnInit {

  graph = null;
  paper = null;

  private domain_source;
  private domain_correspondence;
  private domain_target;

  selectedCellView = null;
  selectedCell = null;

  constructor() {
  }

  ngOnInit() {
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: $('#paperArea'),
      height: 600,
      width: $('#paperArea').width(),
      model: this.graph,
      gridSize: 15,
      drawGrid: true
    });

    this.create_stencil_area();
    this.create_domains();
    this.create_example_graph();
    this.initGraphBehaviour();
  }

  initGraphBehaviour() {
    // this is hidden in paper.on -> use that instead of
    let that = this;

    this.paper.on('cell:pointerdown', function (cellView, evt, x, y) {
      that.selectCell(cellView);
      let cell = cellView.model;
      if (cellView.model.get('type').startsWith('tgg.node')) {
        if (cell.get('parent')) {
          that.graph.getCell(cell.get('parent')).unembed(cell);
        }
      }
    });

    // See for nested graphs: http://resources.jointjs.com/tutorial/hierarchy
    this.paper.on('cell:pointerup', function (cellView, evt, x, y) {

      var cell = cellView.model;
      var cellViewsBelow = that.paper.findViewsFromPoint(cellView.getBBox().center());

      if (cellViewsBelow.length) {
        // Note that the findViewsFromPoint() returns the view for the `cell` itself.
        var cellViewBelow = _.find(cellViewsBelow, function (c) {
          return c.model.id !== cell.id
        });

        // Prevent recursive embedding.
        if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
          cellViewBelow.model.embed(cell);
          cell.set("domain", cellViewBelow.model.get('domain'));
        }
      }
    });

    this.paper.on('blank:pointerdown', function (evt, x, y) {
      that.selectCell(null);
    });

  }


  private deleteCell() {
    this.selectedCellView.remove();
    this.selectedCellView = null;
    this.selectedCell = null;
  }

  private addRelationLink(event) {
    console.log(event);
    let x = event.x;
    let y = event.y;
    // Von welchem Typ ist der Anfangsknoten?
    let nodeType = this.selectedCell.get('nodeType');
    let linkView = new Connection({
      'source': {
        id: this.selectedCellView.model.get('id')
      },
      'target': {
        x: x,
        y: y
      },
      'attrs': {
        '.connection': {
          class: `connection ${nodeType}`
        }
      },
    })
      .addTo(this.paper.model)
      .findView(this.paper);


    // initiate the linkView arrowhead movement
    linkView.startArrowheadMove('target');

    $(document).on({
      'mousemove.example': onDrag,
      'mouseup.example': onDragEnd
    }, {
      // shared data between listeners
      view: linkView,
      paper: this.paper
    });

    function onDrag(evt) {
      // transform client to paper coordinates
      var p = evt.data.paper.snapToGrid({
        x: evt.clientX,
        y: evt.clientY
      });

      // manually execute the linkView mousemove handler
      evt.data.view.pointermove(evt, p.x, p.y);
    }

    function onDragEnd(evt) {
      // manually execute the linkView mouseup handler
      evt.data.view.pointerup(evt);
      $(document).off('.example');
    }
  }

  private addCorrespondenceLink(event) {
    /* Füge eine Correspondence hinzu */
    // Von welchem Typ ist der Anfangsknoten?
    let nodeType = this.selectedCell.get('nodeType');

    let that = this;

    let x = event.clientX;
    let y = event.clientY;

    let newCorrNode = new CorrespondenceNode({
      attrs: {
        '.scalable': {
          class: `scalable node ${nodeType}`
        }
      },
      nodeType: nodeType
    });
    newCorrNode.attr('text/text', this.selectedCellView.model.get('attrs').text.text + 'TO');
    console.log("model", this.selectedCellView.model)
    newCorrNode.set('position', {
      x: (this.selectedCellView.model.position().x + x) / 2,
      y: (this.selectedCellView.model.position().y + y) / 2
    });


    var link = new Connection({
      source: {
        id: newCorrNode.id
      },
      target: {
        id: this.selectedCellView.model.get('id')
      },
      attrs: {
        '.connection': {
          class: `connection ${nodeType}`
        }
      },
    });


    this.graph.addCells([newCorrNode, link]);

    var linkView = new Connection({
      'source': {
        id: newCorrNode.id
      },
      'target': {
        x: x,
        y: y
      },
      'attrs': {
        '.connection': {
          class: `connection ${nodeType}`
        }
      },
    })
      .addTo(this.paper.model)
      .findView(this.paper);

    // initiate the linkView arrowhead movement
    linkView.startArrowheadMove('target');

    $(document).on({
      'mousemove.example': onDrag,
      'mouseup.example': onDragEnd
    }, {
      // shared data between listeners
      view: linkView,
      paper: this.paper
    });

    function onDrag(evt) {
      // transform client to paper coordinates
      var p = evt.data.paper.snapToGrid({
        x: evt.clientX,
        y: evt.clientY
      });

      newCorrNode.set('position', {
        x: p.x / 2 + (that.selectedCellView.model.position().x / 2 - 25),
        y: p.y / 2 + (that.selectedCellView.model.position().y / 2)
      });

      // manually execute the linkView mousemove handler
      evt.data.view.pointermove(evt, p.x, p.y);
    }

    function onDragEnd(evt) {
      // manually execute the linkView mouseup handler
      evt.data.view.pointerup(evt);
      $(document).off('.example');
      var targetElem;
      this.graph.getElements().forEach(function (element) {
        if (element.id == evt.data.view.model.get('target').id) {
          targetElem = element;
        }
      });
      newCorrNode.attr('text/text', newCorrNode.get('attrs').text.text + targetElem.get('attrs').text.text);
    }
  }

  private selectCell(cellView) {
    if (this.selectedCellView) {
      this.selectedCellView.unhighlight();
    }
    console.log(cellView);
    if (cellView) {
      this.selectedCellView = cellView;
      this.selectedCell = cellView.model;
      this.selectedCellView.highlight();
    }
    else {
      this.selectedCellView = null;
      this.selectedCell = null;
    }
  }

  create_stencil_area() {

    let paper = this.paper;
    let graph = this.graph;

    const stencilGraph = new joint.dia.Graph();
    const stencilPaper = new joint.dia.Paper({
      el: $('#stencilArea'),
      height: 85,
      width: $('#stencilArea').width(),
      model: stencilGraph,
      interactive: false,
      background: {
        color: '#BDBDBD',
      },
      restrictTranslate: true
    });


    const produceNode = new ProduceNode({
      position: {
        x: 10,
        y: 30
      },
      attrs: {
        text: {
          text: "Produce Node"
        }
      }
    });

    const contextNode = new ContextNode({
      position: {
        x: 140,
        y: 30
      },
      attrs: {
        text: {
          text: 'Context Node'
        }
      }
    });

    const nacNode = new NacNode({
      position: {
        x: 270,
        y: 30
      },
      attrs: {
        text: {
          text: 'NAC Node'
        }
      }
    });

    const constraintNode = new ConstraintNode({
      position: {
        x: 400,
        y: 30
      },
      attrs: {
        text: {
          text: 'Constraint Node'
        }
      }
    });

    stencilGraph.addCells([produceNode, contextNode, constraintNode, nacNode]);

    /* Event Handling */
    stencilPaper.on('cell:pointerdown', function (cellView, e, x, y) {
      $('body').append('<div id="flyPaper" style="background-color: transparent;opacity:0.7;pointer-event:none;"></div>');

      var flyGraph = new joint.dia.Graph,
        flyPaper = new joint.dia.Paper({
          el: $('#flyPaper'),
          model: flyGraph,
          interactive: false
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
          x: x - pos.x,
          y: y - pos.y
        };

      flyShape.position(0, 0);
      flyGraph.addCell(flyShape);
      $("#flyPaper").offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y,
      });
      $('body').on('mousemove.fly', function (e) {
        $("#flyPaper").offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        });
      });
      $('body').on('mouseup.fly', function (e) {
        var x = e.pageX,
          y = e.pageY,
          target = paper.$el.offset();

        // Dropped over paper ?
        if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
          var s = flyShape.clone();
          s.position(x - target.left - offset.x, y - target.top - offset.y);
          graph.addCell(s);
        }
        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
      });
    });

  }

  create_domains() {
    this.domain_source = new Domain({
      position: {x: 0, y: 0},
      attrs: {rect: {fill: '#E74C3C'}, text: {text: 'Source'}},
      domain: "source"
    }).addTo(this.graph);
    this.domain_correspondence = new Domain({
      position: {x: 500, y: 0},
      size: {width: 400},
      attrs: {rect: {fill: '#F1C40F'}, text: {text: 'Correspondence'}},
      domain: "correspondence"
    }).addTo(this.graph);
    this.domain_target = new Domain({
      position: {x: 900, y: 0},
      attrs: {rect: {fill: '#41C43F'}, text: {text: 'Target'}},
      domain: "target"
    }).addTo(this.graph);
  }

  create_example_graph() {
    /* Example Graph */
    let rect2 = new ContextNode({
      position: {x: 50, y: 50},
      attrs: {text: {text: "?device"}},
      domain: "source"
    }).addTo(this.graph);
    let rect3 = new ContextNode({
      position: {x: 300, y: 50},
      attrs: {text: {text: "mso:Pump"}},
      domain: "source"
    }).addTo(this.graph);
    let rect4 = new ProduceNode({
      position: {x: 50, y: 150},
      attrs: {text: {text: "?fitting"}},
      domain: "source"
    }).addTo(this.graph);
    let rect5 = new ProduceNode({
      position: {x: 300, y: 150},
      attrs: {text: {text: "mso:Fitting"}},
      domain: "source"
    }).addTo(this.graph);


    let link = new Connection({
      source: {id: rect2.id},
      target: {id: rect4.id},
      attrs: {
        '.connection': {
          class: 'connection produceNode'
        }
      }
    })
      .label2('mso:hasFitting').addTo(this.graph);

    let link2 = new Connection({
      source: {id: rect2.id},
      target: {id: rect3.id},
      attrs: {
        '.connection': {
          class: 'connection contextNode'
        }
      }
    }).label2('rdf:type').addTo(this.graph);

    let link3 = new Connection({
      source: {id: rect4.id},
      target: {id: rect5.id},
      attrs: {
        '.connection': {
          class: 'connection produceNode'
        }
      }
    }).label2('rdf:type').addTo(this.graph);

    this.domain_source.embed(rect2).embed(rect3).embed(rect4).embed(rect5);
  }
}
