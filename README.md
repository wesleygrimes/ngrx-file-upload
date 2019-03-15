## Managing File Uploads With NgRx

In this article we will build a fully-functional file upload control, that is powered by **Angular** and is backed by an **NgRx** feature store. The control will provide the user with the following features:

- The ability to upload files using the `<input #file type="file" />` html element.
- The ability to see an accurate upload progress via the `reportProgress` `HttpClient` option.
- The ability to cancel in-process uploads

As an added bonus, we will briefly dive into building the _server-side_ ASP.NET Core WebAPI Controller that will handle the file uploads.

## Before We Get Started

In this article, I will show you how to manage file uploads using NgRx. If you are new to NgRx, then I highly recommend that you first read my article, [NgRx - Best Practices for Enterprise Angular Applications](https://wesleygrimes.com/angular/2018/05/30/ngrx-best-practices-for-enterprise-angular-applications.html). We will be using the techniques described in that article to build out the NgRx components for file uploads.

If you are new to Angular, then I recommend that you check out one of the following resources:

- [Ultimate Courses](https://bit.ly/2WubqhW)
- [Official Angular Docs](https://angular.io/guide/router)
- [NgRx Docs](https://ngrx.io/docs)

## NPM Package Versions

For context, this article assumes you are using the following `npm` `package.json` versions:

- `@angular/*`: 7.2.9
- `@ngrx/*`: 7.3.0

## Prerequisites

Before diving into building the file upload control, make sure that you have the following in place:

1. An Angular 7+ application generated
2. NgRx dependencies installed
3. NgRx Store wired up in your application. [e.g. Follow this guide](https://wesleygrimes.com/angular/2018/05/30/ngrx-best-practices-for-enterprise-angular-applications.html)

---

## Create the Upload File Service

Let's create a brand new service in `Angular`. This service will be responsible for handling the file upload from the client to the server backend. We will use the amazing [`HttpClient`](https://angular.io/guide/http) provided with `Angular`.

### Generate the service

```shell
$ ng g service file-upload
```

### Inject the HttpClient

Because we are using the `HttpClient` to make requests to the backend, we need to inject it into our service. Update `constructor` line of code so that it looks as follows:

```typescript
constructor(private httpClient: HttpClient) {}
```

### Add a private field for `API_BASE_URL`

> I typically store `API` base urls in the `src/environments` area. If you're interested in learning more about `environments` in `Angular` then check out this great article: [Becoming an Angular Environmentalist](https://blog.angularindepth.com/becoming-an-angular-environmentalist-45a48f7c20d8)

Let's create a new private field named `API_BASE_URL` so that we can use this in our calls to the backend `API`.

One way to accomplish this would be to do the following:

```typescript
import { environment } from 'src/environments/environment';
...
private API_BASE_URL = environment.apiBaseUrl;
```

### Add a uploadFile public method

Let's create a new public method named `uploadFile` to the service. The method will take in a parameter `file: File` and return an `Observable<HttpEvent<{}>>`.

> Typically a `get` or `post` `Observable<>` is returned from a service like this. However, in this situation we are going to actually return the raw `request` which is an `Observable<HttpEvent<{}>>`.

> By returning a raw `request` we have more control over the process, to pass options like `reportProgress` and allow cancellation of a `request`.

```typescript
public uploadFile(file: File): Observable<HttpEvent<{}>> {
  const formData = new FormData();
  formData.append('files', file, file.name);

  const options = {
    reportProgress: true
  };

  const req = new HttpRequest(
    'POST',
    `${this.API_BASE_URL}/api/file`,
    formData,
    options
  );
  return this.httpClient.request(req);
}
```

### Completed File Upload Service

The completed `file-upload.service.ts` will look as follows:

```typescript
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private API_BASE_URL = environment.apiBaseUrl;

  constructor(private httpClient: HttpClient) {}

  public uploadFile(file: File): Observable<HttpEvent<{}>> {
    const formData = new FormData();
    formData.append('files', file, file.name);

    const options = {
      reportProgress: true
    };

    const req = new HttpRequest(
      'POST',
      `${this.API_BASE_URL}/api/file`,
      formData,
      options
    );
    return this.httpClient.request(req);
  }
}
```

## Create the Upload File Feature Store

To keep your **NgRx** store organized, I recommend creating a separate Upload File Feature Store. Let's bundle it all together in a module named `upload-file-store.module.ts` and keep it under a sub-directory named `upload-file-store`.

### Create Feature Store Module

Create a feature store module using the following command:

```shell
$ ng g module upload-file-store --flat false
```

### Create State Interface

Create a new file underneath the `upload-file-store` folder, named `state.ts`. The contents of the file will be as follows:

> We are using a relatively new technique in that we will setup an `enum` to track the status. This `enum` will reflect the current state of the upload process. For more information on this method, check out [Alex Okrushko's article]().

```typescript
export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Requested',
  Started = 'Started',
  Failed = 'Failed',
  Completed = 'Completed'
}

export interface State {
  status: UploadStatus;
  error: string | null;
  progress: number | null;
}

export const initialState: State = {
  status: UploadStatus.Ready,
  error: null,
  progress: null
};
```

### Create Feature Actions

> If you would like to learn more about **NgRx Actions**, then check out the [official docs](https://ngrx.io/guide/store/actions).

Create a new file underneath the `upload-file-store` folder, named `actions.ts`. This file will hold the actions we want to make available on this store.

We will create the following actions on our feature store:

- `UPLOAD_REQUEST` - This action is dispatched from the file upload form, it's payload will contain the actual `File` being uploaded.

- `UPLOAD_CANCEL` - This action is dispatched from the file upload form when the cancel button is clicked. This will be used to cancel uploads in progress.

- `UPLOAD_RESET` - This action is dispatched from the file upload form when the reset button is clicked. This will be used to reset the state of the store to defaults.

- `UPLOAD_STARTED` - This action is dispatched from the file upload effect, `HttpClient` when the API reports the `HttpEventType.Sent` event.

- `UPLOAD_PROGRESS` - This action is dispatched from the file upload effect, `HttpClient` when the API reports the `HttpEventType.UploadProgress` event. The payload will container the progress percentage as a whole number.

- `UPLOAD_FAILURE` - This action is dispatched from the file upload effect when the API returns an error, or there is an `HttpEventType.ResponseHeader` or `HttpEventType.Response` with an `event.status !== 200`, or when an unknown `HttpEventType` is returned. The payload will contain the specific error message returned from the API and place it into an `error` field on the store.

- `UPLOAD_COMPLETED` - This action is dispatched from the file upload effect when the API reports a `HttpEventType.ResponseHeader` or `HttpEventType.Response` event `event.status === 200`. There is no payload as the API just returns a `200 OK` repsonse.

The final `actions.ts` file will look as follows:

```typescript
import { Action } from '@ngrx/store';

export enum ActionTypes {
  UPLOAD_REQUEST = '[File Upload Form] Request',
  UPLOAD_CANCEL = '[File Upload Form] Cancel',
  UPLOAD_RESET = '[File Upload Form] Reset',
  UPLOAD_STARTED = '[File Upload API] Started',
  UPLOAD_PROGRESS = '[File Upload API] Progress',
  UPLOAD_FAILURE = '[File Upload API] Failure',
  UPLOAD_COMPLETED = '[File Upload API] Success'
}

export class UploadRequestAction implements Action {
  readonly type = ActionTypes.UPLOAD_REQUEST;
  constructor(public payload: { file: File }) {}
}

export class UploadCancelAction implements Action {
  readonly type = ActionTypes.UPLOAD_CANCEL;
}

export class UploadResetAction implements Action {
  readonly type = ActionTypes.UPLOAD_RESET;
}

export class UploadStartedAction implements Action {
  readonly type = ActionTypes.UPLOAD_STARTED;
}

export class UploadProgressAction implements Action {
  readonly type = ActionTypes.UPLOAD_PROGRESS;
  constructor(public payload: { progress: number }) {}
}

export class UploadFailureAction implements Action {
  readonly type = ActionTypes.UPLOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UploadCompletedAction implements Action {
  readonly type = ActionTypes.UPLOAD_COMPLETED;
}

export type Actions =
  | UploadRequestAction
  | UploadCancelAction
  | UploadResetAction
  | UploadStartedAction
  | UploadProgressAction
  | UploadFailureAction
  | UploadCompletedAction;
```

### Create the Feature Reducer

> If you would like to learn more about **NgRx Reducers**, then check out the [official docs](https://ngrx.io/guide/store/reducers).

Create a new file underneath the `upload-file-store` folder, named `reducer.ts`. This file will hold the reducer we create to manage state transitions to the store.

We will handle state transitions as follows for the aforementioned actions:

- `UPLOAD_REQUEST` - Reset the state, with the exception of setting `state.status` to `UploadStatus.Requested`.

- `UPLOAD_CANCEL` - Reset the state tree. Our effect will listen for any `UPLOAD_CANCEL` event dispatches so a specific state field is not needed for this.

- `UPLOAD_RESET` - Reset the state tree on this action.

- `UPLOAD_FAILURE` - Reset the state tree, with the exception of setting `state.status` to `UploadStatus.Failed` and `state.error` to the `error` that was throw in the `catchError` from the `API` in the `uploadRequestEffect` effect.

- `UPLOAD_STARTED` - Set `state.progress` to `0` and `state.status` to `UploadStatus.Started`.

- `UPLOAD_PROGRESS` - Set `state.progress` to the current `action.payload.progress` provided from the action.

- `UPLOAD_COMPLETED` - Reset the state tree, with the exception of setting `state.status` to `UploadStatus.Completed` so that the UI can display a success message.

```typescript
import { Actions, ActionTypes } from './actions';
import { initialState, State, UploadStatus } from './state';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST: {
      return {
        ...state,
        status: UploadStatus.Requested,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_CANCEL: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_RESET: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null
      };
    }
    case ActionTypes.UPLOAD_FAILURE: {
      return {
        ...state,
        status: UploadStatus.Failed,
        error: action.payload.error,
        progress: null
      };
    }
    case ActionTypes.UPLOAD_STARTED: {
      return {
        ...state,
        status: UploadStatus.Started,
        progress: 0
      };
    }
    case ActionTypes.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress
      };
    }
    case ActionTypes.UPLOAD_COMPLETED: {
      return {
        ...state,
        status: UploadStatus.Completed,
        progress: 100,
        error: null
      };
    }
    default: {
      return state;
    }
  }
}
```

### Create the Feature Effects

> If you would like to learn more about **NgRx Effects**, then check out the [official docs](https://ngrx.io/guide/effects).

Create a new file underneath the `upload-file-store` folder, named `effects.ts`. This file will hold the effects that we create to handle any side-effect calls to the backend `API` service. This effect is where most of the magic happens in the application.

#### Inject Dependencies

Let's add the necessary dependencies to our `constructor` as follows:

```typescript
constructor(
  private fileUploadService: FileUploadService,
  private actions$: Actions<fromFeatureActions.Actions>
) {}
```

#### Add a new Upload Request Effect

> Effects make heavy-use of `rxjs` concepts and topics. If you are new to `rxjs` then I suggest you check out the [official docs](https://rxjs.dev)

Let's create a new effect in the file named `uploadRequestEffect$`.

A couple comments about what this effect is going to do:

- Listen for the `UPLOAD_REQUEST` action and then make calls to the `fileUploadService.uploadFile` service method to initiate the upload process.

- Use the [`concatMap`](https://rxjs.dev/api/operators/concatMap) RxJS operator here so that multiple file upload requests are queued up and processed in the order they were dispatched.

- Use the [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) RxJS operator listening for an `UPLOAD_CANCEL` action to be dispatched. This allows us to **short-circuit** any requests that are in-flight.

- Use the [`map`](https://rxjs.dev/api/operators/map) RxJS operator to map specific `HttpEvent` responses to dispatch specific `Actions` that we have defined in our `Store`.

- Use the [`catchError`](https://rxjs.dev/api/operators/catchError) RxJS operator to handle any errors that may be thrown from the `HttpClient`.

The effect will look something like this:

```typescript
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
```

#### Add the getActionFromHttpEvent private method

> For more information on listening to progress events, check out the [official docs guide from here](https://angular.io/guide/http#listening-to-progress-events).

This method will be responsible for mapping a specific `HttpEventType` to a specific `Action` that is dispatched.

- `HttpEventType.Sent` - This event occurs when the upload process has begun. We will dispatch an `UPLOAD_STARTED` action to denote that the process has begun.

- `HttpEventType.UploadProgress` - This event occurs when the upload process has made progress. We will dispatch an `UPLOAD_PROGRESS` action with a payload of `progress: Math.round((100 * event.loaded) / event.total)` to calculate the actual percentage complete of upload. This is because the `HttpClient` returns an `event.loaded` and `event.total` property in whole number format.

- `HttpEventType.Response` / `HttpEventType.ResponseHeader` - These events occur when the upload process has finished. It is important to note that this could be a success or failure so we need to interrogate the `event.status` to check for `200`. We will dispatch the `UPLOAD_COMPLETED` action if `event.status === 200` and `UPLOAD_FAILURE` if the `event.status !== 200` passing the `event.statusText` as the error payload.

- All Others (default case) - We treat any other events that may be returned as an error because they are unexpected behavior. We will dispatched a `UPLOAD_FAILURE` action with a payload of the `event` run through `JSON.stringify`.

```typescript
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
```

#### Add the handleError private method

> For more information on handling `HttpClient` errors, check out the [official docs guide from here](https://angular.io/guide/http#getting-error-details).

This method will be responsible for handling any errors that may be throw from the `HttpClient` during requests. I am making use of a neat library from npm named `serialize-error` to give me a predictable `error.message` no matter what type of error is thrown.

Install the library as so:

```shell
$ npm install serialize-error
```

```typescript
import * as serializeError from 'serialize-error';
...
private handleError(error: any) {
  const friendlyErrorMessage = serializeError(error).message;
  console.error(friendlyErrorMessage);
  return new fromFeatureActions.UploadFailureAction({
    error: friendlyErrorMessage
  });
}
```

#### Completed Feature Effect

The completed effect will look something like this:

```typescript
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
```

### Create the Feature Selectors

> If you would like to learn more about **NgRx Selectors**, then check out the [official docs](https://ngrx.io/guide/store/selectors).

Create a new file underneath the `upload-file-store` folder, named `selectors.ts`. This file will hold the selectors we will use to pull specific pieces of state out of the store. These are techincally not required, but strongly encouraged. Selectors improve application perfomance with the use of the `MemoizedSelector` wrapper. Selectors also simplify UI logic.

We will create a selector for each significant property of state. This includes the following properties:

- `state.status` - Since this is an `enum` we will create a selector for each `enum` choice.
- `state.error`
- `state.progress`

The completed selectors file will look something like the following:

```typescript
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { State, UploadStatus } from './state';

const getError = (state: State): string => state.error;

const getStarted = (state: State): boolean =>
  state.status === UploadStatus.Started;

const getRequested = (state: State): boolean =>
  state.status === UploadStatus.Requested;

const getReady = (state: State): boolean => state.status === UploadStatus.Ready;

const getProgress = (state: State): number => state.progress;

const getInProgress = (state: State): boolean =>
  state.status === UploadStatus.Started && state.progress >= 0;

const getFailed = (state: State): boolean =>
  state.status === UploadStatus.Failed;

const getCompleted = (state: State): boolean =>
  state.status === UploadStatus.Completed;

export const selectUploadFileFeatureState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>('uploadFile');

export const selectUploadFileError: MemoizedSelector<
  object,
  string
> = createSelector(
  selectUploadFileFeatureState,
  getError
);

export const selectUploadFileReady: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getReady
);

export const selectUploadFileRequested: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getRequested
);

export const selectUploadFileStarted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getStarted
);

export const selectUploadFileProgress: MemoizedSelector<
  object,
  number
> = createSelector(
  selectUploadFileFeatureState,
  getProgress
);

export const selectUploadFileInProgress: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getInProgress
);

export const selectUploadFileFailed: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getFailed
);

export const selectUploadFileCompleted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCompleted
);
```

### Update the Feature Module

We now need to update the feature module `UploadFileStoreModule` to wire-up the store.

The completed `UploadFileStoreModule` should look similar to this:

```typescript
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { UploadFileEffects } from './effects';
import { featureReducer } from './reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature('uploadFile', featureReducer),
    EffectsModule.forFeature([UploadFileEffects])
  ]
})
export class UploadFileStoreModule {}
```

#### Import this module where needed

Make sure to import this new `UploadFileStoreModule` where it is needed. In this example, we will import this into the `AppModule` as we do not have any lazy-loaded features.

#### Update your AppModule to import Store & Effects

Last, make sure that you update your `AppModule` to import the `StoreModule.forRoot` and `EffectsModule.forRoot`.

An updated `AppModule` may look as follows:

```typescript
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { UploadFileStoreModule } from './upload-file-store/upload-file-store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production // Restrict extension to log-only mode
    }),
    UploadFileStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## Let's Review So Far

- Up to this point we have created a new `FileUploadService` that calls our backend `API` to upload a `File` object.

- We have also created a new `UploadFileStore` feature store that provides `Actions`, a `Reducer`, `Effects`, and `Selectors` to manage the file upload process.

- Last, the store has been imported into our `AppModule` for use.

Now that we have the foundation laid out for us we can turn our attention to the user interface and wire-up a new component to the `UploadFileStore` that we created to manage our process.

This will be the fun part!

---

## Create the Upload File Component

Let's start by creating a brand-new `Component`. This component will consist of the following elements:

- An `input` element for the user to interact with to upload a file. The `change` event will dispatch the `UploadFileStoreActions.UploadRequest()` action

- A progress percentage to connected to the `UploadFileStoreSelectors.selectUploadFileProgress` selector for real-time progress

- A Cancel UPload button to dispatch the `UploadFileStoreActions.UploadCancelRequest()` action

- An Upload Another File button to dispatch the `UploadFileStoreActions.UploadResetRequest()` action and allow for a new file upload

> SIDE NOTE: This would be a good scenario to create a connected container with a dumb component, but for the brevity of this article I will show these combined as one. In the example repository, I will show both scenarios.

### Generate the component

> [Click here](https://angular.io/cli) for more details on using the powerful Angular CLI

```shell
$ ng g component upload-file
```

> For simplicity of this article we will just display the progress percentage, this could easily be adapted to hook into the `value` property of a progress bar control, like the Angular Material library provides.

### Update the component \*.ts file

#### Inject the Store

We need to wire-up our store into this component for use. Let's start by injecting the store into the `constructor`. The finished `constructor` should look something like this:

```typescript
...
constructor(private store$: Store<fromFeatureState.State>) {}
```

#### Wire-up our selectors from state

Let's create three (6) public fields on the component. A good practice is to place `$` as a suffix so that you know these are `Observable` and must be subscribed to in the template.

```typescript
completed$: Observable<boolean>;
progress$: Observable<number>;
error$: Observable<string>;

isInProgress$: Observable<boolean>;
isReady$: Observable<boolean>;
hasFailed$: Observable<boolean>;
```

Let's hook these up to the store in our `ngOnInit` life-cycle hook.

```typescript
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

  this.isInProgress$ = this.store$.pipe(
    select(fromFeatureSelectors.selectUploadFileInProgress)
  );

  this.isReady$ = this.store$.pipe(
    select(fromFeatureSelectors.selectUploadFileReady)
  );

  this.hasFailed$ = this.store$.pipe(
    select(fromFeatureSelectors.selectUploadFileFailed)
  );
}
```

#### Wire-up our action dispatchers

Let's add `uploadFile`, `resetUpload`, and `cancelUpload` methods to connect our button clicks to dispatch actions in the store.

```typescript
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
  this.store$.dispatch(new UploadFileStoreActions.UploadResetAction());
}

cancelUpload() {
  this.store$.dispatch(new UploadFileStoreActions.UploadCancelAction());
}
```

#### Finished Component \*.ts file

The finished component \*.ts file should look similar to the following:

```typescript
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
  isInProgress$: Observable<boolean>;
  isReady$: Observable<boolean>;
  hasFailed$: Observable<boolean>;

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

    this.isInProgress$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileInProgress)
    );

    this.isReady$ = this.store$.pipe(
      select(fromFeatureSelectors.selectUploadFileReady)
    );

    this.hasFailed$ = this.store$.pipe(
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
```

### Update the component \*.html template

We are going to add five (5) major parts to our upload file component.

#### Add the input field

There is no upload file button, rather we will make use of the built-in input component and hook to the `change` event. Any time a file is added to the form this event will fire. We also only want to display this form if we are accepting new files to be uploaded, i.e. it has failed or it is ready. We will use the `*ngIf` structural directive to help here referencing our `isReady$` and `hasFailed$` observables.

```html
<div class="message" *ngIf="(isReady$ | async) || (hasFailed$ | async)">
  <input #file type="file" multiple (change)="uploadFile($event)" />
</div>
```

#### Add the progress message

This message will be displayed when the progress is greater than or equal to 0% and the `UploadStatus` is `Failed`. We will use `*ngIf` to only display if it's in this state using the `isInProgress$` selector value. We will set the text of the progress message to the `progress$` selector value.

```html
<div class="message" *ngIf="(isInProgress$ | async)">
  <div style="margin-bottom: 14px;">Uploading... {{ progress$ | async }}%</div>
</div>
```

#### Add the Cancel Upload button

This button will utilize the `*ngIf` to only display if the upload is in progress using the `isInProgress$` selector value. The click event will trigger the dispatch of the `UploadCancelAction`.

```html
<div class="message" *ngIf="(isInProgress$ | async)">
  <button (click)="cancelUpload()">Cancel Upload</button>
</div>
```

#### Add the Reset Upload button

This button will utilize the `*ngIf` to only display if the upload is complete using the `completed$` selector value. The click event will trigger the dispatch of the `UploadResetAction`.

```html
<div class="message" *ngIf="(completed$ | async)">
  <h4>
    File has been uploaded successfully!
  </h4>
  <button (click)="resetUpload()">Upload Another File</button>
</div>
```

#### Add the Error message

This button will utilize the `*ngIf` to only display if `hasFailed$` selector value returns `true`. The actual error message is pulled from the `error$` selector value.

```html
<div class="message error" *ngIf="(hasFailed$ | async)">
  Error: {{ error$ | async }}
</div>
```

#### Finished Component \*.html file

```html
<div class="message" *ngIf="(isReady$ | async) || (hasFailed$ | async)">
  <input #file type="file" multiple (change)="uploadFile($event)" />
</div>

<div class="message" *ngIf="(isInProgress$ | async)">
  <div style="margin-bottom: 14px;">Uploading... {{ progress$ | async }}%</div>
</div>

<div class="message" *ngIf="(isInProgress$ | async)">
  <button (click)="cancelUpload()">Cancel Upload</button>
</div>

<div class="message" *ngIf="(completed$ | async)">
  <h4>
    File has been uploaded successfully!
  </h4>
  <button (click)="resetUpload()">Upload Another File</button>
</div>

<div class="message error" *ngIf="(hasFailed$ | async)">
  Error: {{ error$ | async }}
</div>
```

### Add some styles to our Component \*.css file

For formatting let's add a few simple classes to our component stylesheet:

```css
.message {
  margin-bottom: 15px;
}

.error {
  color: red;
}
```

## Add the Component to our AppComponent

For the purposes of this article we will add our new `UploadFileComponent` component to our `AppComponent`. The template will look as follows:

```html
<app-upload-file></app-upload-file>
```

---

## (Bonus Feature) Back-end REST Endpoint

For a full mock back-end server checkout my [repository here:

- [github.com/wesleygrimes/aspnetcore-mock-file-upload-server](https://github.com/wesleygrimes/aspnetcore-mock-file-upload-server)

For those of you brave souls that have made it this far... You might be asking what the backend `API` endpoint looks like. Well, here's an example `ASP.NET Core` `Controller` offered free of charge ;-)

```csharp
public class FileController : ControllerBase
{
    [HttpPost("")]
    public async Task<IActionResult> Post(List<IFormFile> files)
    {
        try
        {
            foreach (var file in files)
            {
                Console.WriteLine($"Begin Uploaded File: {file.FileName}");

                //simulate upload
                Task.Delay(5000).Wait();

                Console.WriteLine($"Finished Uploaded File: {file.FileName}");
            }

            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest($"Unable to upload file(s).");
        }
    }
}
```

## GitHub Example Repository

I always like to provide working code examples that follow the article. You can find this articles companion application at the following repository:

- [github.com/wesleygrimes/ngrx-file-upload](https://github.com/wesleygrimes/ngrx-file-upload)

## Conclusion

It's important to remember that I have implemented these best practices in several "real world" applications. While I have found these best practices helpful, and maintainable, I do not believe they are an end-all be-all solution to your NgRx projects; it's just what has worked for me. I am curious as to what you all think? Please feel free to offer any suggestions, tips, or best practices you've learned when building enterprise Angular applications with NgRx and I will update the article to reflect as such. Happy Coding!

---

## Additional Resources

I would highly recommend enrolling in the Ultimate Angular courses, especially the NgRx course. It is well worth the money and I have used it as a training tool for new Angular developers. Follow the link below to signup.

[Ultimate Courses: Expert online courses in JavaScript, Angular, NGRX and TypeScript](https://bit.ly/2WubqhW)
