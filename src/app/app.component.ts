import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { FileUploadBase } from './file-upload/service/file-upload-base';
import { IFileUploader } from './file-upload/file-uploader/i-file-uploader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'upload-test';

  @ViewChild('inputFile', { static: false })
  public inputFile: ElementRef<HTMLInputElement>;

  constructor(
    private readonly fileUploadService: FileUploadBase,
    private readonly httpClient: HttpClient
  ) {

  }

  private uploader: IFileUploader;

  cancel() {
    this.uploader.cancel();
  }

  ngAfterViewInit(): void {
    fromEvent<any>(this.inputFile.nativeElement, 'change')
      .pipe(
        mergeMap(event => {
          const fileList = event.target.files as FileList;
          const file = fileList.item(0);
          const array = file.name.split('.');
          if (!file) {
            return of();
          }
          this.inputFile.nativeElement.value = '';
          return this.httpClient.get<number>(`http://localhost:3200/upload-file/${array[array.length - 1]}`)
            .pipe(
              map(id =>
                this.fileUploadService.createUploader(file, (isLastBatch) => `http://localhost:3200/upload-file/${id}/${isLastBatch}`)
              ),
              mergeMap(res => {
                this.uploader = res;
                return res.upload();
              })
            );
        }),

      ).subscribe(x => console.log(x));
  }
}
