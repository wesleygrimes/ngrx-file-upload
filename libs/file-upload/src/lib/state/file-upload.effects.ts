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
  takeUntil,
  withLatestFrom
} from 'rxjs/operators';
import { serializeError } from 'serialize-error';
import * as FileUploadAPIActions from './file-upload-api.actions';
import * as FileUploadUIActions from './file-upload-ui.actions';
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
      ofType(FileUploadUIActions.processQueue, FileUploadUIActions.retryUpload),
      withLatestFrom(
        this.store$.pipe(select(FileUploadSelectors.selectFilesInQueue))
      ),
      switchMap(([_, filesToUpload]) =>
        filesToUpload.map(fileToUpload =>
          FileUploadUIActions.uploadRequest({ fileToUpload })
        )
      )
    )
  );

  uploadEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FileUploadUIActions.uploadRequest),
      mergeMap(({ fileToUpload }) =>
        this.fileUploadService.uploadFile(fileToUpload.rawFile).pipe(
          takeUntil(
            this.actions$.pipe(ofType(FileUploadUIActions.cancelUpload))
          ),
          map(event => this.getActionFromHttpEvent(event, fileToUpload.id)),
          catchError(error =>
            of(
              FileUploadAPIActions.uploadFailure({
                error: this.handleError(error),
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
        return FileUploadAPIActions.uploadStarted({ id });
      }
      case HttpEventType.DownloadProgress:
      case HttpEventType.UploadProgress: {
        return FileUploadAPIActions.uploadProgress({
          id,
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return FileUploadAPIActions.uploadCompleted({ id });
        } else {
          return FileUploadAPIActions.uploadFailure({
            id,
            error: event.statusText
          });
        }
      }
      default: {
        return FileUploadAPIActions.uploadFailure({
          id,
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }

  private handleError(error: any) {
    return serializeError(error).message;
  }
}
