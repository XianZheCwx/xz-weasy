type MapValue = Map<string | number, any>;
type StorageValue = string | number | object | any[] | MapValue;
interface FmStorage {
    [key: string]: any;
    __type__: string;
    __value__?: unknown;
    __dir__: string[];
}
export interface DynamicStorageConfig {
    key?: string;
    encode?: Function;
    decode?: Function;
}
interface SetConfig {
    beforeStorage?: Function;
    ignore?: boolean;
}
export declare class dynamicStorage {
    readonly LS: Storage;
    private readonly name;
    key: string | undefined;
    encode: Function | undefined;
    decode: Function | undefined;
    private fm;
    constructor(LS: Storage, name: string, { key, encode, decode }?: DynamicStorageConfig);
    has(key?: string): boolean;
    get(key?: string): any;
    set(value: StorageValue, key?: string, { beforeStorage, ignore }?: SetConfig): void;
    remove(key?: string): void;
    add<T = unknown>(data: T, key?: string): void;
    pop<T = unknown>(index: T, key?: string): void;
    getKey(key?: string, warn?: boolean): string;
    private transverter;
    private resolver;
    removeSpecial(storage: FmStorage, dir: string[]): FmStorage;
    load(value: StorageValue): FmStorage;
    parse(source?: string | null): unknown;
}
export {};
