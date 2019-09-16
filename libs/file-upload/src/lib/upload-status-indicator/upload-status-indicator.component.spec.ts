import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStatusIndicatorComponent } from './upload-status-indicator.component';

describe('UploadStatusIndicatorComponent', () => {
  let component: UploadStatusIndicatorComponent;
  let fixture: ComponentFixture<UploadStatusIndicatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadStatusIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadStatusIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
