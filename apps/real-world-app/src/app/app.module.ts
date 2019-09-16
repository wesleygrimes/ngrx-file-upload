import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FileUploadModule } from '@real-world-app/file-upload';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FileUploadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
