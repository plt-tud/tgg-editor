import {Component, OnInit} from "@angular/core";
import * as $ from "../../../node_modules/jquery/dist/jquery";
import {Connection, ContextNode, CorrespondenceNode, Domain, ProduceNode} from "../shapes";
const _ = require("../../../node_modules/lodash");
const joint = require('../../../node_modules/jointjs/dist/joint');

@Component({
  selector: 'app-rule-area',
  templateUrl: './rule-area.component.html',
  styleUrls: ['./rule-area.component.scss']
})
export class RuleAreaComponent implements OnInit {


  constructor() {
  }

  ngOnInit() {

    var graph = new joint.dia.Graph();
    var paper = new joint.dia.Paper({
      el: $('#paperArea'),
      height: 600,
      width: $('#paperArea').width(),
      model: graph,
      gridSize: 15,
      drawGrid: true
    });


    var posX = 0;
    var posY = 0;
    var firstClickX = 0;
    var firstClickY = 0;
    var width = 0;
    var height = 0;
    var selectedCellView = null;
    var selectedCell = null;

    function setPos(event) {
      let newHeight = (event.pageY - firstClickY);
      let newWidth = (event.pageX - firstClickX);
      newHeight = (newHeight - (newHeight % 15)) / 15;
      newHeight = height + newHeight * 15;

      newWidth = (newWidth - (newWidth % 15)) / 15;
      newWidth = width + newWidth * 15;

      selectedCell.resize(newWidth, newHeight);
      $(".editNode").height(newHeight + 40);
      $(".editNode").width(newWidth + 40);
      selectedCell.set('position', {
        x: posX,
        y: posY
      });
    }

    paper.on('cell:pointerdown', function (cellView, evt, x, y) {
      selectCell(cellView);
      var cell = cellView.model;
      if (cellView.model.get('type').startsWith('tgg.node')) {

        if (cell.get('parent')) {
          graph.getCell(cell.get('parent')).unembed(cell);
        }

        if ($(".editNode").attr('model-id') != cell.get('id')) {
          $(".editNode").remove();
          showEditBox();
          cell.on('change:position', function () {
            $(".editNode").css('margin', (cellView.model.get('position').y - 20) + 'px 0 0 ' + (cellView.model.get('position').x - 20) + 'px');
            paper.fitToContent({
              minWidth: $('#paperArea').width() - 15,
              minHeight: $('#paperArea').height() - 15
            });
          });

          $(document).ready(function () {
            $(".deleteBtn").click(function () {
              cellView.remove();
              $(".editNode").remove();
            });

            $(".resizeBtn").on('mousedown', function (event) {
              if (event.type == 'mousedown') {
                firstClickX = event.pageX;
                firstClickY = event.pageY;
                posX = cellView.model.position().x;
                posY = cellView.model.position().y;
                width = cellView.model.size().width;
                height = cellView.model.size().height;

                /* Mousemove-Event wieder entfernen */
                $(window).mousemove(setPos);
                $("#paperArea").on('mouseup', function (event) {
                  $(window).unbind('mousemove', setPos);
                });
              }
            });

            $(".addLinkBtn").click(function () {
              $(".editNode").append("<div class='btnMenu'></div>");
              $(".btnMenu").append("<ul id='btnMenuList'>");
              switch (cellView.model.get('nodeType')) {
                case "contextNode":
                case "produceNode":
                  $("#btnMenuList").append("<li id='newCorrLink'>Correspondence Link</li>");
                default:
                  $("#btnMenuList").append("<li id='newRelatLink'>Relation Link</li>");
                  break;
              }

              /* Füge eine Correspondence hinzu */
              $("#newCorrLink").click(function () {
                // Von welchem Typ ist der Anfangsknoten?
                var nodeType = cell.get('nodeType');

                let newCorrNode = new CorrespondenceNode({
                  attrs: {
                    '.scalable': {
                      class: `scalable node ${nodeType}`
                    }
                  },
                  nodeType: nodeType
                });
                newCorrNode.attr('text/text', cellView.model.get('attrs').text.text + 'TO');
                newCorrNode.set('position', {
                  x: cellView.model.position().x,
                  y: cellView.model.position().y
                });


                var link = new Connection({
                  source: {
                    id: newCorrNode.id
                  },
                  target: {
                    id: cellView.model.get('id')
                  },
                  attrs: {
                    '.connection': {
                      class: `connection ${nodeType}`
                    }
                  },
                });

                graph.addCells([newCorrNode, link]);

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
                  .addTo(paper.model)
                  .findView(paper);

                link.findView(paper)
                // initiate the linkView arrowhead movement
                linkView.startArrowheadMove('target');

                $(document).on({
                  'mousemove.example': onDrag,
                  'mouseup.example': onDragEnd
                }, {
                  // shared data between listeners
                  view: linkView,
                  paper: paper
                });

                function onDrag(evt) {
                  // transform client to paper coordinates
                  var p = evt.data.paper.snapToGrid({
                    x: evt.clientX,
                    y: evt.clientY
                  });

                  newCorrNode.set('position', {
                    x: p.x / 2 + (cellView.model.position().x / 2 - 25),
                    y: p.y / 2 + (cellView.model.position().y / 2)
                  });

                  // manually execute the linkView mousemove handler
                  evt.data.view.pointermove(evt, p.x, p.y);
                }

                function onDragEnd(evt) {
                  // manually execute the linkView mouseup handler
                  evt.data.view.pointerup(evt);
                  $(document).off('.example');
                  var targetElem;
                  graph.getElements().forEach(function (element) {
                    if (element.id == evt.data.view.model.get('target').id) {
                      targetElem = element;
                    }
                  });
                  newCorrNode.attr('text/text', newCorrNode.get('attrs').text.text + targetElem.get('attrs').text.text);
                }

                $(".btnMenu").remove();
              });


              $("#newRelatLink").click(function () {

                // Von welchem Typ ist der Anfangsknoten?
                var nodeType = cell.get('nodeType');
                var linkView = new Connection({
                  'source': {
                    id: cellView.model.get('id')
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
                  .addTo(paper.model)
                  .findView(paper);

                link.findView(paper)
                // initiate the linkView arrowhead movement
                linkView.startArrowheadMove('target');

                $(document).on({
                  'mousemove.example': onDrag,
                  'mouseup.example': onDragEnd
                }, {
                  // shared data between listeners
                  view: linkView,
                  paper: paper
                });

                function onDrag(evt) {
                  // transform client to paper coordinates
                  var p = evt.data.paper.snapToGrid({
                    x: evt.clientX,
                    y: evt.clientY
                  });

                  //corrNode.set('position', { x: p.x/2 +(cellView.model.position().x/2-25), y: p.y/2 + (cellView.model.position().y/2) });

                  // manually execute the linkView mousemove handler
                  evt.data.view.pointermove(evt, p.x, p.y);
                }

                function onDragEnd(evt) {
                  // manually execute the linkView mouseup handler
                  evt.data.view.pointerup(evt);
                  $(document).off('.example');
                }

                $(".btnMenu").remove();
              });
            });
          });
        }
      }
    });

// See for nested graphs: http://resources.jointjs.com/tutorial/hierarchy
    paper.on('cell:pointerup', function (cellView, evt, x, y) {

      var cell = cellView.model;
      var cellViewsBelow = paper.findViewsFromPoint(cellView.getBBox().center());

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
        updateToolbox();
      }
    });

    paper.on('blank:pointerdown', function (evt, x, y) {
      selectCell(null);
      $(".editNode").remove();
    });

    function showEditBox() {
      var size = selectedCell.get('size');
      var position = selectedCell.get('position');
      $("#paperArea").append(`
    <div class='editNode' model-id="${selectedCell.get('id')}"
          style="position: absolute;
                margin: ${position.y - 20}px 0 0 ${position.x - 20}px;
                height: ${size.height + 40}px;
                width:  ${size.width + 40}px">
      <button class='deleteBtn'></button>
      <button class='resizeBtn'></button>
      <button class='addLinkBtn'></button>
    </div>
  `);
    }

    function selectCell(cellView) {
      if (selectedCellView) {
        selectedCellView.unhighlight();
      }
      console.log(cellView);
      if (cellView) {
        selectedCellView = cellView;
        selectedCell = cellView.model;
        selectedCellView.highlight();
      }
      else {
        selectedCellView = null;
        selectedCell = null;
      }
      updateToolbox();
    }

    function updateToolbox() {
      if (selectedCell) {
        $('#nodeName').val(selectedCell.get('attrs').text.text);
        $('#nodeType').val(selectedCell.get('nodeType', "none"));
        $('#domain').val(selectedCell.get('domain', "none"));
      }
      else {
        $('#nodeName').val("");
        $('#nodeType').val("");
        $('#domain').val("");
      }
    }

    function initToolboxBehaviour() {
      $("#nodeName").keyup(function () {
        selectedCell.attr('text/text', $("#nodeName").val());
      });

      $("#nodeType").change(function () {
        var newClass = $("#nodeType").val();
        selectedCell.set('nodeType', newClass);
        selectedCell.attr('.node', {class: `scalable node ${newClass}`});
      });
    }

    initToolboxBehaviour();


    /* Example Graph */

    var domain_source = new Domain({
      position: {x: 0, y: 0},
      attrs: {rect: {fill: '#E74C3C'}, text: {text: 'Source'}},
      domain: "source"
    }).addTo(graph);
    var domain_correspondence = new Domain({
      position: {x: 500, y: 0},
      size: {width: 400},
      attrs: {rect: {fill: '#F1C40F'}, text: {text: 'Correspondence'}},
      domain: "correspondence"
    }).addTo(graph);
    var domain_target = new Domain({
      position: {x: 900, y: 0},
      attrs: {rect: {fill: '#41C43F'}, text: {text: 'Target'}},
      domain: "target"
    }).addTo(graph);


    var rect2 = new ContextNode({
      position: {x: 50, y: 50},
      attrs: {text: {text: "?device"}},
      domain: "source"
    }).addTo(graph);
    var rect3 = new ContextNode({
      position: {x: 300, y: 50},
      attrs: {text: {text: "mso:Pump"}},
      domain: "source"
    }).addTo(graph);
    var rect4 = new ProduceNode({
      position: {x: 50, y: 150},
      attrs: {text: {text: "?fitting"}},
      domain: "source"
    }).addTo(graph);
    var rect5 = new ProduceNode({
      position: {x: 300, y: 150},
      attrs: {text: {text: "mso:Fitting"}},
      domain: "source"
    }).addTo(graph);


    var link = new Connection({
      source: {id: rect2.id},
      target: {id: rect4.id},
      attrs: {
        '.connection': {
          class: 'connection produceNode'
        }
      }
    })
      .label2('mso:hasFitting').addTo(graph);

    var link2 = new Connection({
      source: {id: rect2.id},
      target: {id: rect3.id},
      attrs: {
        '.connection': {
          class: 'connection contextNode'
        }
      }
    }).label2('rdf:type').addTo(graph);

    var link3 = new Connection({
      source: {id: rect4.id},
      target: {id: rect5.id},
      attrs: {
        '.connection': {
          class: 'connection produceNode'
        }
      }
    }).label2('rdf:type').addTo(graph);

    domain_source.embed(rect2).embed(rect3).embed(rect4).embed(rect5);


  }
}
