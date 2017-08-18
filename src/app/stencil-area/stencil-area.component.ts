import {Component, OnInit} from "@angular/core";
import * as $ from "../../../node_modules/jquery/dist/jquery";
import {ConstraintNode, ContextNode, NacNode, ProduceNode} from "../shapes";
const joint = require('../../../node_modules/jointjs/dist/joint');

@Component({
  selector: 'app-stencil-area',
  templateUrl: './stencil-area.component.html',
  styleUrls: ['./stencil-area.component.scss']
})

// Canvas from which you take shapes
export class StencilAreaComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

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
      /*$('body').on('mouseup.fly', function(e) {
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
       */
    });

  }

}
