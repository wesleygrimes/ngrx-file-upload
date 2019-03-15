import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromFeatureActions from 'src/app/upload-file-store/actions';
import * as fromFeatureSelectors from 'src/app/upload-file-store/selectors';
import * as fromFeatureState from 'src/app/upload-file-store/state';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent implements OnInit {
  completed$: Observable<boolean>;
  progress$: Observable<number>;
  error$: Observable<string>;
  isUploadInProgress$: Observable<boolean>;
  isReadyForUpload$: Observable<boolean>;
  isFailed$: Observable<boolean>;

  constructor(private store$: Store<fromFeatureState.State>) {}

  ngOnInit() {
    this.completed$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileCompleted)
    );

    this.progress$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileProgress)
    );

    this.error$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileError)
    );

    this.isUploadInProgress$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileInProgress)
    );

    this.isReadyForUpload$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileReady)
    );

    this.isFailed$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileFailed)
    );
  }

  uploadFile(event: any) {
    const files: FileList = event.target.files;
    const file = files.item(0);

    this.store$.dispatch(
      new fromFeatureActions.UploadRequestAction({
        file
      })
    );

    // clear the input form
    event.srcElement.value = null;
  }

  resetUpload() {
    this.store$.dispatch(new fromFeatureActions.UploadResetAction());
  }

  cancelUpload() {
    this.store$.dispatch(new fromFeatureActions.UploadCancelAction());
  }
}
