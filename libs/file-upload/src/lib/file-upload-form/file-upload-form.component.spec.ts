import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadFormComponent } from './file-upload-form.component';

describe('UploadFormComponent', () => {
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
