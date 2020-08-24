import { Observable, fromEvent, from } from 'rxjs';
import { map, take, concatMap, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { IFileBatchProgress } from '../models/i-file-batch-progress';
import { IFileUploader } from './i-file-uploader';


export class FileUploader implements IFileUploader {

    private isCanceled: boolean;

    private progress: number = 0;

    constructor(
        private readonly file: File,
        private readonly sendPart: (data: ArrayBuffer | string, isLastBatch: boolean) => Observable<any>,
        private readonly batchSize: number = 1048576
    ) { }

    public upload(): Observable<IFileBatchProgress> {
        return new Observable<IFileBatchProgress>(sub => {
            const reader = new FileReader();
            const readerResult = this.readBatch(reader);
            this.getBatchIndices()
                .pipe(
                    concatMap(index => {
                        const total = index * this.batchSize;
                        let endByte = total + this.batchSize;
                        endByte = endByte >= this.file.size ? this.file.size : endByte;
                        console.log(`endByte: ${endByte}`, `file size: ${this.file.size}`, `total: ${total}`);
                        reader.readAsArrayBuffer(this.file.slice(total, endByte));
                        return readerResult
                            .pipe(
                                mergeMap(result => {
                                    return this.sendPart(result, endByte === this.file.size);
                                }),
                                tap(() => {
                                    this.progress = this.getProgress(total);
                                })
                            );
                    }),
                    takeWhile(() => !this.isCanceled)
                ).subscribe(
                    () => sub.next({ progress: this.progress, isSuccess: true }),
                    () => {
                        sub.next({ progress: this.progress, isError: true });
                        sub.complete();
                    },
                    () => {

                        if (this.isCanceled) {
                            sub.next({ progress: this.progress, isCanceled: true });
                        } else {
                            sub.next({ progress: this.progress, isFinish: true, isSuccess: true });
                        }

                        sub.complete();
                    });
        });
    }

    public cancel(): void {
        this.isCanceled = true;
    }

    private readBatch(reader: FileReader): Observable<string | ArrayBuffer | null> {
        return fromEvent(reader, 'load').pipe(
            map(() => reader.result),
            take(1)
        );
    }

    private getBatchIndices(): Observable<number> {
        return from([...Array(Math.ceil(this.file.size / this.batchSize)).keys()]);
    }

    private getProgress(startByte: number): number {
        const result = Math.floor((this.batchSize + startByte) / this.file.size * 100);
        return result > 100 ? 100 : result;
    }
}

