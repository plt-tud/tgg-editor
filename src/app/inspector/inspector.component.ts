import {Component, Input, OnInit} from "@angular/core";

@Component({
  selector: 'app-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.scss']
})
export class InspectorComponent implements OnInit {

  @Input("selectedCell") selectedCell;

  constructor() {
  }

  ngOnInit() {
  }

  updateName(newValue) {
    this.selectedCell.attr('text/text', newValue);
  }

  updateType(newValue) {
    this.selectedCell.set('nodeType', newValue);
    this.selectedCell.attr('.node', {class: `scalable node ${newValue}`});
  }

}
