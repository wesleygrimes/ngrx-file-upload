import { TestBed } from '@angular/core/testing';

import { FileUploadService } from './file-upload.service';

describe('FileUploadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploadService = TestBed.get(FileUploadService);
    expect(service).toBeTruthy();
  });
});
