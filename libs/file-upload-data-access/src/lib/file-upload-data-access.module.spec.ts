import { async, TestBed } from '@angular/core/testing';
import { FileUploadDataAccessModule } from './file-upload-data-access.module';

describe('FileUploadDataAccessModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FileUploadDataAccessModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(FileUploadDataAccessModule).toBeDefined();
  });
});
