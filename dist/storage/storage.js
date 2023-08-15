"use strict";
export class DynamicStorage {
    Storage;
    name;
    key;
    encode;
    decode;
    fm = {
        __type__: "",
        __value__: "",
        __dir__: ["__type__", "__value__", "__dir__"]
    };
    constructor(Storage, name, { key, encode, decode } = {}) {
        this.Storage = Storage;
        this.name = name;
        if (![window.localStorage, window.sessionStorage].includes(Storage)) {
            throw TypeError(`使用${this.constructor.name}类实例LS参数必须要传入Storage类型`);
        }
        this.Storage = Storage;
        this.name = name;
        this.key = key;
        if (encode && decode) {
            this.encode = encode;
            this.decode = decode;
        }
        else if (encode ?? decode) {
            console.warn("使用编码或解码功能，两者必须同时指定执行体");
        }
    }
    has(key) {
        return this.get(key) !== null;
    }
    get(key) {
        let storage = this.Storage.getItem(this.getKey(key));
        this.decode && storage && (storage = this.decode(storage));
        return this.parse(storage);
    }
    set(value, key, { beforeStorage, ignore = false } = {}) {
        const fkey = this.getKey(key);
        let storage = JSON.stringify(!ignore ? this.load(value) : value);
        beforeStorage && beforeStorage(fkey, storage);
        this.encode && (storage = this.encode(storage));
        this.Storage.setItem(fkey, storage);
    }
    remove(key) {
        this.Storage.removeItem(this.getKey(key));
    }
    add(data, key) {
        const storage = this.get(key);
        if (!storage) {
            return console.warn(`请先使用set方法存储数据`);
        }
        switch (true) {
            case storage?.constructor === Object:
                Object.assign(storage, data);
                break;
            case storage?.constructor === Map:
                let keyValues = [];
                if (data instanceof Map) {
                    keyValues = Array.from(data.entries());
                }
                else {
                    keyValues = Object.entries(data);
                }
                for (const [k, v] of keyValues) {
                    storage.set(k, v);
                }
                break;
            case Array.isArray(storage):
                storage.push(data);
                break;
            default:
                return console.warn(`很遗憾，所存储的数据类型为${typeof storage}，不支持该方法 `);
        }
        this.set(storage, key);
    }
    pop(index, key) {
        const storage = this.get(key);
        if (!storage) {
            return console.warn(`请先使用set方法存储数据`);
        }
        switch (true) {
            case storage?.constructor === Object:
                delete storage[index];
                break;
            case storage?.constructor === Map:
                storage.delete(index);
                break;
            case Array.isArray(storage):
                storage.splice(index, 1);
                break;
            default:
                return console.warn(`很遗憾，所存储的数据类型为${typeof storage}，不支持该方法 `);
        }
        this.set(storage, key);
    }
    getKey(key, warn) {
        if (!key && this.key) {
            return `${this.name}:${this.key}`;
        }
        if (!key && warn) {
            console.warn(`注意：并没有为${this.constructor.name}生成实例传入默认key！`);
        }
        return `${this.name}:${key}`;
    }
    transverter(value, ignore = false) {
        let storage = {
            ...this.fm,
            __type__: typeof value
        };
        switch (true) {
            case value.constructor === Map:
                storage.__type__ = "map";
                for (const [k, v] of value.entries()) {
                    storage[k] = v;
                }
                break;
            case value.constructor === Object:
                storage = { ...storage, ...value };
                break;
            case value.constructor === Array:
                storage.__type__ = "array";
                storage.__value__ = value;
                break;
            default:
                storage.__value__ = value;
        }
        return storage;
    }
    resolver(source, original = false) {
        if (original) {
            return JSON.parse(source);
        }
        const fStorage = JSON.parse(source);
        const { __type__, __value__, __dir__ } = fStorage;
        switch (__type__) {
            case "map":
                const storage = this.removeSpecial(fStorage, __dir__);
                return new Map(Object.entries(storage));
            case "object":
                return this.removeSpecial(fStorage, __dir__);
            default:
                return __value__;
        }
    }
    removeSpecial(storage, dir) {
        if (storage.constructor === Object) {
            for (const inlay of dir) {
                delete storage[inlay];
            }
        }
        return storage;
    }
    load(value) {
        return this.transverter(value);
    }
    parse(source) {
        if (!source) {
            return source;
        }
        try {
            return this.resolver(source);
        }
        catch {
            console.error("Json解析异常");
        }
    }
}
