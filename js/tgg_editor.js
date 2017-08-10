var ConstraintElementView = joint.dia.ElementView.extend({
  events: {
    mouseover: function(evt, x, y) {
      //  '<button class="delete">x</button>',
      var size = this.model.get('size');
      var position = this.model.get('position');
      //console.log("Mouse over new element", this.model);
    }
  }
});

var graph = new joint.dia.Graph();
var paper = new joint.dia.Paper({
  el: $('#paper'),
  height: $('#paperArea').height(),
  width: $('#paperArea').width(),
  model: graph,
  gridSize: 15,
  drawGrid: true,
  elementView: ConstraintElementView
});


// Canvas from which you take shapes
var stencilGraph = new joint.dia.Graph();
var stencilPaper = new joint.dia.Paper({
  el: $('#stencil'),
  height: $('#stencilArea').height(),
  width: $('#stencilArea').width(),
  model: stencilGraph,
  interactive: false,
  background: {
    color: '#BDBDBD',
  },
  restrictTranslate: true
});


var produceNode = new ProduceNode({
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

var contextNode = new ContextNode({
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

var nacNode = new NacNode({
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

var constraintNode = new ConstraintNode({
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
stencilPaper.on('cell:pointerdown', function(cellView, e, x, y) {
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
  $('body').on('mousemove.fly', function(e) {
    $("#flyPaper").offset({
      left: e.pageX - offset.x,
      top: e.pageY - offset.y
    });
  });
  $('body').on('mouseup.fly', function(e) {
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

/*
// Here is the real deal. Listen on cell:pointerup and link to an element found below.
  paper.on('cell:pointerup', function(cellView, evt, x, y) {

      // Find the first element below that is not a link nor the dragged element itself.
      var elementBelow = graph.get('cells').find(function(cell) {
          if (cell instanceof joint.dia.Link) return false; // Not interested in links.
          if (cell.id === cellView.model.id) return false; // The same element as the dropped one.
          if (cell.getBBox().containsPoint(g.point(x, y))) {
              return true;
          }
          return false;
      });

      // If the two elements are connected already, don't
      // connect them again (this is application specific though).
      if (elementBelow && !_.contains(graph.getNeighbors(elementBelow), cellView.model)) {

          graph.addCell(new joint.dia.Link({
              source: { id: cellView.model.id }, target: { id: elementBelow.id },
              attrs: { '.marker-source': { d: 'M 10 0 L 0 5 L 10 10 z' } }
          }));
          // Move the element a bit to the side.
          cellView.model.translate(-200, 0);
      }

      cellView.model.attr('.textSecondRect/text', 'foo');

  });
*/

var posX = 0;
var posY = 0;
var firstClickX = 0;
var firstClickY = 0;
var width = 0;
var height = 0;
var selectedCellView = null;
var selectedCell = null;

function setPos(event) {
  newHeight = (event.pageY - firstClickY);
  newWidth = (event.pageX - firstClickX);
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

paper.on('cell:pointerdown', function(cellView, evt, x, y) {
  selectCell(cellView);
  var cell = cellView.model;
  if (cellView.model.get('type').startsWith('tgg.node')) {

    if (cell.get('parent')) {
      graph.getCell(cell.get('parent')).unembed(cell);
    }

    if ($(".editNode").attr('model-id') != cell.get('id')) {
      $(".editNode").remove();
      showEditBox();
      cell.on('change:position', function() {
        $(".editNode").css('margin', (cellView.model.get('position').y - 20) + 'px 0 0 ' + (cellView.model.get('position').x - 20) + 'px');
        paper.fitToContent({
          minWidth: $('#paperArea').width() - 15,
          minHeight: $('#paperArea').height() - 15
        });
      });

      $(document).ready(function() {
        $(".deleteBtn").click(function() {
          cellView.remove();
          $(".editNode").remove();
        });

        $(".resizeBtn").on('mousedown', function(event) {
          if (event.type == 'mousedown') {
            firstClickX = event.pageX;
            firstClickY = event.pageY;
            posX = cellView.model.position().x;
            posY = cellView.model.position().y;
            width = cellView.model.size().width;
            height = cellView.model.size().height;

            /* Mousemove-Event wieder entfernen */
            $(window).mousemove(setPos);
            $("#paper").on('mouseup', function(event) {
              $(window).unbind('mousemove', setPos);
            });
          }
        });

        $(".addLinkBtn").click(function() {
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
          $("#newCorrLink").click(function() {
            // Von welchem Typ ist der Anfangsknoten?
            var nodeType = cell.get('nodeType');

            newCorrNode = new CorrespondenceNode({
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
              graph.getElements().forEach(function(element) {
                if (element.id == evt.data.view.model.get('target').id) {
                  targetElem = element;
                }
              });
              newCorrNode.attr('text/text', newCorrNode.get('attrs').text.text + targetElem.get('attrs').text.text);
            }
            $(".btnMenu").remove();
          });


          $("#newRelatLink").click(function() {

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
paper.on('cell:pointerup', function(cellView, evt, x, y) {

  var cell = cellView.model;
  var cellViewsBelow = paper.findViewsFromPoint(cellView.getBBox().center());

  if (cellViewsBelow.length) {
    // Note that the findViewsFromPoint() returns the view for the `cell` itself.
    var cellViewBelow = _.find(cellViewsBelow, function(c) {
      return c.model.id !== cell.id
    });

    // Prevent recursive embedding.
    if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
      cellViewBelow.model.embed(cell);
      cell.set("domain", cellViewBelow.model.get('domain'));
    }
    updateToolbox(cellView);
  }
});

paper.on('blank:pointerdown', function(evt, x, y) {
  selectCell(null);
  $(".editNode").remove();
});

function showEditBox() {
  var size = selectedCell.get('size');
  var position = selectedCell.get('position');
  $("#paper").append(`
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
  $("#nodeName").keyup(function() {
    selectedCell.attr('text/text', $("#nodeName").val());
  });

  $("#nodeType").change(function() {
    var newClass = $("#nodeType").val();
    selectedCell.set('nodeType', newClass);
    selectedCell.attr('.node', {class: `scalable node ${newClass}`});
  });
}

initToolboxBehaviour();
