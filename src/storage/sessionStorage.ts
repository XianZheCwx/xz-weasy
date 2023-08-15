"use strict";
import {DynamicStorage} from "@/storage/storage";
import type {DynamicStorageConfig} from "@/storage/storage";

export class DynamicSStorage extends DynamicStorage {
  constructor(...args: [string, DynamicStorageConfig]) {
    super(window.sessionStorage, ...args);
  }
}
