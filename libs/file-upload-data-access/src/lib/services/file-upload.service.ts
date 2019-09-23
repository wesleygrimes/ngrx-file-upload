import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileUploadModel } from '@real-world-app/shared-models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private _apiBaseUrl = '/api';
  constructor(private http: HttpClient) {}

  uploadFile(fileUpload: FileUploadModel): Observable<HttpEvent<{}>> {
    const httpOptions = {
      reportProgress: true
    };

    const postBody = {
      fileName: fileUpload.fileName,
      fileContent: fileUpload.fileContent.split('base64,')[1],
      fileType: fileUpload.fileType
    };

    const req = new HttpRequest(
      'POST',
      `${this._apiBaseUrl}/uploadFile`,
      postBody,
      httpOptions
    );

    return this.http.request(req);
  }
}
