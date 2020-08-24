
export interface IFileBatchProgress {
    progress: number;
    isFinish?: boolean;
    isError?: boolean;
    isCanceled?: boolean;
    isSuccess?: boolean;
}
