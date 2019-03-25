import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromFileUploadActions from 'src/app/upload-file-store/actions';
import * as fromFileUploadSelectors from 'src/app/upload-file-store/selectors';
import * as fromFileUploadState from 'src/app/upload-file-store/state';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  completed$: Observable<boolean>;
  progress$: Observable<number>;
  error$: Observable<string>;
  isInProgress$: Observable<boolean>;
  isReady$: Observable<boolean>;
  hasFailed$: Observable<boolean>;

  constructor(private store$: Store<fromFileUploadState.State>) {}

  ngOnInit() {
    this.completed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileCompleted)
    );

    this.progress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileProgress)
    );

    this.error$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileError)
    );

    this.isInProgress$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileInProgress)
    );

    this.isReady$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileReady)
    );

    this.hasFailed$ = this.store$.pipe(
      select(fromFileUploadSelectors.selectUploadFileFailed)
    );
  }

  uploadFile(event: any) {
    const files: FileList = event.target.files;
    const file = files.item(0);

    this.store$.dispatch(
      new fromFileUploadActions.UploadRequestAction({
        file
      })
    );

    // clear the input form
    event.srcElement.value = null;
  }

  resetUpload() {
    this.store$.dispatch(new fromFileUploadActions.UploadResetAction());
  }

  cancelUpload() {
    this.store$.dispatch(new fromFileUploadActions.UploadCancelAction());
  }
}
