declare type ExeFunc = () => unknown | Promise<unknown>;
declare type ExeReturn = [boolean, () => void];
export declare function useMain(func: ExeFunc, execute?: boolean): ExeReturn;
export declare function useExit(func: ExeFunc, execute?: boolean): ExeReturn;
export {};
