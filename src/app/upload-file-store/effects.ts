import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map, takeUntil } from 'rxjs/operators';
import serializeError from 'serialize-error';
import { FileUploadService } from 'src/app/_services';
import * as fromFileUploadActions from './actions';

@Injectable()
export class UploadFileEffects {
  @Effect()
  uploadRequestEffect$ = this.actions$.pipe(
    ofType(fromFileUploadActions.uploadRequest.type),
    concatMap(action =>
      this.fileUploadService.uploadFile(action.file).pipe(
        takeUntil(
          this.actions$.pipe(ofType(fromFileUploadActions.uploadCancel.type))
        ),
        map(event => this.getActionFromHttpEvent(event)),
        catchError(error => of(this.handleError(error)))
      )
    )
  );

  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions<fromFileUploadActions.UploadFileStoreActionsUnion>
  ) {}

  private getActionFromHttpEvent(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return fromFileUploadActions.uploadStarted();
      }
      case HttpEventType.UploadProgress: {
        return fromFileUploadActions.uploadProgress({
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return fromFileUploadActions.uploadCompleted();
        } else {
          return fromFileUploadActions.uploadFailure({
            error: event.statusText
          });
        }
      }
      default: {
        return fromFileUploadActions.uploadFailure({
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }

  private handleError(error: any) {
    const friendlyErrorMessage = serializeError(error).message;
    return fromFileUploadActions.uploadFailure({
      error: friendlyErrorMessage
    });
  }
}
