import { IFileUploader } from '../file-uploader/i-file-uploader';

export abstract class FileUploadBase {
    public abstract createUploader(file: File, urlUpload: (isLastBatch: boolean) => string): IFileUploader;
}
