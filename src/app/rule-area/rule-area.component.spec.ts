import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {RuleAreaComponent} from "./rule-area.component";

describe('RuleAreaComponent', () => {
  let component: RuleAreaComponent;
  let fixture: ComponentFixture<RuleAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RuleAreaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
