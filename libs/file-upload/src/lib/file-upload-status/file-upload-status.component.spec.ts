import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadStatusComponent } from './file-upload-status.component';

describe('UploadStatusIndicatorComponent', () => {
  let component: FileUploadStatusComponent;
  let fixture: ComponentFixture<FileUploadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadStatusComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
