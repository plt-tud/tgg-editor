import {inject, TestBed} from "@angular/core/testing";

import {BackendService} from "./backend.service";

describe('BackendService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BackendService]
    });
  });

  it('should ...', inject([BackendService], (service: BackendService) => {
    expect(service).toBeTruthy();
  }));
});
