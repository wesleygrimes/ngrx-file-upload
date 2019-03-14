import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
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
  isLoading$: Observable<boolean>;
  progress$: Observable<number>;

  constructor(private store$: Store<fromFeatureState.State>) {}

  ngOnInit() {
    this.isLoading$ = this.store$.select(
      fromFeatureSelectors.selectUploadFileIsLoading
    );

    this.completed$ = this.store$.select(
      fromFeatureSelectors.selectUploadFileCompleted
    );

    this.progress$ = this.store$.select(
      fromFeatureSelectors.selectUploadFileProgress
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

  isUploadInProgress(progress: number) {
    return progress > 0 && progress < 100;
  }

  isUploadWaitingToComplete(progress: number, completed: boolean) {
    return progress === 100 && !completed;
  }
}
