import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { FileUploadService } from '@real-world-app/file-upload-data-access';
import { of } from 'rxjs';
import {
  catchError,
  map,
  mergeMap,
  switchMap,
  withLatestFrom
} from 'rxjs/operators';
import * as FileUploadActions from './file-upload.actions';
import * as FileUploadSelectors from './file-upload.selectors';

@Injectable()
export class FileUploadEffects {
  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions,
    private store$: Store<{}>
  ) {}

  processQueueEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadActions.processQueue, FileUploadActions.retryUpload),
      withLatestFrom(
        this.store$.pipe(select(FileUploadSelectors.selectFilesInQueue))
      ),
      switchMap(([_, filesToUpload]) =>
        filesToUpload.map(fileToUpload =>
          FileUploadActions.uploadRequest({ fileToUpload })
        )
      )
    )
  );

  uploadEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadActions.uploadRequest),
      mergeMap(({ fileToUpload }) =>
        this.fileUploadService.uploadFile(fileToUpload.rawFile).pipe(
          map(event => this.getActionFromHttpEvent(event, fileToUpload.id)),
          catchError(error =>
            of(
              FileUploadActions.uploadFailure({
                error: error.error.message,
                id: fileToUpload.id
              })
            )
          )
        )
      )
    )
  );

  private getActionFromHttpEvent(event: HttpEvent<any>, id: number) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return FileUploadActions.uploadStarted({ id });
      }
      case HttpEventType.DownloadProgress:
      case HttpEventType.UploadProgress: {
        return FileUploadActions.uploadProgress({
          id,
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return FileUploadActions.uploadCompleted({ id });
        } else {
          return FileUploadActions.uploadFailure({
            id,
            error: event.statusText
          });
        }
      }
      default: {
        return FileUploadActions.uploadFailure({
          id,
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }
}
