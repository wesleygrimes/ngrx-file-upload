import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, takeUntil } from 'rxjs/operators';
import * as serializeError from 'serialize-error';
import { FileUploadService } from 'src/app/_services';
import * as fromFeatureActions from './actions';

@Injectable()
export class UploadFileEffects {
  @Effect()
  uploadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType(fromFeatureActions.ActionTypes.UPLOAD_REQUEST),
    concatMap(action =>
      this.fileUploadService.uploadFile(action.payload.file).pipe(
        takeUntil(
          this.actions$.pipe(
            ofType(fromFeatureActions.ActionTypes.UPLOAD_CANCEL)
          )
        ),
        map(event => this.getActionFromHttpEvent(event)),
        catchError(error => of(this.handleError(error)))
      )
    )
  );

  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions<fromFeatureActions.Actions>
  ) {}

  private getActionFromHttpEvent(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return new fromFeatureActions.UploadStartedAction();
      }
      case HttpEventType.UploadProgress: {
        return new fromFeatureActions.UploadProgressAction({
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.ResponseHeader:
      case HttpEventType.Response: {
        if (event.status === 200) {
          return new fromFeatureActions.UploadCompletedAction();
        } else {
          return new fromFeatureActions.UploadFailureAction({
            error: event.statusText
          });
        }
      }
      default: {
        return new fromFeatureActions.UploadFailureAction({
          error: `Unknown Event: ${JSON.stringify(event)}`
        });
      }
    }
  }

  private handleError(error: any) {
    const friendlyErrorMessage = serializeError(error).message;
    console.error(friendlyErrorMessage);
    return new fromFeatureActions.UploadFailureAction({
      error: friendlyErrorMessage
    });
  }
}
