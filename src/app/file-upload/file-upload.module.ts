import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadService } from './service/file-upload.service';
import { HttpClientModule } from '@angular/common/http';
import { FileUploadBase } from './service/file-upload-base';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: FileUploadBase, useClass: FileUploadService }
  ]
})
export class FileUploadModule { }
