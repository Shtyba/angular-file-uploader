import { Observable } from 'rxjs';
import { IFileBatchProgress } from '../models/i-file-batch-progress';

export interface IFileUploader {
    upload(): Observable<IFileBatchProgress>;
    cancel(): void;
}
