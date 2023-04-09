"use strict";
export class DynamicStorage {
    name;
    key;
    LS = window.localStorage;
    #fm = {
        __type__: "",
        __value__: "",
        __dir__: ["__type__", "__value__", "__dir__"]
    };
    constructor(name, key) {
        this.name = name;
        this.key = key;
        this.name = name;
        this.key = key;
    }
    get(key) {
        const storage = this.LS.getItem(this.getKey(key));
        return this.parse(storage);
    }
    set(value, key, { beforeStorage, ignore = false } = {}) {
        const fkey = this.getKey(key);
        const storage = JSON.stringify(!ignore ? this.load(value) : value);
        beforeStorage && beforeStorage(fkey, storage);
        this.LS.setItem(fkey, storage);
    }
    remove(key) {
        this.LS.removeItem(this.getKey(key));
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
    #transverter(value, ignore = false) {
        let storage = {
            ...this.#fm,
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
    #resolver(source, original = false) {
        if (original) {
            return JSON.parse(source);
        }
        const fStorage = JSON.parse(source);
        const { __type__, __value__, __dir__ } = fStorage;
        switch (__type__) {
            case "map":
                const storage = this.#removeSpecial(fStorage, __dir__);
                return new Map(Object.entries(storage));
            case "object":
                return this.#removeSpecial(fStorage, __dir__);
            default:
                return __value__;
        }
    }
    #removeSpecial(storage, dir) {
        if (storage.constructor === Object) {
            for (const inlay of dir) {
                delete storage[inlay];
            }
        }
        return storage;
    }
    load(value) {
        return this.#transverter(value);
    }
    parse(source) {
        if (!source) {
            return source;
        }
        try {
            return this.#resolver(source);
        }
        catch {
            console.error("Json解析异常");
        }
    }
}
