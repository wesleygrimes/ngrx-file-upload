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

> These fields were specifically chosen to keep track of the upload process.

```typescript
export interface State {
  completed: boolean;
  isLoading: boolean;
  error: string | null;
  progress: number | null;
  cancel: boolean;
}

export const initialState: State = {
  completed: false,
  isLoading: false,
  error: null,
  progress: null,
  cancel: false
};
```

### Create Feature Actions

> If you would like to learn more about **NgRx Actions**, then check out the [official docs](https://ngrx.io/guide/store/actions).

Create a new file underneath the `upload-file-store` folder, named `actions.ts`. This file will hold the actions we want to make available on this store.

We will create the following actions on our feature store:

- `UPLOAD_REQUEST` - This action is dispatched from the file upload form, it's payload will contain the actual `File` being uploaded.

- `UPLOAD_RESET` - This action is dispatched from the file upload form when the reset button is clicked. This will be used to reset the state of the store to defaults.

- `UPLOAD_CANCEL` - This action is dispatched from the file upload form when the cancel button is clicked. This will be used to cancel uploads in progress.

- `UPLOAD_FAILURE` - This action is dispatched from the file upload effect when the API returns an error. The payload will contain the specific error message returned from the API and place it into an `error` field on the store.

- `UPLOAD_SUCCESS` - This action is dispatched from the file upload effect when the API returns a success. There is no payload as the API just returns a `200 OK` repsonse.

- `UPLOAD_PROGRESS` - This action is dispatched from the file upload effect, `HttpClient` when the API reports progress. The payload will container the progress percentage as a whole number.

The final `actions.ts` file will look as follows:

```typescript
import { Action } from '@ngrx/store';

export enum ActionTypes {
  UPLOAD_REQUEST = '[File Upload Form] Request',
  UPLOAD_RESET = '[File Upload Form] Reset',
  UPLOAD_CANCEL = '[File Upload Form] Cancel',
  UPLOAD_FAILURE = '[File Upload API] Failure',
  UPLOAD_SUCCESS = '[File Upload API] Success',
  UPLOAD_PROGRESS = '[File Upload API] Progress'
}

export class UploadRequestAction implements Action {
  readonly type = ActionTypes.UPLOAD_REQUEST;
  constructor(public payload: { file: File }) {}
}

export class UploadFailureAction implements Action {
  readonly type = ActionTypes.UPLOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UploadSuccessAction implements Action {
  readonly type = ActionTypes.UPLOAD_SUCCESS;
}

export class UploadProgressAction implements Action {
  readonly type = ActionTypes.UPLOAD_PROGRESS;
  constructor(public payload: { progress: number }) {}
}

export class UploadResetAction implements Action {
  readonly type = ActionTypes.UPLOAD_RESET;
}

export class UploadCancelAction implements Action {
  readonly type = ActionTypes.UPLOAD_CANCEL;
}

export type Actions =
  | UploadRequestAction
  | UploadFailureAction
  | UploadSuccessAction
  | UploadProgressAction
  | UploadResetAction
  | UploadCancelAction;
```

### Create the Feature Reducer

> If you would like to learn more about **NgRx Reducers**, then check out the [official docs](https://ngrx.io/guide/store/reducers).

Create a new file underneath the `upload-file-store` folder, named `reducer.ts`. This file will hold the reducer we create to manage state transitions to the store.

We will handle state transitions as follows for the aforementioned actions:

- `UPLOAD_REQUEST` - Reset the state, with the exception of setting `state.isLoading` to `true`.

- `UPLOAD_RESET` - Reset the state tree on this action.

- `UPLOAD_CANCEL` - Reset the state tree, with the exception of setting `state.cancel` to `true` so that our `filter` pipe is triggered and short-circuits the `mergeMap` in the `uploadRequestEffect$` that will be defined later on in the article.

- `UPLOAD_FAILURE` - Reset the state tree, with the exception of setting `state.error` to the `error` that was throw in the `catchError` from the `API` in the `uploadRequestEffect` effect.

- `UPLOAD_PROGRESS` - Set `state.progress` to the current `action.payload.progress` provided from the action.

- `UPLOAD_SUCCESS` - Reset the state tree, with the exception of setting `state.completed` to `true` so that the UI can display a success message.

```typescript
import { Actions, ActionTypes } from './actions';
import { initialState, State } from './state';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ActionTypes.UPLOAD_REQUEST: {
      return {
        ...state,
        isLoading: true,
        completed: false,
        progress: null,
        error: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_RESET: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        progress: null,
        error: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_CANCEL: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        progress: null,
        error: null,
        cancel: true
      };
    }
    case ActionTypes.UPLOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        completed: false,
        error: action.payload.error,
        progress: null,
        cancel: false
      };
    }
    case ActionTypes.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress
      };
    }
    case ActionTypes.UPLOAD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        completed: true,
        progress: null,
        error: null,
        cancel: false
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
    private actions$: Actions,
    private store$: Store<fromFeatureState.State>
  ) {}
```

#### Add a new Upload Request Effect

> Effects make heavy-use of `rxjs` concepts and topics. If you are new to `rxjs` then I suggest you check out the [official docs](https://rxjs.dev)

Let's create a new effect in the file named `uploadRequestEffect$`.

A couple comments about what this effect is going to do:

- Listen for the `UPLOAD_REQUEST` action and then make calls to the `fileUploadService.uploadFile` service method to initiate the upload process.

- Use the [`concatMap`](https://rxjs.dev/api/operators/concatMap) RxJS operator here so that multiple file upload requests are queued up and processed in the order they were dispatched.

- Use the [`takeUntil`](https://rxjs.dev/api/operators/takeUntil) RxJS operator connected to the `state.cancel` property, so that we can **short-circuit** any requests that are in-flight.

- Use the [`map`](https://rxjs.dev/api/operators/map) RxJS operator to route specific `HttpEvent` responses to dispatch specific `Actions` that we have defined in our `Store`.

- Use the [`catchError`](https://rxjs.dev/api/operators/catchError) RxJS operator to handle any errors that may be thrown from the `HttpClient`.

The effect will look something like this:

```typescript
@Effect()
uploadRequestEffect$: Observable<Action> = this.actions$.pipe(
  ofType<featureActions.UploadRequestAction>(
    featureActions.ActionTypes.UPLOAD_REQUEST
  ),
  concatMap(action =>
    this.fileUploadService.uploadFile(action.payload.file).pipe(
      takeUntil(
        this.store$
          .select(featureSelectors.selectUploadFileCancelRequest)
          .pipe(
            filter(
              cancel =>
                cancel !== null && cancel !== undefined && cancel === true
            )
          )
      ),
      map(event => this.handleProgress(event)),
      catchError(error => of(this.handleError(error)))
    )
  )
);
```

#### Add the handleProgress private method

> For more information on listening to progress events, check out the [official docs guide from here](https://angular.io/guide/http#listening-to-progress-events).

This method will be responsible for mapping specific `HttpEventType` to `Actions` that are dispatched.

- `HttpEventType.Sent` - This event occurs when the upload process has begun. We will dispatch an `UPLOAD_PROGRESS` action with a payload of `progress: 0` to denote that the process has begun.

- `HttpEventType.UploadProgress` - This event occurs when the upload process has made progress. We will dispatch an `UPLOAD_PROGRESS` action with a payload of `progress: Math.round((100 * event.loaded) / event.total)` to calculate the actual percentage complete of upload. This is because the `HttpClient` returns an `event.loaded` and `event.total` property in whole number format.

- `HttpEventType.Response` - This event occurs when the upload process has finished. It is important to note that this could be a success or failure so we need to interrogate the `event.status` to check for `200`. We will dispatch the `UPLOAD_SUCCESS` action if `event.status === 200` and `UPLOAD_FAILURE` if the `event.status !== 200` passing the `event.statusText` as the error payload.

```typescript
private handleProgress(event: HttpEvent<any>) {
  switch (event.type) {
    case HttpEventType.Sent: {
      return new featureActions.UploadProgressAction({ progress: 0 });
    }
    case HttpEventType.UploadProgress: {
      return new featureActions.UploadProgressAction({
        progress: Math.round((100 * event.loaded) / event.total)
      });
    }
    case HttpEventType.Response: {
      if (event.status === 200) {
        return new featureActions.UploadSuccessAction();
      } else {
        return new featureActions.UploadFailureAction({
          error: event.statusText
        });
      }
    }
    default: {
      return new featureActions.UploadProgressAction({ progress: 0 });
    }
  }
}
```

#### Add the handleError private method

> For more information on handling `HttpClient` errors, check out the [official docs guide from here](https://angular.io/guide/http#getting-error-details).

This method will be responsible for handling any errors that may be throw from the `HttpClient` during requests. I am making use of a neat library named npm `serialize-error` to give me a predictable `error.message` no matter what type of error is thrown.

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
import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, takeUntil } from 'rxjs/operators';
import * as serializeError from 'serialize-error';
import { FileUploadService } from 'src/app/_services';
import * as fromFeatureActions from './actions';
import * as fromFeatureSelectors from './selectors';
import * as fromFeatureState from './state';

@Injectable()
export class UploadFileEffects {
  constructor(
    private fileUploadService: FileUploadService,
    private actions$: Actions,
    private store$: Store<fromFeatureState.State>
  ) {}

  @Effect()
  uploadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<fromFeatureActions.UploadRequestAction>(
      fromFeatureActions.ActionTypes.UPLOAD_REQUEST
    ),
    concatMap(action =>
      this.fileUploadService.uploadFile(action.payload.file).pipe(
        takeUntil(
          this.store$
            .select(fromFeatureSelectors.selectUploadFileCancelRequest)
            .pipe(
              filter(
                cancel =>
                  cancel !== null && cancel !== undefined && cancel === true
              )
            )
        ),
        map(event => this.onUploadProgress(event)),
        catchError(error => of(this.handleError(error)))
      )
    )
  );

  private onUploadProgress(event: HttpEvent<any>) {
    switch (event.type) {
      case HttpEventType.Sent: {
        return new fromFeatureActions.UploadProgressAction({ progress: 0 });
      }
      case HttpEventType.UploadProgress: {
        return new fromFeatureActions.UploadProgressAction({
          progress: Math.round((100 * event.loaded) / event.total)
        });
      }
      case HttpEventType.Response: {
        if (event.status === 200) {
          return new fromFeatureActions.UploadSuccessAction();
        } else {
          return new fromFeatureActions.UploadFailureAction({
            error: event.statusText
          });
        }
      }
      default: {
        return new fromFeatureActions.UploadProgressAction({ progress: 0 });
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

Create a new file underneath the `upload-file-store` folder, named `selectors.ts`. This file will hold the selectors we will use to pull specific pieces of state out of the store. These are not necessary, but make for a cleaner interaction with the store from the UI components.

We will create a selector for each significant property of state. This includes the following properties:

- `state.error`
- `state.isLoading`
- `state.completed`
- `state.progress`
- `state.cancel`

The completed selectors file will look something like the following:

```typescript
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { State } from './state';

const getError = (state: State): string => state.error;

const getIsLoading = (state: State): boolean => state.isLoading;

const getCompleted = (state: State): boolean => state.completed;

const getProgress = (state: State): number => state.progress;

const getCancelRequest = (state: State): boolean => state.cancel;

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

export const selectUploadFileIsLoading: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getIsLoading
);

export const selectUploadFileCompleted: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCompleted
);

export const selectUploadFileProgress: MemoizedSelector<
  object,
  number
> = createSelector(
  selectUploadFileFeatureState,
  getProgress
);

export const selectUploadFileCancelRequest: MemoizedSelector<
  object,
  boolean
> = createSelector(
  selectUploadFileFeatureState,
  getCancelRequest
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
  ],
  providers: [UploadFileEffects]
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
import { AppComponent } from './app.component';
import { UploadFileStoreModule } from './upload-file-store/upload-file-store.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
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

- An `input` element for the user to interact with to upload a file
- A progress percentage to connected to the `UploadFileStoreSelectors.selectUploadFileProgress` selector for real-time progress
- A cancel button to dispatch the `UploadFileStoreActions.UploadCancelRequest()` action
- A upload button to dispatch the `UploadFileStoreActions.UploadRequest()` action
- A reset button to dispatch the `UploadFileStoreActions.UploadResetRequest()` action and allow for a new file upload

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

Let's create three (3) public fields on the component. A good practice is to place `$` as a suffix so that you know these are `Observable` and must be subscribed to in the template.

```typescript
completed$: Observable<boolean>;
isLoading$: Observable<boolean>;
progress$: Observable<number>;
```

Let's hook these up to the store in our `ngOnInit` life-cycle hook.

```typescript
ngOnInit() {
  this.isLoading$ = this.store$.select(
    UploadFileStoreSelectors.selectUploadFileIsLoading
  );

  this.completed$ = this.store$.select(
    UploadFileStoreSelectors.selectUploadFileCompleted
  );

  this.progress$ = this.store$.select(
    UploadFileStoreSelectors.selectUploadFileProgress
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

#### Create some html view helper methods

Let's add some additional methods to help with our html template:

```typescript
isUploadInProgress(progress: number) {
  return progress > 0 && progress < 100;
}

isUploadWaitingToComplete(progress: number, completed: boolean) {
  return progress === 100 && !completed;
}
```

#### Finished Component \*.ts file

The finished component \*.ts file should look similar to the following:

```typescript
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
  error$: Observable<string>;

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

    this.error$ = this.store$.select(
      fromFeatureSelectors.selectUploadFileError
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
```

### Update the component \*.html template

We are going to add five (5) major parts to our upload file component.

#### Create wrapper div to resolve all the necessary async observables

> This could made a lot simpler by following a connected container -- dumb component architecture

Thanks Cory Rylan for this great [tip](https://coryrylan.com/blog/subscribing-to-multiple-observables-in-angular-components)!

Let's define an `ng-container` to wrap and resolve our async observables, `progress$` and `completed$`:

```html
<ng-container
  *ngIf="{ progress: progress$ | async, completed: completed$ | async, error: error$ | async } as values;"
>
  ...
</ng-container>
```

#### Add the input field

There is no upload file button, rather we will make use of the built-in input component and hook to the `change` event. Any time a file is added to the form this event will fire. We also only want to display this form if we are accepting new files to be uploaded. We will use the `*ngIf` structural directive to help here.

```html
<div
  class="message"
  *ngIf="!isUploadInProgress(values.progress) && !isUploadWaitingToComplete(values.progress, values.completed) && !values.completed"
>
  <input #file type="file" multiple (change)="uploadFile($event)" />
</div>
```

#### Add the indeterminate progress message

This message will be displayed when the progress is 100%, but we still haven't actually received back the `200` from the `HttpClient`. We will use `*ngIf` to only display if it's in this state.

```html
<div
  class="message"
  *ngIf="isUploadWaitingToComplete(values.progress, values.completed)"
>
  <div style="margin-bottom: 14px;">
    Uploading... Almost Complete...Waiting for Server...
  </div>
</div>
```

#### Add the determinate progress message

This message will be displayed when the progress is between 0% and 100%. We will use `*ngIf` to only display if it's in this state. We will set the `value` of the progress message to the actual `progress` from the selector.

```html
<div class="message" *ngIf="isUploadInProgress(values.progress)">
  <div style="margin-bottom: 14px;">Uploading... {{values.progress}}%</div>
</div>
```

#### Add the Cancel Upload button

This button will utilize the `*ngIf` to only display if the upload is in progress, or waiting to complete. The click event will trigger the dispatch of the `UploadCancelAction`.

```html
<div
  class="message"
  *ngIf="isUploadInProgress(progress) || isUploadWaitingToComplete(values.progress, values.completed)"
>
  <button (click)="cancelUpload()">Cancel Upload</button>
</div>
```

#### Add the Reset Upload button

This button will utilize the `*ngIf` to only display if the upload is complete. The click event will trigger the dispatch of the `UploadResetAction`.

```html
<div class="message" *ngIf="values.completed">
  <h4>
    File has been uploaded successfully!
  </h4>
  <button (click)="resetUpload()">Upload Another File</button>
</div>
```

#### Add the Error message

This button will utilize the `*ngIf` to only display if there is an error message on the store.

```html
<div class="message error" *ngIf="values.error">
  Error: {{ values.error }}
</div>
```

#### Finished Component \*.html file

```html
<ng-container
  *ngIf="{ progress: progress$ | async, completed: completed$ | async, error: error$ | async } as values;"
>
  <div
    class="message"
    *ngIf="!isUploadInProgress(values.progress) && !isUploadWaitingToComplete(values.progress, values.completed) && !values.completed"
  >
    <input #file type="file" multiple (change)="uploadFile($event)" />
  </div>

  <div
    class="message"
    *ngIf="isUploadWaitingToComplete(values.progress, values.completed)"
  >
    <div style="margin-bottom: 14px;">
      Uploading... Almost Complete...Waiting for Server...
    </div>
  </div>

  <div class="message" *ngIf="isUploadInProgress(values.progress)">
    <div style="margin-bottom: 14px;">Uploading... {{values.progress}}%</div>
  </div>

  <div
    class="message"
    *ngIf="isUploadInProgress(values.progress) || isUploadWaitingToComplete(values.progress, values.completed)"
  >
    <button (click)="cancelUpload()">Cancel Upload</button>
  </div>

  <div class="message" *ngIf="values.completed">
    <h4>
      File has been uploaded successfully!
    </h4>
    <button (click)="resetUpload()">Upload Another File</button>
  </div>

  <div class="message error" *ngIf="values.error">
    Error: {{ values.error }}
  </div>
</ng-container>
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
