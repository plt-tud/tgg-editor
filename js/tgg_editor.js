var ConstraintElementView = joint.dia.ElementView.extend({
  events: {'mouseover': 'mouseovercard'},
  mouseovercard: function(evt, x, y) {
  //  '<button class="delete">x</button>',
  var size = this.model.get('size');
  var position = this.model.get('position');
  //  console.log(this.model);
  }
});

var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({
  el: $('#paper'),
  height: $('#paperArea').height()-15,
  width: $('#paperArea').width()-15,
  model: graph,
  gridSize: 15,
  drawGrid: true,
  elementView: ConstraintElementView
});

/*
paper.on('all', function(evt, x, y) {
console.log("All events", evt, x, y);
});
*/
// Canvas from which you take shapes
var stencilGraph = new joint.dia.Graph;
var stencilPaper = new joint.dia.Paper({
    el: $('#stencil'),
    height: $('#stencilArea').height()-15,
    width: $('#stencilArea').width()-15,
    model: stencilGraph,
    interactive: false,
    background: {
      color: '#BDBDBD',
    },
    restrictTranslate: true
  });

var produceNodeColor = "#00b500";
var contextNodeColor = "black";
var nacNodeColor = "red";
var constraintNodeColor = "black";



var produceNode = new ProduceNode({
  position: { x: 10, y: 30 },
  attrs: { text: {text: "Produce Node"}}
});

var contextNode = new ContextNode({
    position: { x: 140, y: 30 },
    attrs: { text: { text: 'Context Node'}}
});

var nacNode = new NacNode({
    position: { x: 270, y: 30 },
    attrs: { text: { text: 'NAC Node'}}
});

var constraintNode = new ConstraintNode({
    position: { x: 400, y: 30 },
    attrs: { text: { text: 'Constraint Node'}}
});

