"use strict";
export class DynamicStorage {
    constructor(name, { key, encode, decode } = {}) {
        this.name = name;
        this.LS = window.localStorage;
        this.fm = {
            __type__: "",
            __value__: "",
            __dir__: ["__type__", "__value__", "__dir__"]
        };
        this.name = name;
        this.key = key;
        if (encode && decode) {
            this.encode = encode;
            this.decode = decode;
        }
        else if (encode !== null && encode !== void 0 ? encode : decode) {
            console.warn("使用编码或解码功能，两者必须同时指定执行体");
        }
    }
    has(key) {
        return this.get(key) !== null;
    }
    get(key) {
        let storage = this.LS.getItem(this.getKey(key));
        this.decode && storage && (storage = this.decode(storage));
        return this.parse(storage);
    }
    set(value, key, { beforeStorage, ignore = false } = {}) {
        const fkey = this.getKey(key);
        let storage = JSON.stringify(!ignore ? this.load(value) : value);
        beforeStorage && beforeStorage(fkey, storage);
        this.encode && (storage = this.encode(storage));
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
            case (storage === null || storage === void 0 ? void 0 : storage.constructor) === Object:
                Object.assign(storage, data);
                break;
            case (storage === null || storage === void 0 ? void 0 : storage.constructor) === Map:
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
            case (storage === null || storage === void 0 ? void 0 : storage.constructor) === Object:
                delete storage[index];
                break;
            case (storage === null || storage === void 0 ? void 0 : storage.constructor) === Map:
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
        let storage = Object.assign(Object.assign({}, this.fm), { __type__: typeof value });
        switch (true) {
            case value.constructor === Map:
                storage.__type__ = "map";
                for (const [k, v] of value.entries()) {
                    storage[k] = v;
                }
                break;
            case value.constructor === Object:
                storage = Object.assign(Object.assign({}, storage), value);
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
        catch (_a) {
            console.error("Json解析异常");
        }
    }
}
