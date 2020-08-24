import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FileUploader } from '../file-uploader/file-uploader';
import { FileUploadBase } from './file-upload-base';
import { IFileUploader } from '../file-uploader/i-file-uploader';

@Injectable()
export class FileUploadService implements FileUploadBase {

  private readonly headers: HttpHeaders;

  constructor(
    private readonly httpClient: HttpClient,
  ) {
    this.headers = new HttpHeaders({ 'Content-Type': `application/octet-stream` });
  }

  public createUploader(file: File, urlUpload: (isLastBatch: boolean) => string): IFileUploader {
    return new FileUploader
      (
        file,
        (data, isLastBatch) => this.httpClient.post(urlUpload(isLastBatch), data, { headers: this.headers })
      );
  }

}
