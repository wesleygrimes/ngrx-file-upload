import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FileUploadListComponent } from './file-upload-list.component';

describe('FilesListComponent', () => {
  let component: FileUploadListComponent;
  let fixture: ComponentFixture<FileUploadListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
