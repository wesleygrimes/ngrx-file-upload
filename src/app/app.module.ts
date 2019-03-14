import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { UploadFileStoreModule } from './upload-file-store/upload-file-store.module';
import { UploadFileComponent } from './upload-file/upload-file.component';

@NgModule({
  declarations: [AppComponent, UploadFileComponent],
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
