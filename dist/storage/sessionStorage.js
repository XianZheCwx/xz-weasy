"use strict";
import { dynamicStorage } from "../storage/storage";
export class sDynamicStorage extends dynamicStorage {
    constructor(...args) {
        super(window.sessionStorage, ...args);
    }
}
