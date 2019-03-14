import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
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
    UploadFileStoreModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
