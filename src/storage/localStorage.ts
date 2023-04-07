"use strict";

type MapValue = Map<string | number, any>
type StorageValue = string | number | object | any[] | MapValue;

interface FmStorage {
  __type__: string,
  value?: unknown
}

export class DynamicStorage {
  LS = window.localStorage;
  #typeMark = {
    "map": Map,
    "array": Array
  };

  constructor(private readonly name: string, public key?: string) {
    this.name = name;
    this.key = key;
  }

  get(key?: string): any {
    const storage = this.LS.getItem(this.getKey(key));
    if (storage) {
      return this.#parseStorage(storage);
    }
    return storage;
  }

  set(value: StorageValue, key?: string, beforeStorage?: Function) {
    const fkey = this.getKey(key);
    const storage = JSON.stringify(this.formatStorage(value));

    // 存储之前钩子
    beforeStorage && beforeStorage(fkey, storage);
    // 存储之前检查
    // TODO: 存储之前做的检查暂时没想到
    this.LS.setItem(fkey, storage);
  }

  remove(key?: string) {
    this.LS.removeItem(this.getKey(key));
  }


  add(data: unknown, key?: string) {
    const fkey = this.getKey(key);
    const storage = this.LS.getItem(fkey);
    if (!storage) {
      return;
    }

    const {__type__, value} = this.#parseStorage(storage, true);
    switch (value.constructor) {
      case Array:
        value.push(data);
        break;
      case Object:
        Object.assign(value, data);
        break;
      default:
        console.warn("抱歉, 存储的数据类型不支持add方法");
        return;
    }

    this.LS.setItem(fkey, JSON.stringify({__type__, value}));
  }

  pop(index: unknown) {
    this.LS;
  }

  getKey(key?: string, warn?: boolean) {
    if (!key && this.key) {
      return `${this.name}:${this.key}`;
    }
    if (!key && warn) {
      console.warn(`注意：并没有为${this.constructor.name}生成实例传入默认key！`);
    }
    return `${this.name}:${key}`;
  }

  formatStorage(value: StorageValue): FmStorage {
    const fm: FmStorage = {
      __type__: typeof value,
      value: ""
    };

    // 存储类型指定
    for (const [mark, type] of Object.entries(this.#typeMark)) {
      if (type === value.constructor) {
        fm.__type__ = mark;
        break;
      }
    }
    // 特殊存储类型数据解析处理
    switch (true) {
      // Map类型处理
      case value instanceof Map:
        const n: { [key: string]: any } = {};
        for (const [k, v] of (value as MapValue).entries()) {
          n[k] = v;
        }
        fm.value = n;
        break;

      default:
        fm.value = value;
    }

    return fm;
  }

  #parseStorage(source: string, original = false) {
    try {
      const {__type__, value} = JSON.parse(source);
      if (original) {
        return {__type__, value};
      }

      switch (__type__) {
        case "map":
          return new Map(Object.entries(value));
        default:
          return value;
      }
    } catch {
      console.error("Json解析异常");
    }
  }
}
