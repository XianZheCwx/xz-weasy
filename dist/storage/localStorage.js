"use strict";
import { DynamicStorage } from "@/storage/storage";
export class DynamicLStorage extends DynamicStorage {
    constructor(...args) {
        super(window.localStorage, ...args);
    }
}
