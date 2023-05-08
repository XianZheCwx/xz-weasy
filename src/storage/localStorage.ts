"use strict";
import {dynamicStorage} from "@/storage/storage";
import type {DynamicStorageConfig} from "@/storage/storage";

export class lDynamicStorage extends dynamicStorage {
  constructor(...args: [string, DynamicStorageConfig]) {
    super(window.localStorage, ...args);
  }
}
