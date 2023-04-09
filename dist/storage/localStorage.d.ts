type MapValue = Map<string | number, any>;
type StorageValue = string | number | object | any[] | MapValue;
interface FmStorage {
    [key: string]: any;
    __type__: string;
    __value__?: unknown;
    __dir__: string[];
}
interface SetConfig {
    beforeStorage?: Function;
    ignore?: boolean;
}
export declare class DynamicStorage {
    #private;
    private readonly name;
    key?: string | undefined;
    LS: Storage;
    constructor(name: string, key?: string | undefined);
    get(key?: string): any;
    set(value: StorageValue, key?: string, { beforeStorage, ignore }?: SetConfig): void;
    remove(key?: string): void;
    add<T = unknown>(data: T, key?: string): void;
    pop<T = unknown>(index: T, key?: string): void;
    getKey(key?: string, warn?: boolean): string;
    load(value: StorageValue): FmStorage;
    parse(source?: string | null): unknown;
}
export {};
