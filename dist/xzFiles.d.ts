export type FileType = File | Blob & {
    name?: string;
};
export interface FileConfig {
    filename: string;
    type: string;
}
export declare namespace Poller {
    type Fn = (success: () => void, fail: () => void, ...args: unknown[]) => Promise<unknown>;
    type FailFn = (...args: unknown[]) => unknown;
    interface Args {
        fn: Fn;
        failFn?: FailFn;
        meta?: unknown;
        interval?: number;
        timeout?: number;
    }
}
export declare function loadsBytes(bytes: ArrayBuffer, config?: FileConfig): File;
export declare function downloadFileSync(file: FileType | string, filename?: string): void;
export declare function downloadFile(file: FileType | string, ...args: any[]): Promise<void>;
export declare function poller<T = unknown>({ fn, failFn, meta, interval, timeout }: Poller.Args): Promise<T>;
