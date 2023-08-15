"use strict";
import { DynamicStorage } from "@/storage/storage";
export class DynamicSStorage extends DynamicStorage {
    constructor(...args) {
        super(window.sessionStorage, ...args);
    }
}
