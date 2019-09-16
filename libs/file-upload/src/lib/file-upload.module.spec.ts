import { async, TestBed } from '@angular/core/testing';
import { FileUploadModule } from './file-upload.module';

describe('FileUploadModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FileUploadModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FileUploadModule).toBeDefined();
  });
});
