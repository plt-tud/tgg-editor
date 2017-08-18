import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {StencilAreaComponent} from "./stencil-area.component";

describe('StencilAreaComponent', () => {
  let component: StencilAreaComponent;
  let fixture: ComponentFixture<StencilAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StencilAreaComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StencilAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
