"use strict";
import {dynamicStorage} from "@/storage/storage";
import type {DynamicStorageConfig} from "@/storage/storage";

export class sDynamicStorage extends dynamicStorage {
  constructor(...args: [string, DynamicStorageConfig]) {
    super(window.sessionStorage, ...args);
  }
}
