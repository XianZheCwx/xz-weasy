"use strict";
import { dynamicStorage } from "../storage/storage";
export class lDynamicStorage extends dynamicStorage {
    constructor(...args) {
        super(window.localStorage, ...args);
    }
}