var corrNode = joint.shapes.basic.Path.define('tgg.node.CorrNode', {
  size: { width: 115, height: 50 },
  attrs: {
    path: { d: 'M 0 50 L 0 50 50 100 250 100 300 50 250 0 50 0 z',
            fill: 'white',
            'stroke-width': '1.5',
            stroke: '#00b500',
            'fill-opacity': .5},
    text: {
      text: 'CorrNode', fill: 'black', transform: 'matrix(1,0,0,1,0,-40)'
    },
  },
  /* Weitere Attribute des Knotens*/
  nodeType: 'corrNode'
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
var selectedCell = null;

paper.on('cell:pointerdown', function (cellView, evt, x, y) {
  if (selectedCell) {
    selectedCell.unhighlight();
  }
  var cell = cellView.model;
  if (cell.get('parent')) {
    graph.getCell(cell.get('parent')).unembed(cell);
 }

  selectedCell = cellView;
  selectedCell.highlight();
  if( cellView.model.get('type').startsWith('tgg.node')) {
    if($(".editNode").attr('model-id') != cellView.model.get('id')) {
      $(".editNode").remove();
      $("#toolboxSection").remove();
      var size = cellView.model.get('size');
      var position = cellView.model.get('position');
      $("#paper").append(`
        <div class='editNode' model-id="${cellView.model.get('id')}"
              style="position: absolute;
                    margin: ${position.y - 20}px 0 0 ${position.x - 20}px;
                    height: ${size.height + 40}px;
                    width:  ${size.width + 40}px">
          <button class='deleteBtn'></button>
          <button class='resizeBtn'></button>
          <button class='addLinkBtn'></button>
        </div>
      `);

      var elemStr = `
      <div id="toolboxSection" class="form-inline">
          <div class="form-group">
            <label>Name</label>
            <input class="form-control" id="nodeName" value="${cellView.model.get('attrs').text.text}"/>
          </div>
          <div class="form-group">
            <label>Domain:</label>
            <select class="form-control" id="domain">
              <option value="source">Source Model</option>
              <option value="correspondence">Correspondence Model</option>
              <option value="target">Target Model</option>
            </select>
          </div>
          <div class="form-group">
            <label>Type:</label>
            <select class="form-control" id="nodeType">
              <option value="produceNode">Produce Node</option>
              <option value="contextNode">Context Node</option>
              <option value="nacNode">NAC Node</option>
              <option value="constraintNode">Constraint Node</option>
            </select>
          </div>
      </div>`;
      $("#toolbox").append(elemStr);
      $('#nodeType').val(cellView.model.get('nodeType'));
      $('#domain').val(cellView.model.get('domain'));

      $("#nodeName").keyup(function(){
        cellView.model.attr('text/text', $("#nodeName").val());
      });

      $("#domain").change(function(){
        cellView.model.set('domain', $("#domain").val());
      });

      $("#nodeType").change(function(){
        cellView.model.set('nodeType', $("#nodeType").val());
          var el = V(cellView.el).findOne("g");
          el.removeClass("contextNode")
            .removeClass("produceNode")
            .removeClass("nacNode")
            .removeClass("constraintNode")
            .addClass($("#nodeType").val());

          if(cellView.model.get('type') == 'basic.Path') {
            switch(cellView.model.get('nodeType')) {
              case "contextNode":
                cellView.model.attr('path/stroke', contextNodeColor);
                cellView.model.attr('path/stroke-dasharray', '0');
                break;
              case "produceNode":
                cellView.model.attr('path/stroke', produceNodeColor);
                cellView.model.attr('path/stroke-dasharray', '0');
                break;
              }
          }

      });

      cellView.model.on('change:position', function() {
        $(".editNode").css('margin', (cellView.model.get('position').y - 20) + 'px 0 0 ' + (cellView.model.get('position').x - 20) + 'px');
        paper.fitToContent({
            minWidth: $('#paperArea').width()-15,
              minHeight: $('#paperArea').height()-15
        });
      });

      $(document).ready(function(){
        $(".deleteBtn").click(function() {
          cellView.remove();
          $(".editNode").remove();
        });

        $(".resizeBtn").on('mousedown', function(event) {
          if(event.type == 'mousedown') {
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

        function setPos(event) {
          newHeight = (event.pageY - firstClickY);
          newWidth = (event.pageX - firstClickX);
          newHeight = (newHeight - (newHeight % 15)) /15;
          newHeight = height + newHeight*15;

          newWidth = (newWidth - (newWidth % 15)) /15;
          newWidth = width + newWidth*15;

          cellView.model.resize(newWidth, newHeight);
          $(".editNode").height(newHeight + 40);
          $(".editNode").width(newWidth + 40);
          cellView.model.set('position', { x: posX, y: posY });
        }

        $(".addLinkBtn").click(function() {
          $(".editNode").append("<div class='btnMenu'></div>");
          $(".btnMenu").append("<ul id='btnMenuList'>");
          console.log("Hier");
          switch(cellView.model.get('nodeType')) {
            case "contextNode":
              $("#btnMenuList").append("<li id='newCorrLink'>Correspondence Link</li>");
              $("#btnMenuList").append("<li id='newRelatLink'>Relation Link</li>");
              break;
            case "produceNode":
              $("#btnMenuList").append("<li id='newCorrLink'>Correspondence Link</li>");
              $("#btnMenuList").append("<li id='newRelatLink'>Relation Link</li>");
              break;
            case "nacNode":
              $("#btnMenuList").append("<li id='newRelatLink'>Relation Link</li>");
              console.log("Hier23");
              break;
            case "constraintNode":
              $("#btnMenuList").append("<li id='newRelatLink'>Relation Link</li>");
              console.log("Hier545");
              break;
          }

          /* Füge eine Correspondence hinzu */
          $("#newCorrLink").click(function() {

            newCorrNode = new corrNode();
            newCorrNode.attr('text/text', cellView.model.get('attrs').text.text + 'TO');
            newCorrNode.set('position', { x: cellView.model.position().x, y: cellView.model.position().y });

            // Von welchem Typ ist der Anfangsknoten?
            var color = 0;
            switch(cellView.model.get('nodeType')) {
              case "contextNode":
                newCorrNode.set('nodeType', "contextNode");
                newCorrNode.attr('path/stroke', contextNodeColor);
                color = contextNodeColor;
                break;
              case "produceNode":
                newCorrNode.set('nodeType', "produceNode");
                newCorrNode.attr('path/stroke', produceNodeColor);
                color = produceNodeColor;
                break;
              }

            var link = new joint.dia.Link({
              source: { id: cellView.model.get('id') },
              target: { id: newCorrNode.id },
              attrs: {'.connection': {
                      'stroke-width': 1.5, stroke: color}
              },
            });

            graph.addCells([newCorrNode, link]);

            var linkView = paper.getDefaultLink()
              .set({
                'source': { id : newCorrNode.id },
                'target': { x: x, y: y },
                'attrs': { '.connection': {
                            'stroke-width': 1.5, stroke: color}
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

              newCorrNode.set('position', { x: p.x/2 +(cellView.model.position().x/2-25), y: p.y/2 + (cellView.model.position().y/2) });

              // manually execute the linkView mousemove handler
              evt.data.view.pointermove(evt, p.x, p.y);
            }

            function onDragEnd(evt) {
              // manually execute the linkView mouseup handler
              evt.data.view.pointerup(evt);
              $(document).off('.example');
              var targetElem;
              graph.getElements().forEach(function(element) {
                if(element.id == evt.data.view.model.get('target').id) {
                  targetElem = element;
                }
              });
              newCorrNode.attr('text/text', newCorrNode.get('attrs').text.text + targetElem.get('attrs').text.text);
            }
            $(".btnMenu").remove();
          });


          $("#newRelatLink").click(function() {

            // Von welchem Typ ist der Anfangsknoten?
            var color = 0;
            var strokeDasharray = 0;
            switch(cellView.model.get('nodeType')) {
              case "contextNode":
                color = contextNodeColor;
                break;
              case "produceNode":
                color = produceNodeColor;
                break;
              case "nacNode":
                color = nacNodeColor;
                break;
              case "constraintNode":
                color = constraintNodeColor;
                strokeDasharray = 2,5;
                break;
              }


            var linkView = paper.getDefaultLink()
              .set({
                'source': { id : cellView.model.get('id') },
                'target': { x: x, y: y },
                'attrs': { '.connection': {
                            'stroke-width': 1.5,
                            stroke: color,
                            'stroke-dasharray': strokeDasharray}
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
    var cellViewsBelow = paper.findViewsFromPoint(cell.getBBox().center());

    if (cellViewsBelow.length) {
        // Note that the findViewsFromPoint() returns the view for the `cell` itself.
        var cellViewBelow = _.find(cellViewsBelow, function(c) { return c.model.id !== cell.id });

        // Prevent recursive embedding.
        if (cellViewBelow && cellViewBelow.model.get('parent') !== cell.id) {
            cellViewBelow.model.embed(cell);
            cell.set("domain", cellViewBelow.model.get('domain'));
        }
    }
});

paper.on('blank:pointerdown', function(evt, x, y) {
  if (selectedCell) selectedCell.unhighlight();
  $(".editNode").remove();
  $("#toolboxSection").remove();
});
