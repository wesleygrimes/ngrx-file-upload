import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UploadFileInputModel } from '@real-world-app/api-interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private _apiBaseUrl = '/api';
  constructor(private http: HttpClient) {}

  uploadFile(fileInput: UploadFileInputModel): Observable<HttpEvent<{}>> {
    const options = {
      reportProgress: true
    };

    const fileUpload = {
      fileName: fileInput.fileName,
      fileContent: this.setFileContent(fileInput.fileContent),
      fileType: fileInput.fileType
    };

    const req = new HttpRequest(
      'POST',
      `${this._apiBaseUrl}/uploadFile`,
      fileUpload,
      options
    );

    return this.http.request(req);
  }

  downloadFile(id: number) {
    return this.http.get<any>(`${this._apiBaseUrl}/downloadFile/${id}`);
  }

  private setFileContent(fileContent: string): string {
    return fileContent.split('base64,')[1];
  }
}
