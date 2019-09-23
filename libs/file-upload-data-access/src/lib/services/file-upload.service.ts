import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private _apiBaseUrl = '/api';
  constructor(private http: HttpClient) {}

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const httpOptions = {
      reportProgress: true
    };

    const req = new HttpRequest(
      'POST',
      `${this._apiBaseUrl}/upload`,
      formData,
      httpOptions
    );

    return this.http.request(req);
  }
}
